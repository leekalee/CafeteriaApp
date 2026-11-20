import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_ACTIVE_ORDER,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DISHES,
  INITIAL_GROUP_ITEMS,
  INITIAL_GROUP_MEMBERS,
  INITIAL_ORDER_HISTORY,
  INITIAL_POLL,
  INITIAL_PROFILE,
  UNIVERSITIES,
} from '../data/mockData';
import {
  ActiveOrder,
  ChatMessage,
  DietaryPreferences,
  Dish,
  GroupCartItem,
  GroupMember,
  OrderHistoryItem,
  OrderStage,
  PaymentMethod,
  QueueStatus,
  ScreenId,
  StudentProfile,
  TomorrowPoll,
  University,
} from '../types/campus';

const STORAGE_KEY = 'campusbite_bishkek_state_v1';

interface PersistedState {
  screen: ScreenId;
  language: 'RU' | 'KG';
  queueStatus: QueueStatus;
  selectedDishId: string;
  selectedSlotLabel: string;
  profile: StudentProfile;
  dishes: Dish[];
  activeOrder: ActiveOrder | null;
  orderHistory: OrderHistoryItem[];
  chatMessages: ChatMessage[];
  groupMembers: GroupMember[];
  groupItems: GroupCartItem[];
  groupPayment: PaymentMethod;
  poll: TomorrowPoll;
  unreadChatCount: number;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CampusBiteContextValue extends PersistedState {
  currentUniversity: University;
  currentBuilding: University['buildings'][number];
  toast: ToastState | null;
  focusChatOnTracker: boolean;
  setFocusChatOnTracker: (v: boolean) => void;
  navigate: (screen: ScreenId, options?: { focusChat?: boolean }) => void;
  setLanguage: (lang: 'RU' | 'KG') => void;
  setQueueStatus: (status: QueueStatus) => void;
  openDishDetail: (dishId: string, slotLabel?: string) => void;
  setUniversityAndBuilding: (universityId: string, buildingId?: string) => void;
  verifyStudent: (method: 'photo' | 'email', email?: string) => void;
  placeOrder: (params: {
    dishId: string;
    slotTime: string;
    addons: { id: string; label: string; price: number }[];
    paymentMethod: PaymentMethod;
  }) => boolean;
  placeGroupOrder: () => boolean;
  setOrderStage: (stage: OrderStage) => void;
  sendChatMessage: (text: string) => void;
  votePoll: (choice: 'manti' | 'lagman') => void;
  topUpBalance: (amount: number, source: 'MBank' | 'O!Деньги') => void;
  toggleDietary: (key: keyof DietaryPreferences) => void;
  toggleFavorite: (dishId: string) => void;
  toggleGroupMember: (id: string) => void;
  addGroupMember: (name: string) => void;
  updateGroupItemQty: (dishId: string, delta: number) => void;
  setGroupPayment: (method: PaymentMethod) => void;
  showToast: (message: string, type?: ToastState['type']) => void;
  resetDemo: () => void;
}

const defaultState: PersistedState = {
  screen: 'onboarding',
  language: 'RU',
  queueStatus: 'free',
  selectedDishId: 'lagman-combo',
  selectedSlotLabel: '11:55 - 12:25 (Большая перемена)',
  profile: INITIAL_PROFILE,
  dishes: INITIAL_DISHES,
  activeOrder: INITIAL_ACTIVE_ORDER,
  orderHistory: INITIAL_ORDER_HISTORY,
  chatMessages: INITIAL_CHAT_MESSAGES,
  groupMembers: INITIAL_GROUP_MEMBERS,
  groupItems: INITIAL_GROUP_ITEMS,
  groupPayment: 'MBank',
  poll: INITIAL_POLL,
  unreadChatCount: 1,
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState,
      ...parsed,
      profile: {
        ...INITIAL_PROFILE,
        ...(parsed.profile || {}),
        dietary: {
          ...INITIAL_PROFILE.dietary,
          ...(parsed.profile?.dietary || {}),
        },
      },
      dishes: parsed.dishes?.length ? parsed.dishes : INITIAL_DISHES,
    };
  } catch {
    return defaultState;
  }
}

const CampusBiteContext = createContext<CampusBiteContextValue | null>(null);

export const CampusBiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [focusChatOnTracker, setFocusChatOnTracker] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Live countdown ticker for active order warm-hold timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((prev) => {
        if (!prev.activeOrder) return prev;
        if (prev.activeOrder.warmHoldSeconds <= 0) return prev;
        return {
          ...prev,
          activeOrder: {
            ...prev.activeOrder,
            warmHoldSeconds: Math.max(0, prev.activeOrder.warmHoldSeconds - 1),
          },
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    window.setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3000);
  };

  const currentUniversity = useMemo(
    () => UNIVERSITIES.find((u) => u.id === state.profile.universityId) || UNIVERSITIES[0],
    [state.profile.universityId]
  );

  const currentBuilding = useMemo(
    () =>
      currentUniversity.buildings.find((b) => b.id === state.profile.buildingId) ||
      currentUniversity.buildings[0],
    [currentUniversity, state.profile.buildingId]
  );

  const navigate = (screen: ScreenId, options?: { focusChat?: boolean }) => {
    setFocusChatOnTracker(Boolean(options?.focusChat));
    setState((prev) => ({
      ...prev,
      screen,
      unreadChatCount: screen === 'tracker' && options?.focusChat ? 0 : prev.unreadChatCount,
    }));
  };

  const setLanguage = (language: 'RU' | 'KG') => {
    setState((prev) => ({ ...prev, language }));
    showToast(language === 'KG' ? 'Тил: Кыргызча 🇰🇬' : 'Язык: Русский', 'info');
  };

  const setQueueStatus = (queueStatus: QueueStatus) => {
    setState((prev) => ({ ...prev, queueStatus }));
  };

  const openDishDetail = (dishId: string, slotLabel?: string) => {
    setState((prev) => ({
      ...prev,
      selectedDishId: dishId,
      selectedSlotLabel: slotLabel || prev.selectedSlotLabel,
      screen: 'dish-detail',
    }));
  };

  const setUniversityAndBuilding = (universityId: string, buildingId?: string) => {
    const uni = UNIVERSITIES.find((u) => u.id === universityId) || UNIVERSITIES[0];
    const bld = uni.buildings.find((b) => b.id === buildingId) || uni.buildings[0];
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        universityId: uni.id,
        buildingId: bld.id,
        email: prev.profile.email.includes('@')
          ? `${prev.profile.email.split('@')[0]}@${uni.domain}`
          : `a.ibraev@${uni.domain}`,
      },
    }));
  };

  const verifyStudent = (method: 'photo' | 'email', email?: string) => {
    setState((prev) => ({
      ...prev,
      screen: 'menu',
      profile: {
        ...prev.profile,
        isVerified: true,
        verificationMethod: method,
        email: email || prev.profile.email,
      },
    }));
    showToast('Студент верифицирован! Скидка 20% активна 🎓');
  };

  const placeOrder: CampusBiteContextValue['placeOrder'] = ({
    dishId,
    slotTime,
    addons,
    paymentMethod,
  }) => {
    const dish = state.dishes.find((d) => d.id === dishId);
    if (!dish) return false;
    if (dish.stock <= 0) {
      showToast('Упс, порции этого блюда только что разобрали!', 'warning');
      return false;
    }

    const addonsSum = addons.reduce((acc, a) => acc + a.price, 0);
    const totalPrice = dish.price + addonsSum;

    if (paymentMethod === 'Студенческий баланс' && state.profile.balance < totalPrice) {
      showToast('Недостаточно сомов на балансе — пополните в профиле или выберите MBank', 'warning');
      return false;
    }

    const uniPrefix = currentUniversity.shortName.split(' ')[0].toUpperCase().slice(0, 4);
    const num = Math.floor(400 + Math.random() * 599);
    const newOrderId = `#${uniPrefix}-${num}`;
    const secretCode = `${num}-${uniPrefix[0]}`;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const savingsOnDish = Math.max(20, dish.originalPrice - dish.price);
    const cashbackEarned = Math.round((totalPrice * state.profile.cashbackPercent) / 100);

    const newOrder: ActiveOrder = {
      id: newOrderId,
      secretCode,
      dishId: dish.id,
      title: dish.shortName,
      subtitle: `${dish.weight}${addons.length ? ` • ${addons.map((a) => a.label).join(', ')}` : ''}`,
      canteenLocation: `${currentUniversity.shortName} • ${currentBuilding.canteenName}`,
      slotTime,
      totalPrice,
      paymentMethod,
      addons: addons.map((a) => a.label),
      stage: 1,
      createdAtTime: `${hh}:${mm}`,
      etaMinutes: state.queueStatus === 'free' ? 4 : state.queueStatus === 'medium' ? 8 : 12,
      warmHoldSeconds: 18 * 60,
    };

    const previousToHistory: OrderHistoryItem[] = state.activeOrder
      ? [
          {
            id: state.activeOrder.id,
            dateLabel: `Сегодня, ${state.activeOrder.createdAtTime}`,
            title: state.activeOrder.title,
            totalPrice: state.activeOrder.totalPrice,
            savedAmount: 35,
            paymentMethod: state.activeOrder.paymentMethod,
            canteen: state.activeOrder.canteenLocation,
          },
          ...state.orderHistory,
        ]
      : state.orderHistory;

    setState((prev) => ({
      ...prev,
      screen: 'tracker',
      dishes: prev.dishes.map((d) =>
        d.id === dish.id
          ? { ...d, stock: Math.max(0, d.stock - 1), orderedToday: d.orderedToday + 1 }
          : d
      ),
      activeOrder: newOrder,
      orderHistory: previousToHistory,
      profile: {
        ...prev.profile,
        balance:
          paymentMethod === 'Студенческий баланс'
            ? prev.profile.balance - totalPrice + cashbackEarned
            : prev.profile.balance + cashbackEarned,
        savedSom: prev.profile.savedSom + savingsOnDish,
        savedMinutes: prev.profile.savedMinutes + 15,
      },
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'cook',
          authorName: 'Гульмира эже',
          text: `Вижу новый заказ ${newOrderId} (${dish.shortName})! Подадим горячим к слоту ${slotTime.split('(')[0].trim()}.`,
          timestamp: `${hh}:${mm}`,
        },
      ],
      unreadChatCount: prev.unreadChatCount + 1,
    }));

    setFocusChatOnTracker(false);
    showToast(`Порция забронирована! ${newOrderId} (+${cashbackEarned} сом кэшбэк)`);
    return true;
  };

  const placeGroupOrder = () => {
    const activeMembers = state.groupMembers.filter((m) => m.selected);
    const activeItems = state.groupItems.filter((i) => i.qty > 0);
    if (activeMembers.length === 0 || activeItems.length === 0) {
      showToast('Выберите хотя бы одного участника и одно блюдо', 'warning');
      return false;
    }

    const totalPrice = activeItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const totalQty = activeItems.reduce((sum, item) => sum + item.qty, 0);
    const perPerson = Math.round((totalPrice / activeMembers.length) * 10) / 10;

    if (state.groupPayment === 'Студенческий баланс' && state.profile.balance < perPerson) {
      showToast('Недостаточно сомов на балансе для вашей доли', 'warning');
      return false;
    }

    const uniPrefix = currentUniversity.shortName.split(' ')[0].toUpperCase().slice(0, 4);
    const num = Math.floor(500 + Math.random() * 499);
    const newOrderId = `#${uniPrefix}-${num}`;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const summary = activeItems.map((i) => `${i.name} ×${i.qty}`).join(' + ');

    const groupOrder: ActiveOrder = {
      id: newOrderId,
      secretCode: `${num}-G`,
      dishId: activeItems[0].dishId,
      title: `Групповой поднос ${state.profile.group} (${totalQty} поз.)`,
      subtitle: `${summary} • По ${perPerson} с на человека (${activeMembers.length} чел.)`,
      canteenLocation: `${currentUniversity.shortName} • ${currentBuilding.canteenName}`,
      slotTime: '11:55 - 12:25 (Большая перемена)',
      totalPrice,
      paymentMethod: state.groupPayment,
      addons: [`Сплит на ${activeMembers.length} чел. по ${perPerson} с`],
      stage: 1,
      createdAtTime: `${hh}:${mm}`,
      etaMinutes: 6,
      warmHoldSeconds: 20 * 60,
      isGroupOrder: true,
      groupParticipants: activeMembers.length,
    };

    setState((prev) => ({
      ...prev,
      screen: 'tracker',
      activeOrder: groupOrder,
      profile: {
        ...prev.profile,
        savedSom: prev.profile.savedSom + 95,
        savedMinutes: prev.profile.savedMinutes + 25,
      },
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-${Date.now()}`,
          sender: 'cook',
          authorName: 'Гульмира эже',
          text: `Приняли большой групповой поднос ${newOrderId} для ${state.profile.group}! Соберем всё на один большой разнос у стойки №2.`,
          timestamp: `${hh}:${mm}`,
        },
      ],
    }));

    setFocusChatOnTracker(false);
    showToast(`Групповой заказ ${newOrderId} оформлен! По ${perPerson} с с каждого`);
    return true;
  };

  const setOrderStage = (stage: OrderStage) => {
    setState((prev) => {
      if (!prev.activeOrder) return prev;
      return {
        ...prev,
        activeOrder: {
          ...prev.activeOrder,
          stage,
          etaMinutes: stage === 1 ? 6 : stage === 2 ? 3 : 0,
        },
      };
    });
    const labels: Record<OrderStage, string> = {
      1: 'Статус: 1. Заказ принят кухней',
      2: 'Статус: 2. Шкворчит и готовится 🔥',
      3: 'Статус: 3. Ждет на стойке экспресс-выдачи №2! 🚀',
    };
    showToast(labels[stage], stage === 3 ? 'success' : 'info');
  };

  const sendChatMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const msgId = `msg-${Date.now()}`;

    setState((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: msgId,
          sender: 'student',
          authorName: prev.profile.shortName,
          text: clean,
          timestamp: `${hh}:${mm}`,
        },
      ],
    }));

    window.setTimeout(() => {
      const lower = clean.toLowerCase();
      let reply = 'Хорошо, Азамат! Всё отметили на твоем заказе 👍';
      if (lower.includes('задерж')) {
        reply = 'Без проблем, сынок! Подержим в теплой витрине еще 15 минут, не остынет ♨️';
      } else if (lower.includes('прибор') || lower.includes('салфет')) {
        reply = 'Положили двойной комплект приборов и побольше салфеток на поднос!';
      } else if (lower.includes('собой') || lower.includes('контейнер')) {
        reply = 'Упаковали всё аккуратно в термо-контейнеры с собой!';
      }

      const replyTime = new Date();
      const rhh = String(replyTime.getHours()).padStart(2, '0');
      const rmm = String(replyTime.getMinutes()).padStart(2, '0');

      setState((prev) => ({
        ...prev,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `reply-${Date.now()}`,
            sender: 'cook',
            authorName: 'Гульмира эже',
            text: reply,
            timestamp: `${rhh}:${rmm}`,
          },
        ],
      }));
    }, 900);
  };

  const votePoll = (choice: 'manti' | 'lagman') => {
    setState((prev) => {
      if (prev.poll.userChoice === choice) return prev;
      let manti = prev.poll.mantiVotes;
      let lagman = prev.poll.lagmanVotes;
      if (prev.poll.userChoice === 'manti') manti = Math.max(0, manti - 1);
      if (prev.poll.userChoice === 'lagman') lagman = Math.max(0, lagman - 1);
      if (choice === 'manti') manti += 1;
      else lagman += 1;
      return {
        ...prev,
        poll: {
          mantiVotes: manti,
          lagmanVotes: lagman,
          userChoice: choice,
        },
      };
    });
    showToast('Голос учтен! Шеф уже смотрит статистику 👨‍🍳');
  };

  const topUpBalance = (amount: number, source: 'MBank' | 'O!Деньги') => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        balance: prev.profile.balance + amount,
      },
    }));
    showToast(`Баланс пополнен на +${amount} сом через ${source}`);
  };

  const toggleDietary = (key: keyof DietaryPreferences) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        dietary: {
          ...prev.profile.dietary,
          [key]: !prev.profile.dietary[key],
        },
      },
    }));
  };

  const toggleFavorite = (dishId: string) => {
    setState((prev) => {
      const exists = prev.profile.favorites.includes(dishId);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          favorites: exists
            ? prev.profile.favorites.filter((id) => id !== dishId)
            : [...prev.profile.favorites, dishId],
        },
      };
    });
  };

  const toggleGroupMember = (id: string) => {
    setState((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.map((m) =>
        m.id === id ? { ...m, selected: !m.selected } : m
      ),
    }));
  };

  const addGroupMember = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    const parts = clean.split(/\s+/);
    const initials = (parts[0]?.[0] || 'С') + (parts[1]?.[0] || parts[0]?.[1] || 'Т');
    const colors = ['#D7E8CE', '#FCE2C4', '#DCE7DB', '#F4E4C8'];
    setState((prev) => ({
      ...prev,
      groupMembers: [
        ...prev.groupMembers,
        {
          id: `m-${Date.now()}`,
          initials: initials.toUpperCase(),
          name: clean,
          color: colors[prev.groupMembers.length % colors.length],
          selected: true,
        },
      ],
    }));
    showToast(`${clean} добавлен(а) в общий счет!`);
  };

  const updateGroupItemQty = (dishId: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      groupItems: prev.groupItems.map((item) =>
        item.dishId === dishId
          ? { ...item, qty: Math.max(0, Math.min(10, item.qty + delta)) }
          : item
      ),
    }));
  };

  const setGroupPayment = (groupPayment: PaymentMethod) => {
    setState((prev) => ({ ...prev, groupPayment }));
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    showToast('Демо-данные сброшены', 'info');
  };

  return (
    <CampusBiteContext.Provider
      value={{
        ...state,
        currentUniversity,
        currentBuilding,
        toast,
        focusChatOnTracker,
        setFocusChatOnTracker,
        navigate,
        setLanguage,
        setQueueStatus,
        openDishDetail,
        setUniversityAndBuilding,
        verifyStudent,
        placeOrder,
        placeGroupOrder,
        setOrderStage,
        sendChatMessage,
        votePoll,
        topUpBalance,
        toggleDietary,
        toggleFavorite,
        toggleGroupMember,
        addGroupMember,
        updateGroupItemQty,
        setGroupPayment,
        showToast,
        resetDemo,
      }}
    >
      {children}
    </CampusBiteContext.Provider>
  );
};

export function useCampusBite() {
  const ctx = useContext(CampusBiteContext);
  if (!ctx) throw new Error('useCampusBite must be used inside CampusBiteProvider');
  return ctx;
}
