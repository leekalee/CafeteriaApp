import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Clock,
  Flame,
  Heart,
  Share2,
  ShieldCheck,
  Utensils,
  Zap,
} from 'lucide-react';
import { DISH_ADDONS } from '../data/mockData';
import { useCampusBite } from '../context/CampusBiteContext';
import { PaymentMethod } from '../types/campus';
import { DishImage } from '../components/DishImage';

export const DishDetailScreen: React.FC = () => {
  const {
    dishes,
    selectedDishId,
    selectedSlotLabel,
    currentUniversity,
    currentBuilding,
    profile,
    navigate,
    toggleFavorite,
    placeOrder,
    showToast,
  } = useCampusBite();

  const dish = useMemo(
    () => dishes.find((d) => d.id === selectedDishId) || dishes[0],
    [dishes, selectedDishId]
  );

  const slots = useMemo(
    () => [
      { id: 'slot-1', label: '10:05 - 10:20', display: '10:05 - 10:20' },
      {
        id: 'slot-2',
        label: '11:55 - 12:25 (Большая перемена)',
        display: 'Звонок 11:55 (Большая перемена) 🔔',
      },
      { id: 'slot-3', label: '13:55 - 14:15', display: '13:55 - 14:15 (Скидка)' },
    ],
    []
  );

  const [chosenSlot, setChosenSlot] = useState(
    slots.some((s) => s.label === selectedSlotLabel) ? selectedSlotLabel : slots[1].label
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['no-cilantro']);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MBank');

  const isFav = profile.favorites.includes(dish.id);

  const selectedAddons = useMemo(
    () => DISH_ADDONS.filter((a) => selectedAddonIds.includes(a.id)),
    [selectedAddonIds]
  );

  const totalPrice = useMemo(
    () => dish.price + selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [dish.price, selectedAddons]
  );

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = async () => {
    const shareText = `${dish.name} за ${dish.price} сом в ${currentUniversity.shortName} (${currentBuilding.canteenName})!`;
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Clipboard fallback
    }
    showToast('Ссылка на блюдо скопирована! Отправь одногруппнику');
  };

  const handleReserve = () => {
    placeOrder({
      dishId: dish.id,
      slotTime: chosenSlot,
      addons: selectedAddons,
      paymentMethod,
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B]">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-[#F7F8F4]/95 backdrop-blur-md flex items-center justify-between px-4 py-3 border-b border-[#E5E9DF]/60">
        <button
          type="button"
          onClick={() => navigate('menu')}
          aria-label="Назад к меню"
          className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-[#1C261B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[16px] font-extrabold text-[#1C261B]">Детали блюда</h1>
        <button
          type="button"
          onClick={() => navigate('profile')}
          aria-label="Профиль студента"
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm"
        >
          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
        </button>
      </header>

      <div className="px-4 pt-2 pb-28 space-y-4">
        {/* Hero Food Card */}
        <div className="relative h-[225px] rounded-[24px] overflow-hidden shadow-sm border border-[#E5E9DF]">
          <DishImage src={dish.image} alt={dish.name} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

          {/* Top right action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                toggleFavorite(dish.id);
                showToast(isFav ? 'Убрано из любимых' : 'Добавлено в любимые блюда ❤️', 'info');
              }}
              aria-label="Избранное"
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C261B] shadow-md active:scale-95 transition-transform"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#E04F3E] text-[#E04F3E]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Поделиться блюдом"
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C261B] shadow-md active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom left badges matching Stitch */}
          <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1.5">
            <span className="inline-flex items-center gap-1 bg-[#F9AA3C] text-[#2B1803] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
              <Flame className="w-3 h-3" />
              {dish.badgeTop || 'Пушка-набор 🔥'}
            </span>
            <span className="bg-white/95 text-[#1C261B] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
              {currentUniversity.shortName} • {currentBuilding.canteenName}
            </span>
          </div>
        </div>

        {/* Dish Title & Nutrition */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[12px] font-bold text-[#4D6A42]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              {currentUniversity.shortName} • {currentBuilding.canteenName}
            </span>
            <span className="text-[#5E6E5A] font-semibold tabular-nums">
              Осталось {dish.stock} порций
            </span>
          </div>

          <h2 className="text-[24px] font-extrabold leading-[1.15] text-[#1C261B] text-balance">
            {dish.name}
          </h2>

          <p className="text-[13px] text-[#5E6E5A] leading-relaxed">{dish.description}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[30px] font-extrabold text-[#3E5C34] tabular-nums leading-none">
                {dish.price} <span className="text-[17px]">сом</span>
              </span>
              <span className="text-[15px] text-[#8E9B8A] line-through tabular-nums">
                {dish.originalPrice} сом
              </span>
            </div>

            <span className="bg-[#EAF2E5] text-[#2F4B26] text-[12px] font-extrabold px-3 py-1.5 rounded-full tabular-nums">
              {dish.calories} ккал
            </span>
          </div>

          {/* KБЖУ, Состав & Аллергены */}
          <div className="bg-white rounded-[18px] border border-[#E5E9DF] p-3 space-y-2">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#F7F8F4] rounded-xl py-1.5">
                <div className="text-[10px] font-semibold text-[#5E6E5A]">Вес</div>
                <div className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                  {dish.weight.split(' ')[0]} г
                </div>
              </div>
              <div className="bg-[#F7F8F4] rounded-xl py-1.5">
                <div className="text-[10px] font-semibold text-[#5E6E5A]">Белки</div>
                <div className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                  {dish.protein} г
                </div>
              </div>
              <div className="bg-[#F7F8F4] rounded-xl py-1.5">
                <div className="text-[10px] font-semibold text-[#5E6E5A]">Жиры</div>
                <div className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                  {dish.fat} г
                </div>
              </div>
              <div className="bg-[#F7F8F4] rounded-xl py-1.5">
                <div className="text-[10px] font-semibold text-[#5E6E5A]">Углеводы</div>
                <div className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                  {dish.carbs} г
                </div>
              </div>
            </div>

            <div className="text-[11.5px] text-[#5E6E5A] leading-snug">
              <span className="font-bold text-[#1C261B]">Состав: </span>
              {dish.ingredients.join(', ')}.
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8F4706] bg-[#FFF5E6] rounded-xl px-2.5 py-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E59838] shrink-0" />
              <span>Аллергены: {dish.allergens.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Break Slot Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-extrabold text-[#1C261B] inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E59838]" />
              <span>Когда подать к твоему звонку?</span>
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4D6A42] shrink-0">
              Без толкучки <Zap className="w-3 h-3 fill-[#E59838] text-[#E59838]" />
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {slots.map((slot) => {
              const active = chosenSlot === slot.label;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setChosenSlot(slot.label)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                    active
                      ? 'bg-[#4D6A42] text-white shadow-sm'
                      : 'bg-white text-[#1C261B] border border-[#E5E9DF] hover:border-[#4D6A42]'
                  }`}
                >
                  {active && <Bell className="w-3.5 h-3.5" />}
                  <span>{slot.display}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Addons Checkboxes */}
        <div className="space-y-2">
          <h3 className="text-[15px] font-extrabold text-[#1C261B]">
            Как приготовить именно тебе? 🧂
          </h3>

          <div className="bg-white rounded-[20px] border border-[#E5E9DF] divide-y divide-[#F0F3EC]">
            {DISH_ADDONS.map((addon) => {
              const checked = selectedAddonIds.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F7F8F4]/70 first:rounded-t-[20px] last:rounded-b-[20px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        checked
                          ? 'bg-[#4D6A42] border-[#4D6A42] text-white'
                          : 'bg-white border-[#C5D0BE]'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-[13.5px] font-semibold text-[#1C261B] truncate">
                      {addon.label}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] font-bold shrink-0 tabular-nums ${
                      addon.price > 0 ? 'text-[#2F4B26]' : 'text-[#5E6E5A]'
                    }`}
                  >
                    {addon.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="bg-[#EAF3E5] rounded-[20px] border border-[#D8E7D0] p-3.5 space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FCE9C8] text-[#A25B0C] flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </span>
            <span className="text-[12.5px] font-bold text-[#1C261B]">
              Еда будет обжигающе горячей из термобокса ♨️
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#DCE9D4] text-[#3E5834] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-[12.5px] font-bold text-[#1C261B]">
              Подождем 25 минут, если препод затянул пару ⏳
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#DCE9D4] text-[#3E5834] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[12.5px] font-bold text-[#1C261B]">
              Пару отменили? Вернем денежки до тыйына без вопросов! 🤝
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <div className="text-[13px] font-bold text-[#5E6E5A]">Быстрая оплата:</div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'MBank', title: 'MBank', sub: '0% комиссия', accent: 'text-[#1C261B]' },
                { id: 'O!Деньги', title: 'O!Деньги', sub: 'Кошелек', accent: 'text-[#D6324B]' },
                {
                  id: 'Студенческий баланс',
                  title: 'Баланс',
                  sub: `${profile.balance} сом`,
                  accent: 'text-[#4D6A42]',
                },
              ] as { id: PaymentMethod; title: string; sub: string; accent: string }[]
            ).map((pm) => {
              const active = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`rounded-2xl p-2.5 text-center border transition-all active:scale-95 ${
                    active
                      ? 'bg-white border-2 border-[#4D6A42] shadow-xs'
                      : 'bg-white border-[#E5E9DF] hover:border-[#4D6A42]/50'
                  }`}
                >
                  <div className={`text-[13px] font-extrabold ${pm.accent}`}>{pm.title}</div>
                  <div className="text-[10.5px] font-medium text-[#5E6E5A] mt-0.5 tabular-nums">
                    {pm.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout CTA */}
      <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5E9DF] px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-[#5E6E5A]">Итого к оплате:</div>
          <div className="text-[20px] font-extrabold text-[#1C261B] tabular-nums leading-tight">
            {totalPrice} сом
          </div>
        </div>

        <button
          type="button"
          onClick={handleReserve}
          disabled={dish.stock <= 0}
          className="flex-1 min-h-[48px] rounded-full bg-[#4D6A42] hover:bg-[#3B5332] disabled:bg-[#9BA896] text-white font-extrabold text-[14.5px] px-5 flex items-center justify-center gap-2 shadow-md shadow-[#4D6A42]/20 transition-all active:scale-[0.98]"
        >
          <span>{dish.stock > 0 ? 'Застолбить порцию! 😋' : 'Порции закончились'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
