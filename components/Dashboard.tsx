import React, { useState } from 'react';
import { BrandContext, View } from '../types';
import ToolsGrid from './ToolsGrid';
import { TOOLS } from './toolsConfig';
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
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-6 sm:p-10 rounded-[2rem] border border-blue-100/60">
        <div className="relative z-10 max-w-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Welcome to</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">MCCIA Socials</h2>
          <p className="text-black mt-3 font-medium leading-relaxed">
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

        <div className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 w-56 h-36" aria-hidden="true">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-white rounded-2xl shadow-xl border border-blue-100/60 p-3">
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90"></div>
          </div>
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-56 h-2.5 bg-slate-200 rounded-full"></div>

          {['✨', '🏷️', '💬', '📢'].map((emoji, i) => {
            const positions = [
              'top-0 left-0 -rotate-6',
              'top-2 right-0 rotate-6',
              'bottom-10 left-2 rotate-3',
              'bottom-6 right-2 -rotate-3'
            ];
            return (
              <div
                key={emoji}
                className={`absolute ${positions[i]} w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl`}
              >
                {emoji}
              </div>
            );
          })}
        </div>

        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl"></div>
        <div className="absolute -top-8 -left-8 w-28 h-28 bg-indigo-200/40 rounded-full blur-xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between ml-1">
          <div>
            <h3 className="text-xs font-black text-black uppercase tracking-[0.15em]">Your Tools</h3>
            <p className="text-sm text-black font-medium">Choose a tool to get started</p>
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
        <button
          onClick={() => setShowGuide(true)}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 bg-white text-amber-700 px-4 py-2 rounded-full text-xs font-black shadow-sm border border-amber-100 hover:bg-amber-100 active:scale-95 transition-all"
        >
          View Guide
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-6" onClick={() => setShowGuide(false)}>
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-[2rem] rounded-t-[2rem] p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Quick Guide</h3>
                <p className="text-sm text-slate-400 font-medium">Get the most out of MCCIA Socials</p>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-2 -mr-2 -mt-2 hover:bg-slate-100 rounded-full transition-all text-slate-400" aria-label="Close">
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {TIPS.map(t => (
                <div key={t} className="flex gap-3 p-3 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium">
                  <LightbulbIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  {t}
                </div>
              ))}
            </div>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-3">What each tool does</h4>
            <div className="space-y-3">
              {TOOLS.map(tool => (
                <div key={tool.view} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${tool.color} ${tool.iconColor} flex items-center justify-center text-base shrink-0`}>{tool.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tool.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{tool.desc}</p>
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

export default Dashboard;
