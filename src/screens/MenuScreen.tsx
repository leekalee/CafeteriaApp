import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Flame,
  Heart,
  MapPin,
  Plus,
  SlidersHorizontal,
  Star,
  Store,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import { useCampusBite } from '../context/CampusBiteContext';
import { DishCategory, QueueStatus } from '../types/campus';
import { DishImage } from '../components/DishImage';
import { CampusPickerModal } from '../components/CampusPickerModal';

export const MenuScreen: React.FC = () => {
  const {
    profile,
    currentUniversity,
    currentBuilding,
    queueStatus,
    setQueueStatus,
    dishes,
    activeOrder,
    language,
    setLanguage,
    openDishDetail,
    toggleFavorite,
    navigate,
    showToast,
  } = useCampusBite();

  const [category, setCategory] = useState<DishCategory>('all');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [samsaSeconds, setSamsaSeconds] = useState(3 * 60 + 47);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSamsaSeconds((s) => (s > 0 ? s - 1 : 5 * 60));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const samsaClock = `${String(Math.floor(samsaSeconds / 60)).padStart(2, '0')}:${String(
    samsaSeconds % 60
  ).padStart(2, '0')}`;

  const queueMeta: Record<
    QueueStatus,
    { label: string; wait: string; percent: number; barColor: string; pillBg: string; pillText: string }
  > = {
    free: {
      label:
        language === 'KG'
          ? 'Кезек: Бош! Кирип кел'
          : 'Очередь на раздаче: Пустота! Залетай',
      wait: '~3 мин',
      percent: 25,
      barColor: '#2B4C25',
      pillBg: '#DCEAD4',
      pillText: '#2F4D27',
    },
    medium: {
      label:
        language === 'KG'
          ? 'Кезек: Орточо (~10 мүн)'
          : 'Очередь: Средняя, движется бодро',
      wait: '~10 мин',
      percent: 58,
      barColor: '#E59838',
      pillBg: '#FFF1DB',
      pillText: '#9A5B13',
    },
    rush: {
      label:
        language === 'KG'
          ? 'Кезек: Толук! Алдын ала буйрутма кыл'
          : 'Аншлаг у стойки! Лучше предзаказ',
      wait: '~18 мин',
      percent: 90,
      barColor: '#C94A38',
      pillBg: '#FDE8E5',
      pillText: '#A83222',
    },
  };

  const currentQueue = queueMeta[queueStatus];

  const categories: { id: DishCategory; label: string }[] = [
    { id: 'all', label: language === 'KG' ? 'Баары' : 'Всё подряд' },
    { id: 'combo160', label: 'Комбо до 160 с 🔥' },
    { id: 'soup', label: language === 'KG' ? 'Шорполор' : 'Супы' },
    { id: 'main', label: language === 'KG' ? 'Экинчи тамак' : 'Второе' },
    { id: 'bakery', label: language === 'KG' ? 'Тандыр нан' : 'Выпечка из печи' },
  ];

  const filteredDishes = useMemo(() => {
    const list = dishes.filter((d) => {
      if (category === 'all') return true;
      if (category === 'combo160') return d.price <= 160;
      return d.category === category;
    });
    if (sortByPrice) {
      return [...list].sort((a, b) => a.price - b.price);
    }
    return list;
  }, [dishes, category, sortByPrice]);

  const featuredDish = filteredDishes[0];
  const restDishes = filteredDishes.slice(1);

  return (
    <div className="relative flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B] pb-4">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#F7F8F4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#4D6A42] text-white flex items-center justify-center shadow-sm">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[19px] font-extrabold tracking-tight text-[#2B3E26]">
            CampusBite
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === 'RU' ? 'KG' : 'RU')}
            className="inline-flex items-center gap-1 bg-white border border-[#E5E9DF] rounded-full px-2.5 py-1.5 text-[12px] font-bold text-[#1C261B] shadow-xs active:scale-95 transition-transform"
          >
            <span>{language}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E6E5A]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('profile')}
            aria-label="Открыть профиль"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      <div className="px-4 space-y-3">
        {/* Campus Selector Card */}
        <div className="bg-white rounded-[20px] border border-[#E5E9DF] px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-[0_2px_8px_rgba(28,38,27,0.03)]">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-2.5 text-left min-w-0 flex-1"
          >
            <div className="w-9 h-9 rounded-full bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#1C261B] truncate">
                <span className="truncate">
                  {currentUniversity.shortName}, {currentBuilding.name.split(' ')[0]}
                </span>
                <span className="text-[#4D6A42] font-bold shrink-0">
                  • {currentBuilding.canteenName}
                </span>
              </div>
              <div className="text-[11px] text-[#5E6E5A] truncate">
                {currentBuilding.hours} • {currentBuilding.breakNotice}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAlertsOpen((v) => !v)}
            aria-label="Уведомления столовой"
            className="relative w-9 h-9 rounded-full bg-[#F7F8F4] border border-[#E5E9DF] flex items-center justify-center text-[#1C261B] shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#E04F3E] border border-white" />
          </button>
        </div>

        {/* Optional Notification Drawer */}
        {alertsOpen && (
          <div className="bg-white rounded-2xl border border-[#4D6A42]/30 p-3 text-xs space-y-1.5 shadow-sm">
            <div className="font-bold text-[#1C261B] flex items-center justify-between">
              <span>Сводка из {currentBuilding.canteenName}</span>
              <button
                type="button"
                onClick={() => setAlertsOpen(false)}
                className="text-[#4D6A42] font-semibold"
              >
                Скрыть
              </button>
            </div>
            <p className="text-[#5E6E5A]">
              • Скидка 20% активна по верификации ({currentUniversity.shortName})
            </p>
            <p className="text-[#5E6E5A]">
              • Свежая партия самсы из тандыра выходит через {samsaClock}
            </p>
          </div>
        )}

        {/* Interactive Queue Monitor Card */}
        <div className="bg-white rounded-[20px] border border-[#E5E9DF] p-3.5 shadow-[0_2px_10px_rgba(28,38,27,0.03)] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: currentQueue.barColor }}
              />
              <span className="text-[13px] font-extrabold text-[#1C261B] leading-tight truncate">
                {currentQueue.label}
              </span>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 tabular-nums"
              style={{
                backgroundColor: currentQueue.pillBg,
                color: currentQueue.pillText,
              }}
            >
              {currentQueue.wait}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#E9EFE5] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${currentQueue.percent}%`,
                backgroundColor: currentQueue.barColor,
              }}
            />
          </div>

          {/* Interactive Traffic State Switcher */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#F4F6F0] p-1 rounded-xl">
            {(
              [
                { id: 'free', label: 'Свободно ~3м' },
                { id: 'medium', label: 'Средняя ~10м' },
                { id: 'rush', label: 'Аншлаг' },
              ] as { id: QueueStatus; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setQueueStatus(opt.id);
                  showToast(`Монитор очереди: ${opt.label}`, 'info');
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  queueStatus === opt.id
                    ? 'bg-white text-[#1C261B] shadow-xs'
                    : 'text-[#5E6E5A] hover:text-[#1C261B]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#4C5C49] pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#4D6A42]" />
              Быстрая выдача по QR
            </span>
            <span className="tabular-nums text-[#5E6E5A]">Пик нагрузки: 13:10</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                  active
                    ? 'bg-[#2F4B26] text-white shadow-sm'
                    : cat.id === 'combo160'
                    ? 'bg-[#FFE4BD] text-[#7D440A] border border-[#F6CF97]'
                    : 'bg-white text-[#1C261B] border border-[#E5E9DF] hover:border-[#4D6A42]/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Urgent Hot Samsa Banner */}
        <div className="rounded-[20px] bg-gradient-to-r from-[#F9DFB5] via-[#FCE6C2] to-[#FFEBD0] border border-[#F3CFA0] p-3 flex items-center justify-between gap-2.5 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#B25C08] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold text-[#5D2E05] leading-snug">
                Самса из тандыра прямо сейчас дымится! 🥟
              </div>
              <div className="text-[11px] text-[#7A4412] mt-0.5 truncate">
                Шеф достает партию! Успей урвать
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-white/90 text-[#8F4706] font-mono-num text-[12px] font-bold px-2 py-1 rounded-lg border border-[#EFC68C]">
              {samsaClock}
            </span>
            <button
              type="button"
              onClick={() => openDishDetail('samsa-meat')}
              className="bg-[#964B00] hover:bg-[#7A3C00] text-white text-[12px] font-extrabold px-3 py-2 rounded-full transition-transform active:scale-95"
            >
              Урвать!
            </button>
          </div>
        </div>

        {/* Menu Header */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-[19px] font-extrabold text-[#1C261B] tracking-tight">
            {language === 'KG' ? 'Бүгүн эмне беребиз? 😋' : 'Чем сегодня кормим? 😋'}
          </h2>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#5E6E5A] font-medium">Свежее к 13:00</span>
            <button
              type="button"
              onClick={() => setSortByPrice((s) => !s)}
              className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                sortByPrice
                  ? 'bg-[#4D6A42] text-white border-[#4D6A42]'
                  : 'bg-white text-[#1C261B] border-[#E5E9DF]'
              }`}
            >
              <span>{sortByPrice ? 'Дешевле' : 'Фильтр'}</span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Dish Card */}
        {featuredDish && (
          <div
            onClick={() => openDishDetail(featuredDish.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openDishDetail(featuredDish.id)}
            className="bg-white rounded-[22px] border border-[#E5E9DF] overflow-hidden shadow-[0_4px_14px_rgba(28,38,27,0.05)] cursor-pointer transition-transform active:scale-[0.99]"
          >
            <div className="relative h-[182px] w-full overflow-hidden">
              <DishImage
                src={featuredDish.image}
                alt={featuredDish.name}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="bg-[#E59838] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {featuredDish.badgeTop || 'Хит столовки 🔥'}
                </span>
                <span className="bg-white/95 text-[#1C261B] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm tabular-nums">
                  Осталось {featuredDish.stock} порций
                </span>
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="bg-[#232F21]/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {featuredDish.badgeBottom || 'С любовью от шефа Эркина ❤️'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(featuredDish.id);
                  }}
                  aria-label="Добавить в избранное"
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#1C261B] shadow-xs"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      profile.favorites.includes(featuredDish.id)
                        ? 'fill-[#E04F3E] text-[#E04F3E]'
                        : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[17px] font-extrabold text-[#1C261B] leading-snug">
                  {featuredDish.name}
                </h3>
                <span className="text-[12px] font-semibold text-[#5E6E5A] shrink-0 pt-0.5">
                  {featuredDish.weight}
                </span>
              </div>

              <p className="text-[12.5px] text-[#5E6E5A] line-clamp-2 leading-relaxed">
                {featuredDish.description}
              </p>

              <div className="rounded-xl bg-[#EAF3E5] px-3 py-1.5 flex items-center gap-1.5 text-[11.5px] font-bold text-[#2F4B26]">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {featuredDish.orderedToday} студента уже умяли сегодня! Рекомендуем 👍
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold text-[#2B4622] tabular-nums">
                    {featuredDish.price} с
                  </span>
                  <span className="text-[13px] text-[#8E9B8A] line-through tabular-nums">
                    {featuredDish.originalPrice} с
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDishDetail(featuredDish.id);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#4D6A42] hover:bg-[#3B5332] text-white text-[13px] font-extrabold px-4 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  <span>В заказ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Dish Cards */}
        <div className="space-y-2.5">
          {restDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => openDishDetail(dish.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openDishDetail(dish.id)}
              className="bg-white rounded-[20px] border border-[#E5E9DF] p-2.5 flex items-center gap-3 shadow-[0_2px_8px_rgba(28,38,27,0.03)] cursor-pointer hover:border-[#4D6A42]/50 transition-all active:scale-[0.99]"
            >
              <div className="relative w-[92px] h-[92px] rounded-2xl overflow-hidden shrink-0">
                <DishImage src={dish.image} alt={dish.name} className="w-full h-full" />
                {dish.isHotNow ? (
                  <span className="absolute bottom-1.5 left-1.5 bg-[#E59838] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                    Горячее
                  </span>
                ) : (
                  <span className="absolute top-1.5 left-1.5 bg-white/95 text-[#2F4B26] text-[10px] font-extrabold px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 shadow-xs">
                    {dish.rating} <Star className="w-2.5 h-2.5 fill-[#4D6A42] text-[#4D6A42]" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-[14.5px] font-extrabold text-[#1C261B] leading-tight truncate">
                  {dish.name}
                </h3>
                <p className="text-[11.5px] text-[#5E6E5A] line-clamp-2 mt-0.5 leading-snug">
                  {dish.description}
                </p>
                <div className="text-[11px] text-[#5E6E5A] font-medium mt-1 tabular-nums">
                  {dish.weight} •{' '}
                  <span className={dish.stock <= 5 ? 'text-[#B25C08] font-bold' : ''}>
                    Осталось {dish.stock} порций
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[17px] font-extrabold text-[#1C261B] tabular-nums">
                      {dish.price} с
                    </span>
                    <span className="text-[11px] text-[#8E9B8A] line-through tabular-nums">
                      {dish.originalPrice} с
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDishDetail(dish.id);
                    }}
                    aria-label={`Выбрать ${dish.name}`}
                    className="w-9 h-9 rounded-full bg-[#EAF3E5] hover:bg-[#4D6A42] text-[#2F4B26] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Active Order Pill (matches Screenshot 6 bottom banner) */}
        {activeOrder && (
          <button
            type="button"
            onClick={() => navigate('tracker')}
            className="w-full rounded-[20px] bg-[#2D3D2A] text-white p-3 flex items-center justify-between gap-2.5 shadow-lg shadow-[#1C261B]/20 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#4D6A42] text-white text-[13px] font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                1
              </span>
              <div className="text-left min-w-0">
                <div className="text-[13px] font-extrabold truncate">{activeOrder.title}</div>
                <div className="text-[11px] text-[#CDE0C6] truncate">
                  {activeOrder.stage === 3
                    ? 'Ждет на Стойке №2 прямо сейчас! 🚀'
                    : `Готовится к Стойке №2 • ${activeOrder.id}`}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#F5C05A] text-[#231907] font-extrabold text-[12px] px-3 py-1.5 rounded-full shrink-0 tabular-nums">
              {activeOrder.totalPrice} сом
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        )}
      </div>

      <CampusPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
};
