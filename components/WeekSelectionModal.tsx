import { useEffect, useMemo, useState } from 'react';
import { WeekOption, formatWeekRange, getDefaultWeekOption, getWeekOptions, sameWeek } from '@/lib/week';

type WeekSelectionModalProps = {
  title?: string;
  initialWeek?: WeekOption;
  onClose: () => void;
  onConfirm: (week: WeekOption) => void;
};

export function WeekSelectionModal({ title = '対象週を選択', initialWeek, onClose, onConfirm }: WeekSelectionModalProps) {
  const options = useMemo(() => getWeekOptions(), []);
  const defaultWeek = useMemo(() => initialWeek ?? getDefaultWeekOption(), [initialWeek]);
  const [selected, setSelected] = useState<WeekOption>(defaultWeek);

  useEffect(() => setSelected(defaultWeek), [defaultWeek]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-rakumon-text/30 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="week-modal-title">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/80 bg-rakumon-bg p-6 shadow-premium md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-outfit text-xs font-bold uppercase tracking-[0.3em] text-rakumon-green">Weekly Report</p>
            <h2 id="week-modal-title" className="mt-2 text-2xl font-bold text-rakumon-text">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-rakumon-body">作成する週次レポートの対象期間を選択してください。</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-rakumon-caption transition hover:bg-rakumon-light hover:text-rakumon-green" aria-label="閉じる">×</button>
        </div>
        <div className="mt-6 grid max-h-[56vh] gap-3 overflow-y-auto pr-1">
          {options.map((option) => {
            const isSelected = sameWeek(selected, option);
            return (
              <button key={`${option.weekYear}-${option.weekNumber}`} onClick={() => setSelected(option)} className={`rounded-[18px] border p-4 text-left transition ${isSelected ? 'border-rakumon-green bg-rakumon-light shadow-sm' : 'border-rakumon-border bg-white hover:border-rakumon-green/50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-number text-2xl font-bold text-rakumon-text">W{option.weekNumber}</p>
                    <p className="mt-1 font-number text-sm text-rakumon-caption">{formatWeekRange(option.startDate, option.endDate)}</p>
                  </div>
                  {option.label && <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-rakumon-green">{option.label}</span>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-7 flex justify-end gap-3 border-t border-rakumon-border pt-5">
          <button onClick={onClose} className="btn btn-secondary">キャンセル</button>
          <button onClick={() => onConfirm(selected)} className="btn btn-primary">この週で作成</button>
        </div>
      </div>
    </div>
  );
}
