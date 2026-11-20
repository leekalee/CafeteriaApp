import React from 'react';
import { CalendarClock, MessageSquare, QrCode, User, UtensilsCrossed } from 'lucide-react';
import { useCampusBite } from '../context/CampusBiteContext';
import { ScreenId } from '../types/campus';

export const BottomNav: React.FC = () => {
  const { screen, focusChatOnTracker, activeOrder, unreadChatCount, language, navigate } =
    useCampusBite();

  const items: {
    id: string;
    label: string;
    targetScreen: ScreenId;
    focusChat?: boolean;
    icon: React.ReactNode;
    isCenter?: boolean;
    badge?: number | string;
  }[] = [
    {
      id: 'menu',
      label: language === 'KG' ? 'Меню' : 'Меню',
      targetScreen: 'menu',
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      id: 'planner',
      label: language === 'KG' ? 'Алдын ала' : 'Предзаказ',
      targetScreen: 'planner',
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      id: 'qr',
      label: language === 'KG' ? 'Менин QR' : 'Мой QR',
      targetScreen: 'tracker',
      focusChat: false,
      isCenter: true,
      badge: activeOrder ? (activeOrder.stage === 3 ? '!' : 1) : undefined,
      icon: <QrCode className="w-5 h-5" />,
    },
    {
      id: 'chat',
      label: language === 'KG' ? 'Чат' : 'Чат',
      targetScreen: 'tracker',
      focusChat: true,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: language === 'KG' ? 'Профиль' : 'Профиль',
      targetScreen: 'profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const isTabActive = (itemId: string) => {
    if (itemId === 'menu') return screen === 'menu';
    if (itemId === 'planner') return screen === 'planner';
    if (itemId === 'profile') return screen === 'profile';
    if (itemId === 'qr') return screen === 'tracker' && !focusChatOnTracker;
    if (itemId === 'chat') return screen === 'tracker' && focusChatOnTracker;
    return false;
  };

  return (
    <nav
      aria-label="Основная навигация"
      className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E9DF] px-2 pt-1.5 pb-2.5"
    >
      <div className="grid grid-cols-5 items-end">
        {items.map((item) => {
          const active = isTabActive(item.id);
          if (item.isCenter && screen === 'menu') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.targetScreen, { focusChat: item.focusChat })}
                className="relative flex flex-col items-center justify-center min-h-[44px] -mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D6A42] rounded-xl"
              >
                <span className="relative w-11 h-11 rounded-full bg-[#4D6A42] text-white flex items-center justify-center shadow-md shadow-[#4D6A42]/25 border-4 border-[#F7F8F4] transition-transform active:scale-95">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E59838] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#4D6A42] mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.targetScreen, { focusChat: item.focusChat })}
              className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D6A42] ${
                active ? 'text-[#4D6A42]' : 'text-[#5E6E5A] hover:text-[#1C261B]'
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E59838] text-white text-[10px] font-bold flex items-center justify-center border border-white tabular-nums">
                    {item.badge}
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] mt-1 whitespace-nowrap ${
                  active ? 'font-bold text-[#4D6A42]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
