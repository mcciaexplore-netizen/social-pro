import React, { useState } from 'react';
import { BrandContext, View } from '../types';
import ToolsGrid from './ToolsGrid';
import { LightbulbIcon } from './Icons';

interface Props {
  setView: (view: View) => void;
  brand: BrandContext;
}

const TIPS = [
  'Use clear and specific prompts for better results.',
  'Post consistently - a simple update beats silence.',
  'Add your city and product name so replies feel personal.',
  'Reuse your best captions as WhatsApp broadcasts too.'
];

const Dashboard: React.FC<Props> = ({ setView, brand }) => {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-6 sm:p-10 rounded-[2rem] border border-blue-100/60">
        <div className="relative z-10 max-w-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Welcome to</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">MCCIA Socials</h2>
          <p className="text-slate-500 mt-3 font-medium leading-relaxed">
            Create, connect and share — all in one place for {brand.businessName || 'your business'}.
          </p>
          <button
            onClick={() => setView('tools')}
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            Explore Tools
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-3 opacity-90">
          {['✨', '🏷️', '💬', '📢'].map((emoji, i) => (
            <div
              key={emoji}
              className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl"
              style={{ transform: `translateY(${i % 2 === 0 ? -10 : 10}px)` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl"></div>
        <div className="absolute -top-8 -left-8 w-28 h-28 bg-indigo-200/40 rounded-full blur-xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between ml-1">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Your Tools</h3>
            <p className="text-sm text-slate-400 font-medium">Choose a tool to get started</p>
          </div>
        </div>
        <ToolsGrid setView={setView} />
      </div>

      <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <LightbulbIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Quick Tip</p>
          <p className="text-sm text-amber-800 font-medium">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
