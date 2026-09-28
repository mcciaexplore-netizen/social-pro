import React, { useState } from 'react';
import { ContentStatus } from '../types';

interface Props {
  onBack: () => void;
  onConfirm: (status: ContentStatus, scheduledAt?: number) => void;
  confirmLabel?: string;
}

const OPTIONS: { mode: ContentStatus, title: string, desc: string }[] = [
  { mode: 'draft', title: 'Save as Draft', desc: 'Keep editing later' },
  { mode: 'scheduled', title: 'Schedule Later', desc: 'Pick a date/time' },
  { mode: 'published', title: 'Already Posted', desc: 'Mark as published now' }
];

const ScheduleStep: React.FC<Props> = ({ onBack, onConfirm, confirmLabel = 'Confirm' }) => {
  const [mode, setMode] = useState<ContentStatus>('draft');
  const [date, setDate] = useState('');

  const handleConfirm = () => {
    const scheduledAt = mode === 'scheduled' && date ? new Date(date).getTime() : undefined;
    onConfirm(mode, scheduledAt);
  };

  return (
    <div className="animate-in fade-in duration-300 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">When should this go out?</span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.mode}
            onClick={() => setMode(opt.mode)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === opt.mode ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <p className="font-black text-black">{opt.title}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>

      {mode === 'scheduled' && (
        <input
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-black font-bold"
        />
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-4 rounded-lg font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Back</button>
        <button onClick={handleConfirm} className="flex-1 py-4 rounded-lg font-black text-white bg-blue-600 hover:bg-blue-700 transition-all">{confirmLabel}</button>
      </div>
    </div>
  );
};

export default ScheduleStep;
