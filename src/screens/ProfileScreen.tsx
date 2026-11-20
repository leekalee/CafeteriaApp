import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Gift,
  Heart,
  MessageCircleQuestion,
  Receipt,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  User,
  Utensils,
  Wallet,
  X,
} from 'lucide-react';
import { useCampusBite } from '../context/CampusBiteContext';
import { DishImage } from '../components/DishImage';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    currentUniversity,
    dishes,
    orderHistory,
    topUpBalance,
    toggleDietary,
    openDishDetail,
    navigate,
    showToast,
    resetDemo,
  } = useCampusBite();

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editDietary, setEditDietary] = useState(false);
  const [topUpSource, setTopUpSource] = useState<'MBank' | 'O!Деньги'>('MBank');

  const topDishes = dishes.filter((d) =>
    ['plov-tashkent', 'manti-juicy', 'lagman-combo'].includes(d.id)
  );

  const handleCopyPromo = async () => {
    const refLink = `https://campusbite.kg/ref/${profile.promoCode}`;
    try {
      await navigator.clipboard.writeText(refLink);
    } catch {
      // Clipboard fallback
    }
    showToast('Ссылка скопирована! Вам и другу по +50 сом 🎉');
  };

  return (
    <div className="relative flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B] pb-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[18px] font-extrabold text-[#1C261B]">Профиль</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('tracker', { focusChat: true })}
            aria-label="Уведомления"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E9DF] flex items-center justify-center text-[#1C261B]"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="w-9 h-9 rounded-full bg-[#4D6A42] text-white flex items-center justify-center">
            <User className="w-4 h-4" />
          </span>
        </div>
      </header>

      <div className="px-4 space-y-3.5">
        {/* Identity + Balance Card */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 shadow-xs space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-[3px] border-[#EBF3E6]"
              />
              {profile.isVerified && (
                <span
                  title="Верифицированный студент"
                  className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#4D6A42] text-white border-2 border-white flex items-center justify-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-[19px] font-extrabold text-[#1C261B] leading-tight">
                  {profile.name}
                </h1>
                <span className="bg-[#EAF3E5] text-[#2F4B26] font-mono-num text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
                  ID: {profile.studentId}
                </span>
              </div>
              <div className="text-[12.5px] font-extrabold text-[#4D6A42] mt-0.5">
                {currentUniversity.fullName}
              </div>
              <div className="text-[11.5px] text-[#5E6E5A]">
                {profile.faculty} • Группа {profile.group}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#9A5B13] mt-1">
                <Star className="w-3.5 h-3.5 fill-[#E59838] text-[#E59838]" />
                <span className="tabular-nums">
                  Рейтинг доверия: {profile.trustRating} • Пунктуальный студент
                </span>
              </div>
            </div>
          </div>

          {/* Savings Dashboard */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#F7F8F4] border border-[#E5E9DF] p-2.5">
              <div className="text-[10.5px] font-semibold text-[#5E6E5A]">Сэкономлено сомов</div>
              <div className="text-[18px] font-extrabold text-[#2F4B26] tabular-nums mt-0.5">
                {profile.savedSom.toLocaleString('ru-RU')} сом
              </div>
            </div>
            <div className="rounded-2xl bg-[#F7F8F4] border border-[#E5E9DF] p-2.5">
              <div className="text-[10.5px] font-semibold text-[#5E6E5A] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#4D6A42]" />
                <span>Время без очередей</span>
              </div>
              <div className="text-[18px] font-extrabold text-[#1C261B] tabular-nums mt-0.5">
                {profile.savedMinutes} мин
              </div>
            </div>
          </div>

          {/* Meal Balance Box */}
          <div className="rounded-[20px] bg-[#E8F2E4] p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11.5px] font-semibold text-[#4D6A42]">Баланс питания</div>
                <div className="text-[28px] font-extrabold text-[#1C261B] tabular-nums leading-none mt-1">
                  {profile.balance} <span className="text-[18px]">сом</span>
                </div>
              </div>

              <div className="bg-[#F4EAD2] text-[#7D4A0D] text-[11.5px] font-extrabold px-3 py-2 rounded-2xl max-w-[165px] leading-snug">
                % Кэшбэк {profile.cashbackPercent}% капает в карман 💰
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTopUpOpen(true)}
              className="w-full min-h-[46px] rounded-full bg-[#3D5734] hover:bg-[#304628] text-white font-extrabold text-[13px] px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Закинуть сомов через MBank / O!Деньги</span>
            </button>
          </div>
        </div>

        {/* Dietary Preferences Card */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#4D6A42]" />
              <h2 className="text-[15.5px] font-extrabold text-[#1C261B]">
                Твои пищевые заморочки 🥑
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditDietary((v) => !v)}
              className="text-[12px] font-bold text-[#4D6A42]"
            >
              {editDietary ? 'Готово' : 'Изменить'}
            </button>
          </div>

          <p className="text-[12px] text-[#5E6E5A]">
            Повара сразу видят эти значки, так что никакого майонеза, если не любишь!
          </p>

          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => toggleDietary('halal')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                profile.dietary.halal
                  ? 'bg-[#3D5734] text-white'
                  : 'bg-[#F4F6F0] text-[#5E6E5A] border border-[#E5E9DF]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Халяль</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary('noMayo')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                profile.dietary.noMayo
                  ? 'bg-[#3D5734] text-white'
                  : 'bg-[#F4F6F0] text-[#5E6E5A] border border-[#E5E9DF]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Без майонеза</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary('noLactose')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                profile.dietary.noLactose
                  ? 'bg-[#3D5734] text-white'
                  : 'bg-[#F4F6F0] text-[#5E6E5A] border border-[#E5E9DF]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Без лактозы</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary('nutAllergy')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                profile.dietary.nutAllergy
                  ? 'bg-[#FDE9E6] text-[#B42D1E] border border-[#F8C7C0]'
                  : 'bg-[#F4F6F0] text-[#5E6E5A] border border-[#E5E9DF]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Орехи — табу (аллергия)!</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary('samsaAlert')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                profile.dietary.samsaAlert
                  ? 'bg-[#FFE5BF] text-[#8F4A06] border border-[#F6CC90]'
                  : 'bg-[#F4F6F0] text-[#5E6E5A] border border-[#E5E9DF]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Зовите, когда самса горячая! 🥟</span>
            </button>
          </div>
        </div>

        {/* Referral Promo Card */}
        <div className="bg-[#E8F2E4] rounded-[22px] border border-[#D4E4CD] p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE3BB] text-[#A25B0C] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-[#1C261B] leading-snug">
                Накорми друга — получи полтинник! 🍕
              </h2>
              <p className="text-[12px] text-[#4C5E48] mt-0.5 leading-relaxed">
                Скинь свой код одногруппнику: вам обоим капнет по 50 сом на перекус!
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-2.5 pl-3.5 flex items-center justify-between gap-2 border border-[#DCE4D7]">
            <div>
              <div className="text-[10px] font-semibold text-[#5E6E5A]">Твой промокод</div>
              <div className="font-mono-num text-[15px] font-extrabold text-[#1C261B]">
                {profile.promoCode}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyPromo}
              className="inline-flex items-center gap-1.5 bg-[#3D5734] hover:bg-[#304628] text-white text-[12.5px] font-extrabold px-4 py-2.5 rounded-full transition-all active:scale-95 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Скопировать</span>
            </button>
          </div>
        </div>

        {/* Top Favorites List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-[#1C261B] inline-flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-[#9A5B13] text-[#9A5B13]" />
              <span>Твои топ-вкусняшки 🤤</span>
            </h2>
            <button
              type="button"
              onClick={() => navigate('menu')}
              className="text-[12px] font-bold text-[#4D6A42]"
            >
              Все меню
            </button>
          </div>

          <div className="space-y-2">
            {topDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => openDishDetail(dish.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openDishDetail(dish.id)}
                className="bg-white rounded-[18px] border border-[#E5E9DF] p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#4D6A42]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <DishImage
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 rounded-xl shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[14px] font-extrabold text-[#1C261B] truncate">
                      {dish.shortName}
                    </div>
                    <div className="text-[11px] text-[#5E6E5A] truncate">{dish.weight}</div>
                    <div className="text-[15px] font-extrabold text-[#3E5C34] tabular-nums mt-0.5">
                      {dish.price} сом
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDishDetail(dish.id);
                  }}
                  aria-label={`Заказать ${dish.shortName}`}
                  className="w-10 h-10 rounded-full bg-[#3D5734] hover:bg-[#304628] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Utility Links */}
        <div className="bg-white rounded-[20px] border border-[#E5E9DF] divide-y divide-[#F0F3EC]">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#F7F8F4]/70 rounded-t-[20px]"
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-4 h-4 text-[#4D6A42]" />
              <span className="text-[13.5px] font-bold text-[#1C261B]">
                История твоих пиров и чеки 🧾
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E9B8A]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('tracker', { focusChat: true })}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#F7F8F4]/70"
          >
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="w-4 h-4 text-[#4D6A42]" />
              <span className="text-[13.5px] font-bold text-[#1C261B]">
                Шепнуть словечко столовой {currentUniversity.shortName.split(' ')[0]} 💬
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E9B8A]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('onboarding')}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F7F8F4]/70 rounded-b-[20px]"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#5E6E5A]" />
              <span className="text-[12.5px] font-semibold text-[#5E6E5A]">
                Сменить вуз или перепройти верификацию
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E9B8A]" />
          </button>
        </div>

        <button
          type="button"
          onClick={resetDemo}
          className="w-full py-2 text-[11.5px] font-semibold text-[#5E6E5A] hover:text-[#1C261B] inline-flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить демо-данные</span>
        </button>
      </div>

      {/* Top-Up Modal */}
      {topUpOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px]">
          <div className="w-full bg-white rounded-t-[28px] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-extrabold text-[#1C261B]">
                Пополнить студенческий баланс
              </h3>
              <button
                type="button"
                onClick={() => setTopUpOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F8F4] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['MBank', 'O!Деньги'] as const).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setTopUpSource(src)}
                  className={`py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
                    topUpSource === src
                      ? 'bg-[#EAF3E5] border-[#4D6A42] text-[#2F4B26]'
                      : 'bg-[#F7F8F4] border-[#E5E9DF] text-[#5E6E5A]'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    topUpBalance(amt, topUpSource);
                    setTopUpOpen(false);
                  }}
                  className="py-3 rounded-2xl bg-[#3D5734] hover:bg-[#304628] text-white font-extrabold text-sm tabular-nums active:scale-95 transition-transform"
                >
                  +{amt} с
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {historyOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px]">
          <div className="w-full bg-[#F7F8F4] rounded-t-[28px] max-h-[75%] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E9DF]">
              <h3 className="text-[17px] font-extrabold text-[#1C261B]">
                История заказов и чеки 🧾
              </h3>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-2.5 no-scrollbar">
              {orderHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E5E9DF] p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-num font-bold text-[#4D6A42]">{item.id}</span>
                    <span className="text-[#5E6E5A]">{item.dateLabel}</span>
                  </div>
                  <div className="text-[13.5px] font-extrabold text-[#1C261B]">{item.title}</div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#5E6E5A]">
                      {item.canteen} · {item.paymentMethod}
                    </span>
                    <span className="font-extrabold text-[#1C261B] tabular-nums">
                      {item.totalPrice} сом
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
