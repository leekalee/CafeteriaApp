import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Info, AlertTriangle, Wifi, BatteryFull, Signal } from 'lucide-react';
import { CampusBiteProvider, useCampusBite } from './context/CampusBiteContext';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MenuScreen } from './screens/MenuScreen';
import { DishDetailScreen } from './screens/DishDetailScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { TrackerScreen } from './screens/TrackerScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ScreenId } from './types/campus';

const DESKTOP_SCREEN_LABELS: { id: ScreenId; title: string; focusChat?: boolean }[] = [
  { id: 'onboarding', title: '1. Верификация' },
  { id: 'menu', title: '2. Меню и Очередь' },
  { id: 'dish-detail', title: '3. Карточка блюда' },
  { id: 'planner', title: '4. Перемена и Группа' },
  { id: 'tracker', title: '5. Трекер и QR' },
  { id: 'profile', title: '6. Профиль' },
];

const PhoneShell: React.FC = () => {
  const { screen, focusChatOnTracker, toast, navigate } = useCampusBite();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!focusChatOnTracker && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [screen, focusChatOnTracker]);

  const showBottomNav =
    screen === 'menu' ||
    screen === 'planner' ||
    screen === 'tracker' ||
    screen === 'profile';

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'dish-detail':
        return <DishDetailScreen />;
      case 'planner':
        return <PlannerScreen />;
      case 'tracker':
        return <TrackerScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MenuScreen />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#EAF1E5] via-[#E1EBDB] to-[#D9E5D2] flex flex-col items-center justify-center sm:py-5 sm:px-4">
      {/* Discreet Desktop Screen Switcher for instant inspection of all 6 screens */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-1.5 mb-3.5 max-w-[780px]">
        {DESKTOP_SCREEN_LABELS.map((item) => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id, { focusChat: item.focusChat })}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-[#4D6A42] text-white shadow-sm'
                  : 'bg-white/85 text-[#1C261B] border border-[#D4DFCE] hover:bg-white'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* 390px Smartphone Frame */}
      <div className="relative w-full sm:w-[390px] min-h-screen sm:min-h-0 sm:h-[820px] bg-[#F7F8F4] sm:rounded-[44px] sm:border-[8px] sm:border-[#1F291E] sm:shadow-[0_24px_60px_rgba(28,38,27,0.22)] flex flex-col overflow-hidden">
        {/* Subtle Phone Status Bar on Desktop Frame */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-2.5 pb-1 bg-[#F7F8F4] text-[#1C261B] text-[11px] font-bold shrink-0 select-none">
          <span className="tabular-nums">11:45</span>
          <div className="w-20 h-4 rounded-full bg-[#1F291E]" aria-hidden="true" />
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryFull className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Screen Viewport */}
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col"
        >
          <div className="flex-1">{renderScreen()}</div>
          {showBottomNav && <BottomNav />}
        </div>

        {/* Toast Notification inside Phone Viewport */}
        {toast && (
          <div className="pointer-events-none absolute top-14 left-3.5 right-3.5 z-50 flex justify-center">
            <div
              role="status"
              className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-lg border text-[12px] font-bold max-w-full ${
                toast.type === 'warning'
                  ? 'bg-[#FFF3DE] border-[#E59838] text-[#7A3F06]'
                  : toast.type === 'info'
                  ? 'bg-[#2D3D2A] border-[#4D6A42] text-white'
                  : 'bg-[#3B5233] border-[#4D6A42] text-white'
              }`}
            >
              {toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-[#E59838] shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-[#A7D397] shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#A7D397] shrink-0" />
              )}
              <span className="leading-snug">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CampusBiteProvider>
      <PhoneShell />
    </CampusBiteProvider>
  );
}
