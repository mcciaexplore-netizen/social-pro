
import React, { useState } from 'react';
import { generateBroadcast } from '../geminiService';
import { BrandContext } from '../types';
import { CopyIcon } from './Icons';

interface Props {
  brand: BrandContext;
  onSave: (item: any) => void;
}

const BroadcastHelper: React.FC<Props> = ({ brand, onSave }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const output = await generateBroadcast(brand);
      if (output) {
        setResult(output);
        onSave({ type: 'broadcast', content: output });
      }
    } catch (e) {
      alert("Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">📢</div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Broadcast Message</h3>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">Get a short message to keep your customers engaged today.</p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Writing...</span>
            </>
          ) : (
            'Give me a Broadcast Message'
          )}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ready-to-send Broadcast</span>
            <button onClick={() => { navigator.clipboard.writeText(result); alert("Copied!"); }} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
              <CopyIcon className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl whitespace-pre-wrap text-base leading-relaxed text-slate-900 font-bold border-l-4 border-blue-500 shadow-inner">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastHelper;
