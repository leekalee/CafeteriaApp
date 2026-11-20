import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  Clock,
  Copy,
  Flame,
  MapPin,
  Play,
  Send,
  ShieldCheck,
  Store,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import { IMAGES } from '../data/mockData';
import { useCampusBite } from '../context/CampusBiteContext';
import { OrderStage } from '../types/campus';
import { QrMatrixSvg } from '../components/QrMatrixSvg';

export const TrackerScreen: React.FC = () => {
  const {
    profile,
    currentUniversity,
    activeOrder,
    chatMessages,
    focusChatOnTracker,
    setFocusChatOnTracker,
    setOrderStage,
    sendChatMessage,
    navigate,
    showToast,
  } = useCampusBite();

  const [chatText, setChatText] = useState('');
  const [autoSim, setAutoSim] = useState(false);
  const chatSectionRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to chat if opened via BottomNav "Чат" tab
  useEffect(() => {
    if (focusChatOnTracker && chatSectionRef.current) {
      chatSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => chatInputRef.current?.focus(), 350);
      setFocusChatOnTracker(false);
    }
  }, [focusChatOnTracker, setFocusChatOnTracker]);

  // Optional auto-simulator for live order progression
  useEffect(() => {
    if (!autoSim || !activeOrder) return;
    if (activeOrder.stage >= 3) {
      setAutoSim(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setOrderStage((activeOrder.stage + 1) as OrderStage);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [autoSim, activeOrder, setOrderStage]);

  const warmMins = activeOrder ? Math.floor(activeOrder.warmHoldSeconds / 60) : 18;
  const warmSecs = activeOrder ? activeOrder.warmHoldSeconds % 60 : 0;
  const warmFormatted = `${String(warmMins).padStart(2, '0')}:${String(warmSecs).padStart(2, '0')}`;

  const handleCopyCode = async () => {
    if (!activeOrder) return;
    try {
      await navigator.clipboard.writeText(activeOrder.secretCode);
    } catch {
      // ignore
    }
    showToast(`Код ${activeOrder.secretCode} скопирован!`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    sendChatMessage(chatText);
    setChatText('');
  };

  const quickChips = [
    { label: '🏃 Задержусь на 5 мин', text: 'Задержусь на 5 минут, подержите пожалуйста!' },
    { label: '🥢 Положите приборы', text: 'Положите приборы, пожалуйста!' },
    { label: '🙏 Больше салфеток', text: 'Положите побольше салфеток, пожалуйста!' },
    { label: '🥡 С собой', text: 'Упакуйте, пожалуйста, с собой в контейнер!' },
  ];

  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center bg-[#F7F8F4]">
        <div className="w-16 h-16 rounded-full bg-[#EAF3E5] text-[#4D6A42] flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h2 className="text-[19px] font-extrabold text-[#1C261B]">Пока нет активных заказов</h2>
        <p className="text-[13px] text-[#5E6E5A] mt-1.5 mb-5">
          Выбери горячее блюдо в меню дня — и здесь сразу появится твой экспресс-QR!
        </p>
        <button
          type="button"
          onClick={() => navigate('menu')}
          className="bg-[#4D6A42] text-white font-extrabold text-sm px-6 py-3 rounded-full"
        >
          Открыть меню столовой
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B] pb-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[18px] font-extrabold text-[#1C261B]">Мой QR</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Перейти к чату"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E9DF] flex items-center justify-center text-[#1C261B]"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('profile')}
            aria-label="Профиль"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm"
          >
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="px-4 space-y-3.5">
        {/* Order Header Card */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#3B5233] text-white font-mono-num text-[12px] font-bold px-2.5 py-1 rounded-lg">
              {activeOrder.id}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#FFF1DB] text-[#9A5B13] text-[11.5px] font-extrabold px-2.5 py-1 rounded-full tabular-nums">
              <Clock className="w-3.5 h-3.5" />
              {activeOrder.stage === 3
                ? 'Готов на стойке №2!'
                : `Готов через 0${activeOrder.etaMinutes}:14 мин`}
            </span>
          </div>

          <h1 className="text-[19px] font-extrabold text-[#1C261B] leading-snug">
            {activeOrder.title}
          </h1>

          <div className="text-[12.5px] text-[#5E6E5A]">🍲 {activeOrder.subtitle}</div>

          <div className="flex items-center justify-between pt-1 border-t border-[#F0F3EC]">
            <div className="flex items-center gap-1 text-[11.5px] text-[#5E6E5A] truncate">
              <MapPin className="w-3.5 h-3.5 text-[#4D6A42] shrink-0" />
              <span className="truncate">{activeOrder.canteenLocation}</span>
            </div>
            <span className="text-[19px] font-extrabold text-[#3E5C34] tabular-nums shrink-0">
              {activeOrder.totalPrice} сом
            </span>
          </div>
        </div>

        {/* Interactive Live Order Status Simulator */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14.5px] font-extrabold text-[#1C261B]">
              Этапы готовности к звонку
            </h2>
            <span className="bg-[#FFF1DB] text-[#9A5B13] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full tabular-nums">
              Шаг {activeOrder.stage} из 3
            </span>
          </div>

          <div className="space-y-3 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#E5E9DF]" />

            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setOrderStage(1)}
              className="w-full relative flex items-start gap-3 text-left group"
            >
              <span
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  activeOrder.stage >= 1
                    ? 'bg-[#3B5233] border-[#3B5233] text-white'
                    : 'bg-[#F7F8F4] border-[#DCE4D7] text-[#8E9B8A]'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-extrabold text-[#1C261B]">
                    1. Повара в деле! (Принят)
                  </span>
                  <span className="text-[11px] font-semibold text-[#5E6E5A] tabular-nums">
                    {activeOrder.createdAtTime}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#5E6E5A]">
                  {activeOrder.paymentMethod} звякнул, оплата залетела
                </p>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setOrderStage(2)}
              className="w-full relative flex items-start gap-3 text-left"
            >
              <span
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  activeOrder.stage > 2
                    ? 'bg-[#3B5233] border-[#3B5233] text-white'
                    : activeOrder.stage === 2
                    ? 'bg-[#FFF1DB] border-[#E59838] text-[#B25C08]'
                    : 'bg-[#F7F8F4] border-[#DCE4D7] text-[#8E9B8A]'
                }`}
              >
                {activeOrder.stage > 2 ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Flame className="w-4 h-4" />
                )}
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[13.5px] font-extrabold ${
                      activeOrder.stage === 2 ? 'text-[#9A5B13]' : 'text-[#1C261B]'
                    }`}
                  >
                    2. Шкворчит и варится! (Готовится)
                  </span>
                  <span className="text-[11px] font-bold text-[#B25C08]">
                    {activeOrder.stage === 2 ? 'Сейчас' : activeOrder.stage > 2 ? 'Готово' : 'Ожидание'}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#5E6E5A]">
                  Шеф раскладывает по тарелкам 🔥
                </p>
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setOrderStage(3)}
              className="w-full relative flex items-start gap-3 text-left"
            >
              <span
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                  activeOrder.stage === 3
                    ? 'bg-[#4D6A42] border-[#4D6A42] text-white shadow-sm'
                    : 'bg-[#EAF3E5] border-[#DCE4D7] text-[#5E6E5A]'
                }`}
              >
                <Store className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[13.5px] font-extrabold ${
                      activeOrder.stage === 3 ? 'text-[#2F4B26]' : 'text-[#5E6E5A]'
                    }`}
                  >
                    3. Окошко №2: без очереди!
                  </span>
                  <span className="text-[11px] font-bold text-[#4D6A42] tabular-nums">
                    {activeOrder.stage === 3 ? 'Готово 🚀' : '~11:50'}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#5E6E5A]">
                  Ожидает на стойке экспресс-выдачи №2 — забирай без очереди!
                </p>
              </div>
            </button>
          </div>

          {/* Interactive Simulator Controls */}
          <div className="pt-2 border-t border-[#F0F3EC] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {([1, 2, 3] as OrderStage[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setAutoSim(false);
                    setOrderStage(st);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
                    activeOrder.stage === st
                      ? 'bg-[#4D6A42] text-white'
                      : 'bg-[#F4F6F0] text-[#5E6E5A] hover:text-[#1C261B]'
                  }`}
                >
                  Этап {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (activeOrder.stage === 3) {
                  setOrderStage(1);
                }
                setAutoSim((v) => !v);
              }}
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border transition-colors ${
                autoSim
                  ? 'bg-[#FFF1DB] border-[#E59838] text-[#9A5B13]'
                  : 'bg-[#EAF3E5] border-[#D8E7D0] text-[#2F4B26]'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>{autoSim ? 'Симуляция...' : 'Авто-симулятор'}</span>
            </button>
          </div>
        </div>

        {/* QR Pass Card */}
        <div className="bg-white rounded-[24px] border border-[#E5E9DF] overflow-hidden shadow-xs">
          <div className="bg-[#EAF3E5] px-4 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[13.5px] font-extrabold text-[#1C261B]">
                  <span className="truncate">{profile.shortName}</span>
                  <ShieldCheck className="w-4 h-4 text-[#4D6A42] shrink-0" />
                </div>
                <div className="text-[11px] text-[#5E6E5A] truncate">
                  {profile.group} • Студ. билет
                </div>
              </div>
            </div>
            <span className="bg-white text-[#2F4B26] text-[10.5px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
              {currentUniversity.shortName}
            </span>
          </div>

          <div className="p-4 flex flex-col items-center text-center">
            <QrMatrixSvg value={`${activeOrder.id}-${activeOrder.secretCode}`} size={184} />

            <h3 className="text-[16px] font-extrabold text-[#1C261B] mt-2">
              Сунь QR в сканер на Стойке №2! 😎
            </h3>
            <p className="text-[12px] text-[#5E6E5A] mt-0.5 max-w-[260px]">
              Пикнешь кодом — и поднос с горячей едой мгновенно у тебя в руках
            </p>

            <button
              type="button"
              onClick={handleCopyCode}
              className="mt-3 w-full bg-[#EAF3E5] hover:bg-[#DFECD7] rounded-2xl px-3.5 py-2.5 flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
            >
              <span className="text-[11.5px] font-semibold text-[#5E6E5A]">Секретный код:</span>
              <span className="font-mono-num text-[17px] font-extrabold text-[#1C261B]">
                {activeOrder.secretCode}
              </span>
              <span className="text-[10.5px] text-[#5E6E5A]">(если сканер затупит)</span>
              <Copy className="w-4 h-4 text-[#4D6A42] shrink-0" />
            </button>
          </div>
        </div>

        {/* Warm Showcase Countdown */}
        <div className="rounded-[20px] bg-[#FBF2DB] border border-[#F0D9A3] p-3.5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F7DFAA] text-[#9A5B13] flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-extrabold text-[#5D2E05]">
              Обед греется в теплой витрине ♨️
            </div>
            <p className="text-[12px] text-[#7A4412] leading-relaxed mt-0.5">
              Держим горячим{' '}
              <span className="font-mono-num font-extrabold text-[#8F4706] bg-white/70 px-1.5 py-0.5 rounded">
                {warmFormatted}
              </span>{' '}
              мин. Не задерживайся, а то остынет и придется отдать другим голодным!
            </p>
          </div>
        </div>

        {/* Canteen Chat */}
        <div
          ref={chatSectionRef}
          id="canteen-chat"
          className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={IMAGES.gulmiraAvatar}
                  alt="Гульмира эже"
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E9DF]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#3A8E3E] border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-extrabold text-[#1C261B] truncate">
                  Гульмира эже
                </div>
                <div className="text-[11px] text-[#5E6E5A]">Стойка выдачи №2 • В сети</div>
              </div>
            </div>

            <span className="bg-[#EAF3E5] text-[#2F4B26] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">
              Чат с раздачей 💬
            </span>
          </div>

          {/* Chat Bubbles */}
          <div className="space-y-2 max-h-[210px] overflow-y-auto no-scrollbar py-1">
            {chatMessages.map((msg) => {
              const isStudent = msg.sender === 'student';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                      isStudent
                        ? 'bg-[#4D6A42] text-white rounded-br-sm'
                        : 'bg-[#EAF3E5] text-[#1C261B] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#8E9B8A] mt-0.5 px-1 tabular-nums">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => sendChatMessage(chip.text)}
                className="bg-[#F4F6F0] hover:bg-[#EAF3E5] border border-[#E5E9DF] text-[#1C261B] text-[11.5px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2">
            <input
              ref={chatInputRef}
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Черкнуть Гульмире эже..."
              className="flex-1 bg-[#F7F8F4] border border-[#E5E9DF] focus:border-[#4D6A42] rounded-full px-4 py-2.5 text-[13px] text-[#1C261B] placeholder:text-[#8E9B8A] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Отправить сообщение"
              className="w-10 h-10 rounded-full bg-[#4D6A42] hover:bg-[#3B5332] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
