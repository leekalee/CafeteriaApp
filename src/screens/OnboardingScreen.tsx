import React, { useState } from 'react';
import {
  ArrowRight,
  AtSign,
  Camera,
  Check,
  CheckCircle2,
  Flame,
  GraduationCap,
  Landmark,
  Lock,
  RefreshCw,
  ShieldCheck,
  Store,
  Utensils,
} from 'lucide-react';
import { useCampusBite } from '../context/CampusBiteContext';
import { CampusPickerModal } from '../components/CampusPickerModal';

export const OnboardingScreen: React.FC = () => {
  const { profile, currentUniversity, currentBuilding, verifyStudent, showToast } = useCampusBite();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [email, setEmail] = useState(profile.email);
  const [isScanning, setIsScanning] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu\.kg|kg)$/.test(email.trim());

  const handlePhotoScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    window.setTimeout(() => {
      setIsScanning(false);
      setPhotoVerified(true);
      showToast('Студбилет распознан! Скидка 20% активирована 📸');
    }, 900);
  };

  const handleConfirm = () => {
    if (!isEmailValid && !photoVerified) {
      showToast('Введите почту @edu.kg или отсканируйте студбилет', 'warning');
      return;
    }
    verifyStudent(photoVerified ? 'photo' : 'email', email.trim());
  };

  return (
    <div className="relative flex flex-col min-h-full bg-[#F7F8F4] text-[#1C261B] pb-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#4D6A42] text-white flex items-center justify-center shadow-sm">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-extrabold tracking-tight text-[#3E5834] leading-none">
              CAMPUSBITE
            </div>
            <div className="text-[11px] font-medium text-[#5E6E5A] mt-0.5">
              Верификация кампуса
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-semibold text-[#5E6E5A] tabular-nums">Шаг 2 из 3</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-1.5 rounded-full bg-[#4D6A42]" />
            <span className="w-6 h-1.5 rounded-full bg-[#4D6A42]" />
            <span className="w-4 h-1.5 rounded-full bg-[#DCE4D7]" />
          </div>
        </div>
      </header>

      <div className="px-4 space-y-3.5 flex-1">
        {/* Hero Headline */}
        <div className="pt-1">
          <h1 className="text-[24px] font-extrabold leading-[1.15] tracking-tight text-[#1C261B] text-balance">
            Залетай на обед без диких очередей! 🍕✨
          </h1>
          <p className="text-[13px] leading-[1.45] text-[#5E6E5A] mt-2">
            Пока остальные давятся в очереди, студенты КГТУ, КНУ и АУЦА уже кайфуют с горячим пловом!
          </p>
        </div>

        {/* Current Campus Card */}
        <div className="bg-white rounded-[20px] border border-[#E5E9DF] p-3.5 shadow-[0_2px_10px_rgba(28,38,27,0.03)]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#5E6E5A]">
                    ТЕКУЩИЙ КАМПУС
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#FFF1DB] text-[#9A5B13] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Flame className="w-2.5 h-2.5 fill-[#E59838] text-[#E59838]" />
                    Печи уже дымят
                  </span>
                </div>
                <div className="text-[16px] font-extrabold text-[#1C261B] mt-1 leading-tight">
                  {currentUniversity.fullName}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#5E6E5A] mt-1">
                  <Store className="w-3.5 h-3.5 text-[#4D6A42] shrink-0" />
                  <span className="truncate">
                    {currentBuilding.name}, {currentBuilding.canteenName}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-1 bg-[#EBF3E6] hover:bg-[#DFECD7] text-[#3E5834] text-[12px] font-bold px-3 py-2 rounded-full shrink-0 transition-colors active:scale-95"
            >
              <span>Сменить</span>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-[20px] border border-[#E5E9DF] p-4 shadow-[0_2px_10px_rgba(28,38,27,0.03)] space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#EBF3E6] text-[#4D6A42] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-extrabold text-[#1C261B] leading-snug">
                  Лови студенческий студ-билет 🎓
                </h2>
                <p className="text-[12px] text-[#5E6E5A] mt-0.5">
                  Подтверди, что ты наш, и забирай скидочки 20%
                </p>
              </div>
            </div>
            <GraduationCap className="w-5 h-5 text-[#4D6A42] shrink-0 mt-0.5" />
          </div>

          {/* Photo Scan Box */}
          <div className="rounded-2xl bg-[#ECF5E7] border border-[#D8E7D0] p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#4D6A42] flex items-center justify-center mx-auto shadow-sm">
              {photoVerified ? (
                <CheckCircle2 className="w-6 h-6 text-[#4D6A42]" />
              ) : (
                <Camera className={`w-5 h-5 ${isScanning ? 'animate-pulse text-[#E59838]' : ''}`} />
              )}
            </div>
            <div className="text-[15px] font-extrabold text-[#1C261B] mt-2.5">
              {isScanning
                ? 'Распознаем серию и вуз...'
                : photoVerified
                ? 'Студак подтвержден! 🎉'
                : 'Щелкни свой студак 📸'}
            </div>
            <p className="text-[12px] text-[#5E6E5A] leading-relaxed mt-1 max-w-[260px] mx-auto">
              {photoVerified
                ? `Студент ${currentUniversity.shortName} · Скидка 20% активирована`
                : 'Наведи камеру — умный скан моментально всё распознает и вручит пропуск к еде!'}
            </p>
            <button
              type="button"
              onClick={handlePhotoScan}
              disabled={isScanning}
              className={`mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                photoVerified
                  ? 'bg-[#4D6A42] text-white'
                  : 'bg-[#D6E8CE] hover:bg-[#C9E0BF] text-[#2F4626]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>
                {isScanning
                  ? 'Сканируем...'
                  : photoVerified
                  ? 'Переснять студак ✓'
                  : 'Сфоткать студак 📸'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E9DF]" />
            <span className="text-[10px] font-bold tracking-wider text-[#7A8976]">
              ИЛИ ЧЕРЕЗ ПОЧТУ
            </span>
            <div className="h-px flex-1 bg-[#E5E9DF]" />
          </div>

          {/* Email Input */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="student-email"
                className="text-[12px] font-bold text-[#1C261B] leading-tight"
              >
                Или вбей свой @edu.kg, если лень фоткать
              </label>
              <span className="text-[10px] font-semibold text-[#5E6E5A] shrink-0">
                Авто-проверка
              </span>
            </div>

            <div
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 transition-colors ${
                isEmailValid
                  ? 'bg-[#F3F8F0] border-[#4D6A42]'
                  : 'bg-[#F7F8F4] border-[#E5E9DF] focus-within:border-[#4D6A42]'
              }`}
            >
              <AtSign className="w-4 h-4 text-[#5E6E5A] shrink-0" />
              <input
                id="student-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`name@${currentUniversity.domain}`}
                className="w-full bg-transparent text-[14px] font-medium text-[#1C261B] focus:outline-none"
              />
              {isEmailValid && (
                <span className="w-6 h-6 rounded-full bg-[#4D6A42] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {isEmailValid && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#4D6A42] mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Красавчик! {currentUniversity.shortName} подтвержден 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Proof Pill Card */}
        <div className="bg-[#EAF3E5] rounded-[20px] border border-[#D8E7D0] px-3.5 py-3 flex items-center gap-3">
          <div className="flex -space-x-2 shrink-0">
            <span className="w-8 h-8 rounded-full bg-[#3B5332] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
              АТ
            </span>
            <span className="w-8 h-8 rounded-full bg-[#B76E22] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
              НБ
            </span>
            <span className="w-8 h-8 rounded-full bg-[#5E6E5A] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
              СК
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-extrabold text-[#1C261B] tabular-nums">
              🔥 1,420 сытых студентов
            </div>
            <div className="text-[11px] text-[#5E6E5A] truncate">
              уже обедают по-царски на этой неделе
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full min-h-[54px] rounded-[20px] bg-[#4D6A42] hover:bg-[#3B5332] text-white font-extrabold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#4D6A42]/20 transition-all active:scale-[0.98]"
        >
          <span>Подтвердить и погнали! 😋</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5E6E5A]">
          <Lock className="w-3 h-3" />
          <span>Всё безопасно и четко, данные под замком 🔒</span>
        </div>
      </div>

      <CampusPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
};
