
import React, { useState } from 'react';
import { generateOffer } from '../geminiService';
import { BrandContext } from '../types';
import { CopyIcon } from './Icons';

interface Props {
  brand: BrandContext;
  onSave: (item: any) => void;
}

const OfferGenerator: React.FC<Props> = ({ brand, onSave }) => {
  const [product, setProduct] = useState('');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const output = await generateOffer(brand, product, details);
      if (output) {
        setResult(output);
        onSave({ type: 'offer', content: output, meta: { product } });
      }
    } catch (e) {
      alert("Error generating offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">🏷️</div>
        <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Offer Post</h3>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Product / Service Name</label>
            <input
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
              placeholder="e.g. Diwali Dhamaka Sale"
              value={product}
              onChange={e => setProduct(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Offer Details (Optional)</label>
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 min-h-[100px] resize-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium"
              placeholder="e.g. 20% off on all items, valid till Sunday"
              value={details}
              onChange={e => setDetails(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !product}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Offer...</span>
              </>
            ) : (
              'Create Offer Post'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Generated Content</span>
            <button onClick={() => { navigator.clipboard.writeText(result); alert("Copied!"); }} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
              <CopyIcon className="w-4 h-4" /> Copy All
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

export default OfferGenerator;
