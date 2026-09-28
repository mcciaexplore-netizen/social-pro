import React from 'react';

interface Props {
  steps: string[];
  current: number;
}

const Stepper: React.FC<Props> = ({ steps, current }) => (
  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-colors ${
              i < current ? 'bg-blue-600 text-white' : i === current ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </span>
          <span className={`text-xs font-black whitespace-nowrap ${i === current ? 'text-blue-600' : i < current ? 'text-slate-600' : 'text-slate-300'}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && <div className={`h-px w-6 sm:w-10 shrink-0 ${i < current ? 'bg-blue-300' : 'bg-slate-100'}`} />}
      </React.Fragment>
    ))}
  </div>
);

export default Stepper;
