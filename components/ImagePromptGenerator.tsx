
import React, { useState } from 'react';
import { generateImagePrompt } from '../geminiService';
import { BrandContext, ImagePrompt } from '../types';
import { CopyIcon } from './Icons';

interface Props {
  brand: BrandContext;
  onSave: (item: any) => void;
}

const ImagePromptGenerator: React.FC<Props> = ({ brand, onSave }) => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<ImagePrompt | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const output = await generateImagePrompt(brand, topic);
      setResult(output);
      onSave({ type: 'prompt', content: JSON.stringify(output) });
    } catch (e) {
      alert("Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">🎨</div>
        <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Image Designer</h3>
        <p className="text-slate-500 mb-6 text-center leading-relaxed font-medium">Describe what you want an image of (e.g. "a carpenter working in his shop"). We'll give you a professional prompt for designers or AI tools.</p>

        <div className="space-y-5">
          <input
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
            placeholder="Topic for image..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Prompt...</span>
              </>
            ) : (
              'Generate Image Prompt'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">AI Designer Prompt</span>
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); alert("JSON Copied!"); }} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
              <CopyIcon className="w-4 h-4" /> Copy JSON
            </button>
          </div>
          <div className="bg-slate-900 text-green-400 p-6 rounded-2xl text-[13px] font-mono overflow-auto border-4 border-slate-800 shadow-2xl ring-4 ring-slate-900">
            <pre className="whitespace-pre-wrap w-full leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePromptGenerator;
