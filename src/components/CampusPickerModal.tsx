import React, { useState } from 'react';
import { Building2, Check, GraduationCap, MapPin, X } from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';
import { useCampusBite } from '../context/CampusBiteContext';

interface CampusPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusPickerModal: React.FC<CampusPickerModalProps> = ({ isOpen, onClose }) => {
  const { profile, setUniversityAndBuilding, showToast } = useCampusBite();
  const [selectedUniId, setSelectedUniId] = useState(profile.universityId);

  if (!isOpen) return null;

  const activeUni = UNIVERSITIES.find((u) => u.id === selectedUniId) || UNIVERSITIES[0];

  const handleSelectBuilding = (uniId: string, buildingId: string, label: string) => {
    setUniversityAndBuilding(uniId, buildingId);
    showToast(`Кампус обновлен: ${label}`);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px]">
      <div className="w-full bg-[#F7F8F4] rounded-t-[28px] border-t border-[#E5E9DF] max-h-[82%] flex flex-col shadow-2xl">
        <div className="w-10 h-1.5 bg-[#D4DCD0] rounded-full mx-auto mt-3 mb-2 shrink-0" />
        <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E5E9DF] shrink-0">
          <div>
            <h3 className="text-[17px] font-bold text-[#1C261B]">Выбери свой вуз и корпус</h3>
            <p className="text-xs text-[#5E6E5A]">Покажем живую очередь и расписание звонков</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть выбор вуза"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E9DF] flex items-center justify-center text-[#5E6E5A] hover:text-[#1C261B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 no-scrollbar">
          {UNIVERSITIES.map((uni) => {
            const isExpanded = selectedUniId === uni.id;
            const isCurrent = profile.universityId === uni.id;
            return (
              <div
                key={uni.id}
                className={`rounded-2xl border transition-colors ${
                  isExpanded
                    ? 'bg-white border-[#4D6A42]'
                    : 'bg-white/80 border-[#E5E9DF] hover:border-[#4D6A42]/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedUniId(uni.id)}
                  className="w-full flex items-center justify-between p-3.5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-[#4D6A42] text-white' : 'bg-[#EBF3E6] text-[#4D6A42]'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#1C261B] truncate">
                        {uni.fullName}
                      </div>
                      <div className="text-xs text-[#5E6E5A]">
                        @{uni.domain} • {uni.buildings.length}{' '}
                        {uni.buildings.length === 1 ? 'столовая' : 'столовые'}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[11px] font-semibold text-[#4D6A42] bg-[#EBF3E6] px-2.5 py-1 rounded-full shrink-0">
                      Выбран
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-[#F0F3EC]">
                    <div className="text-[11px] font-semibold text-[#5E6E5A] pt-1">
                      Выбери корпус для самовывоза:
                    </div>
                    {activeUni.buildings.map((b) => {
                      const activeBld =
                        profile.universityId === uni.id && profile.buildingId === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() =>
                            handleSelectBuilding(uni.id, b.id, `${uni.shortName} • ${b.canteenName}`)
                          }
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.99] ${
                            activeBld
                              ? 'bg-[#EBF3E6] border-[#4D6A42]'
                              : 'bg-[#F7F8F4] border-[#E5E9DF] hover:bg-[#EBF3E6]/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <Building2 className="w-4 h-4 text-[#4D6A42] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#1C261B]">
                                {b.name} • {b.canteenName}
                              </div>
                              <div className="text-[11px] text-[#5E6E5A] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {b.hours} · {b.breakNotice}
                                </span>
                              </div>
                            </div>
                          </div>
                          {activeBld && (
                            <span className="w-6 h-6 rounded-full bg-[#4D6A42] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
