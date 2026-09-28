
import React, { useState } from 'react';
import { generateReply } from '../geminiService';
import { BrandContext } from '../types';
import { CopyIcon, WhatsAppIcon } from './Icons';

interface Props {
  brand: BrandContext;
  onSave: (item: any) => void;
}

const ReplyAssistant: React.FC<Props> = ({ brand, onSave }) => {
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!msg) return;
    setLoading(true);
    try {
      const output = await generateReply(brand, msg);
      if (output) {
        setResult(output);
        onSave({ type: 'reply', content: output });
      }
    } catch (e) {
      alert("Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">💬</div>
        <h3 className="text-xl font-black text-slate-900 mb-4 text-center">Reply Assistant</h3>

        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3 mb-5">
          <WhatsAppIcon className="w-6 h-6 text-green-600 shrink-0" />
          <p className="text-xs text-green-800 font-medium">Paste the customer message below to get a polite response.</p>
        </div>

        <textarea
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 h-32 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
          placeholder="Paste customer message here..."
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !msg}
          className="mt-5 w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Drafting...</span>
            </>
          ) : (
            'Generate Reply'
          )}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Suggested Reply</span>
            <button onClick={() => { navigator.clipboard.writeText(result); alert("Copied!"); }} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
              <CopyIcon className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl italic text-base leading-relaxed text-slate-900 font-bold border-l-4 border-blue-500 shadow-inner">
            "{result}"
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyAssistant;
