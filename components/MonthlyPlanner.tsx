
import React, { useState } from 'react';
import { generateMonthlyPlan } from '../geminiService';
import { BrandContext, MonthlyPlanItem } from '../types';

interface Props {
  brand: BrandContext;
}

const MonthlyPlanner: React.FC<Props> = ({ brand }) => {
  const [plan, setPlan] = useState<MonthlyPlanItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const output = await generateMonthlyPlan(brand);
      setPlan(output);
    } catch (e) {
      alert("Error generating plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">📅</div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Monthly Content Outline</h3>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">Generate a calendar of what to post. We only suggest topics to save tokens.</p>
        {!plan.length && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Planning...</span>
              </>
            ) : (
              'Generate 30-Day Plan'
            )}
          </button>
        )}
      </div>

      {plan.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-3">
          {plan.map((item, idx) => (
            <div key={idx} className="p-4 border border-slate-100 rounded-2xl flex gap-4 items-start bg-white shadow-sm">
              <div className="bg-indigo-50 text-indigo-700 font-black px-3 py-1.5 rounded-xl text-xs shrink-0 w-16 text-center">
                {item.date}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">{item.type}</span>
                <p className="text-sm font-bold text-slate-800">{item.topic}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setPlan([])}
            className="w-full text-center py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            Clear and generate again
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyPlanner;
