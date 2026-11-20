import React, { useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Check,
  Clock,
  Flame,
  Minus,
  Moon,
  Plus,
  Rocket,
  Sunrise,
  UserPlus,
  Users,
  Utensils,
  Vote,
  Zap,
} from 'lucide-react';
import { useCampusBite } from '../context/CampusBiteContext';
import { PaymentMethod } from '../types/campus';
import { DishImage } from '../components/DishImage';

export const PlannerScreen: React.FC = () => {
  const {
    profile,
    currentUniversity,
    currentBuilding,
    dishes,
    groupMembers,
    groupItems,
    groupPayment,
    poll,
    openDishDetail,
    toggleGroupMember,
    addGroupMember,
    updateGroupItemQty,
    setGroupPayment,
    placeGroupOrder,
    votePoll,
    navigate,
  } = useCampusBite();

  const [addingFriend, setAddingFriend] = useState(false);
  const [friendName, setFriendName] = useState('');

  const slots = currentUniversity.bellSchedule;

  const activeParticipants = useMemo(
    () => groupMembers.filter((m) => m.selected),
    [groupMembers]
  );

  const totalGroupItems = useMemo(
    () => groupItems.reduce((sum, item) => sum + item.qty, 0),
    [groupItems]
  );

  const totalGroupPrice = useMemo(
    () => groupItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [groupItems]
  );

  const perPersonPrice = useMemo(() => {
    if (activeParticipants.length === 0) return 0;
    return Math.round((totalGroupPrice / activeParticipants.length) * 10) / 10;
  }, [totalGroupPrice, activeParticipants.length]);

  const totalPollVotes = poll.mantiVotes + poll.lagmanVotes;
  const mantiPct = totalPollVotes ? Math.round((poll.mantiVotes / totalPollVotes) * 100) : 50;
  const lagmanPct = 100 - mantiPct;

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    addGroupMember(friendName.trim());
    setFriendName('');
    setAddingFriend(false);
  };

  const featuredLunchDish =
    dishes.find((d) => d.id === slots[1]?.featuredDishId) || dishes[0];

  return (
    <div className="flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B] pb-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-[18px] font-extrabold text-[#1C261B]">Предзаказ</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('tracker', { focusChat: true })}
            aria-label="Уведомления и чат"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E9DF] flex items-center justify-center text-[#1C261B]"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('profile')}
            aria-label="Открыть профиль"
            className="w-9 h-9 rounded-full bg-[#4D6A42] text-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
          >
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="px-4 space-y-4">
        {/* University + Live Kitchen Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#EBF3E6] text-[#2F4B26] text-[11px] font-extrabold px-3 py-1 rounded-full">
            🎓 {currentUniversity.fullName}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9A5B13]">
            <span className="w-2 h-2 rounded-full bg-[#E59838]" />
            Кухня принимает заказы 👨‍🍳
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-[23px] font-extrabold tracking-tight text-[#1C261B] leading-tight">
            Заряжаемся на перемене! ⚡
          </h1>
          <p className="text-[12.5px] text-[#5E6E5A] mt-0.5">
            Звонки: {currentBuilding.name} • Среда — маленькая пятница!
          </p>
        </div>

        {/* Dark Olive Promo Banner */}
        <div className="rounded-[22px] bg-[#3B5233] text-white p-4 flex items-start gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-[#F6C46D]" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 bg-[#E59838] text-[#2B1803] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              280 студентов уже в теме 🔥
            </span>
            <h2 className="text-[16px] font-extrabold leading-snug">
              Думаешь, один не успеваешь перекусить? 😏
            </h2>
            <p className="text-[12px] text-[#D8E5D3] leading-relaxed">
              78% второкурсников уже застолбили горячий обед! Не щелкай клювом — забирай порцию!
            </p>
          </div>
        </div>

        {/* Break Timeline Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-extrabold text-[#1C261B]">
              Выбирай свою перемену ⏱️
            </h2>
            <span className="text-[11px] font-semibold text-[#5E6E5A] truncate">
              {currentBuilding.name} • {currentBuilding.canteenName}
            </span>
          </div>

          {/* Slot 1: 10:05 - 10:20 */}
          <div className="bg-white rounded-[20px] border border-[#E5E9DF] p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Sunrise className="w-5 h-5 text-[#4D6A42] shrink-0" />
                <div>
                  <div className="text-[17px] font-extrabold text-[#1C261B] tabular-nums leading-none">
                    {slots[0].time}
                  </div>
                  <div className="text-[11.5px] text-[#5E6E5A] mt-1">{slots[0].label}</div>
                </div>
              </div>
              <span className="bg-[#EAF3E5] text-[#2F4B26] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">
                {slots[0].statusText}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div>
                <div className="text-[13.5px] font-bold text-[#1C261B]">
                  Кофе Американо + Круассан
                </div>
                <div className="text-[18px] font-extrabold text-[#3E5C34] tabular-nums">
                  85 сом
                </div>
              </div>
              <button
                type="button"
                onClick={() => openDishDetail('coffee-croissant', slots[0].shortLabel)}
                className="inline-flex items-center gap-1.5 bg-[#EBF3E6] hover:bg-[#DCEAD4] text-[#2F4B26] text-[12px] font-extrabold px-3.5 py-2.5 rounded-full transition-colors active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Перехватить на бегу 🥐</span>
              </button>
            </div>
          </div>

          {/* Slot 2: 11:55 - 12:25 (Big Break Featured Card) */}
          <div className="bg-white rounded-[22px] border border-[#E59838]/60 overflow-hidden shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#E59838] to-[#F4B95E]" />
            <div className="p-3.5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Flame className="w-5 h-5 text-[#E59838] fill-[#E59838] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[18px] font-extrabold text-[#1C261B] tabular-nums leading-tight">
                      {slots[1].time}
                    </div>
                    <div className="text-[11.5px] font-bold text-[#B25C08] mt-0.5">
                      ({slots[1].label}) 🎉
                    </div>
                  </div>
                </div>
                <span className="bg-[#FFE7C2] text-[#7D440A] text-[10.5px] font-extrabold px-2.5 py-1 rounded-xl text-right leading-tight max-w-[130px]">
                  {slots[1].statusText}
                </span>
              </div>

              <div className="bg-[#FFF8EE] rounded-2xl p-2.5 border border-[#F6DFBE] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1C261B] tabular-nums">
                    Загрузка выдачи: {slots[1].occupancyPercent}%
                  </span>
                  <span className="text-[#B25C08] tabular-nums">
                    Осталось всего {slots[1].spotsLeft} мест у стойки!
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F5E4C8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#A85B0D]"
                    style={{ width: `${slots[1].occupancyPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DishImage
                  src={featuredLunchDish.image}
                  alt={featuredLunchDish.name}
                  className="w-16 h-16 rounded-2xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-extrabold text-[#1C261B] leading-snug">
                    Обед №2: {featuredLunchDish.shortName} + Ачучук
                  </div>
                  <div className="text-[11.5px] text-[#5E6E5A]">Компот из сухофруктов в подарок</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[18px] font-extrabold text-[#1C261B] tabular-nums">
                      {featuredLunchDish.price} сом
                    </span>
                    <span className="text-[12px] text-[#8E9B8A] line-through tabular-nums">
                      {featuredLunchDish.originalPrice} сом
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openDishDetail(featuredLunchDish.id, slots[1].shortLabel)}
                className="w-full min-h-[46px] rounded-full bg-[#3B5233] hover:bg-[#2E4127] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Clock className="w-4 h-4" />
                <span>Занять местечко к 11:55</span>
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slot 3: 13:55 - 14:15 */}
          <div className="bg-white rounded-[20px] border border-[#E5E9DF] p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Moon className="w-5 h-5 text-[#5E6E5A] shrink-0" />
                <div>
                  <div className="text-[17px] font-extrabold text-[#1C261B] tabular-nums leading-none">
                    {slots[2].time}
                  </div>
                  <div className="text-[11.5px] text-[#5E6E5A] mt-1">{slots[2].label}</div>
                </div>
              </div>
              <span className="bg-[#EAF3E5] text-[#2F4B26] text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                {slots[2].discountBadge || 'Скидка -15%'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div>
                <div className="text-[13.5px] font-bold text-[#1C261B]">
                  Лагман тянутый / Манпар
                </div>
                <div className="text-[18px] font-extrabold text-[#1C261B] tabular-nums">
                  150 сом
                </div>
              </div>
              <button
                type="button"
                onClick={() => openDishDetail('lagman-combo', slots[2].shortLabel)}
                className="inline-flex items-center gap-1.5 bg-[#EBF3E6] hover:bg-[#DCEAD4] text-[#2F4B26] text-[12px] font-extrabold px-3.5 py-2.5 rounded-full transition-colors active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Взять со скидкой</span>
              </button>
            </div>
          </div>
        </div>

        {/* Group Lunch Split Widget */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4D6A42]" />
              <h2 className="text-[16px] font-extrabold text-[#1C261B] leading-tight">
                Скидываемся группой {profile.group}! 🎓
              </h2>
            </div>
            <span className="bg-[#EAF3E5] text-[#2F4B26] text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0 tabular-nums">
              {totalGroupItems} порции
            </span>
          </div>

          <p className="text-[12px] text-[#5E6E5A]">
            Отправляем одного гонца забрать поднос на всю банду 😎
          </p>

          {/* Classmate avatars row */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex -space-x-1.5">
              {groupMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleGroupMember(m.id)}
                  title={`${m.name} (${m.selected ? 'в доле' : 'не участвует'})`}
                  className={`w-9 h-9 rounded-full text-[11px] font-extrabold flex items-center justify-center border-2 transition-all ${
                    m.selected
                      ? 'border-[#4D6A42] text-[#1C261B] scale-100'
                      : 'border-white text-[#8E9B8A] opacity-45 scale-90'
                  }`}
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </button>
              ))}
            </div>

            {!addingFriend ? (
              <button
                type="button"
                onClick={() => setAddingFriend(true)}
                className="inline-flex items-center gap-1 bg-[#F7F8F4] hover:bg-[#EAF3E5] border border-[#E5E9DF] text-[#1C261B] text-[12px] font-bold px-3 py-1.5 rounded-full transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Добавить</span>
              </button>
            ) : (
              <form onSubmit={handleAddFriendSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="Имя (напр. Айбек)"
                  autoFocus
                  className="w-28 bg-[#F7F8F4] border border-[#4D6A42] rounded-full px-2.5 py-1 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#4D6A42] text-white text-xs font-bold px-2.5 py-1 rounded-full"
                >
                  ОК
                </button>
              </form>
            )}
          </div>

          {/* Group Items with Quantity Steppers */}
          <div className="grid grid-cols-2 gap-2">
            {groupItems.map((item) => (
              <div
                key={item.dishId}
                className="bg-[#F7F8F4] rounded-2xl border border-[#E5E9DF] p-2 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <DishImage
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-bold text-[#1C261B] truncate">
                      {item.name}
                    </div>
                    <div className="text-[12px] font-extrabold text-[#4D6A42] tabular-nums">
                      {item.unitPrice * item.qty} сом
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl border border-[#E5E9DF] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateGroupItemQty(item.dishId, -1)}
                    aria-label="Уменьшить количество"
                    className="w-6 h-6 rounded-lg hover:bg-[#EAF3E5] flex items-center justify-center text-[#1C261B]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[12px] font-extrabold tabular-nums">×{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateGroupItemQty(item.dishId, 1)}
                    aria-label="Увеличить количество"
                    className="w-6 h-6 rounded-lg hover:bg-[#EAF3E5] flex items-center justify-center text-[#1C261B]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Split Result */}
          <div className="rounded-2xl bg-[#EAF3E5] px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div className="text-[12px] font-bold text-[#1C261B] tabular-nums">
              Счет: {totalGroupPrice} с • С носа ({activeParticipants.length} чел.)
            </div>
            <div className="text-[14px] font-extrabold text-[#2F4B26] tabular-nums text-right">
              по {perPersonPrice} с!
            </div>
          </div>

          {/* One-Click Payment Chips */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11.5px] font-semibold text-[#5E6E5A]">Оплата в 1 клик:</span>
            <div className="flex items-center gap-1.5">
              {(['MBank', 'O!Деньги', 'Элкарт'] as PaymentMethod[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setGroupPayment(pm)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-colors ${
                    groupPayment === pm
                      ? 'bg-[#4D6A42] text-white border-[#4D6A42]'
                      : 'bg-[#F7F8F4] text-[#1C261B] border-[#E5E9DF]'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={placeGroupOrder}
            className="w-full min-h-[48px] rounded-full bg-[#9A5B0D] hover:bg-[#7D4808] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Собрать царский поднос на всех 🍽️</span>
          </button>
        </div>

        {/* Interactive Tomorrow's Menu Poll */}
        <div className="bg-white rounded-[22px] border border-[#E5E9DF] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#4D6A42]" />
              <h2 className="text-[16px] font-extrabold text-[#1C261B] leading-tight">
                Что шефу сварганить на завтра? 🗳️
              </h2>
            </div>
            <span className="bg-[#EAF3E5] text-[#2F4B26] text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0">
              до 18:00
            </span>
          </div>

          <p className="text-[12px] text-[#5E6E5A]">
            Какое блюдо победит — то шеф и замутит со скидкой 20%! ({totalPollVotes} голосов)
          </p>

          <div className="space-y-2">
            {/* Option 1: Manti */}
            <button
              type="button"
              onClick={() => votePoll('manti')}
              className={`w-full rounded-2xl border p-3 text-left transition-all ${
                poll.userChoice === 'manti'
                  ? 'bg-[#EAF3E5] border-[#4D6A42]'
                  : 'bg-[#F7F8F4] border-[#E5E9DF] hover:border-[#4D6A42]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                      poll.userChoice === 'manti'
                        ? 'bg-[#4D6A42] border-[#4D6A42] text-white'
                        : 'bg-white border-[#B9C5B2]'
                    }`}
                  >
                    {poll.userChoice === 'manti' && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-[13px] font-bold text-[#1C261B] truncate">
                    Манты с сочной тыквой и зеленью
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {mantiPct > lagmanPct && (
                    <span className="bg-[#4D6A42] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Лидер
                    </span>
                  )}
                  <span className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                    {mantiPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#DCE4D7] overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-[#4D6A42] transition-all duration-300"
                  style={{ width: `${mantiPct}%` }}
                />
              </div>
            </button>

            {/* Option 2: Bosso Lagman */}
            <button
              type="button"
              onClick={() => votePoll('lagman')}
              className={`w-full rounded-2xl border p-3 text-left transition-all ${
                poll.userChoice === 'lagman'
                  ? 'bg-[#EAF3E5] border-[#4D6A42]'
                  : 'bg-[#F7F8F4] border-[#E5E9DF] hover:border-[#4D6A42]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                      poll.userChoice === 'lagman'
                        ? 'bg-[#4D6A42] border-[#4D6A42] text-white'
                        : 'bg-white border-[#B9C5B2]'
                    }`}
                  >
                    {poll.userChoice === 'lagman' && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-[13px] font-bold text-[#1C261B] truncate">
                    Лагман жареный (Босо Лагман)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {lagmanPct >= mantiPct && (
                    <span className="bg-[#4D6A42] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Лидер
                    </span>
                  )}
                  <span className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
                    {lagmanPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#DCE4D7] overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-[#4D6A42] transition-all duration-300"
                  style={{ width: `${lagmanPct}%` }}
                />
              </div>
            </button>
          </div>

          <div className="text-[11.5px] text-[#5E6E5A] flex items-center gap-1.5 pt-0.5">
            <span>🍴 Шеф уже едет на базар с утра за лучшими продуктами 🥩</span>
          </div>
        </div>
      </div>
    </div>
  );
};
