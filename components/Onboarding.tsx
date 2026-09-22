
import React, { useState } from 'react';
import { BrandContext } from '../types';
import { saveManualFirebaseConfig } from '../firebase';

interface Props {
  onSave: (brand: BrandContext) => void;
  initialData?: BrandContext;
  onCancel?: () => void;
}

type FieldErrors = Partial<Record<'businessName' | 'category' | 'city', string>>;

const inputBase = "w-full bg-white border-2 rounded-2xl px-4 py-3.5 outline-none transition-all text-slate-900 font-bold text-base placeholder:text-slate-300 placeholder:font-medium";
const inputOk = "border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
const inputError = "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50";
const labelBase = "block text-xs font-black text-slate-500 ml-1 uppercase tracking-widest";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-1">
    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 shrink-0">{children}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1" role="alert">
      <span aria-hidden="true">⚠</span> {message}
    </p>
  ) : null;

const Onboarding: React.FC<Props> = ({ onSave, initialData, onCancel }) => {
  const [formData, setFormData] = useState<BrandContext>(initialData || {
    businessName: '',
    category: '',
    city: '',
    language: 'English',
    tone: 'Friendly',
    businessDescription: '',
    apiKey: '',
    firebaseConfigJSON: localStorage.getItem('mccia_firebase_config_manual') || ''
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: keyof FieldErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!formData.businessName.trim()) nextErrors.businessName = 'Business name is required.';
    if (!formData.category.trim()) nextErrors.category = 'Category is required.';
    if (!formData.city.trim()) nextErrors.city = 'City is required.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Save Firebase config if it changed
    if (formData.firebaseConfigJSON) {
      if (formData.firebaseConfigJSON !== localStorage.getItem('mccia_firebase_config_manual')) {
        saveManualFirebaseConfig(formData.firebaseConfigJSON);
        return; // Page will reload
      }
    }

    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 sm:p-10 border border-white animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-32 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100 border border-slate-100 p-3">
            <img src="/mccia-logo.png" alt="MCCIA" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Profile</h2>
          <p className="text-slate-500 text-base mt-2 font-medium">
            {initialData ? "Keep your brand context up to date" : "Let's set up your brand context"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div className="space-y-6">
            <SectionHeading>AI Assistant</SectionHeading>
            <div className="space-y-2 bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <label htmlFor="apiKey" className="block text-xs font-black text-blue-700 ml-1 uppercase tracking-widest">Gemini API Key</label>
              <input
                id="apiKey"
                type="password"
                autoComplete="off"
                className="w-full bg-white border-2 border-blue-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-300 font-bold text-base"
                placeholder="Paste your Gemini API key here..."
                value={formData.apiKey || ''}
                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
              />
              <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1 pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  Get a free API key from Google AI Studio
                </a>
                <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                  <span aria-hidden="true">🔒</span> Stays on this device
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading>Business Details</SectionHeading>

            <div className="space-y-2">
              <label htmlFor="businessName" className={labelBase}>Business Name*</label>
              <input
                id="businessName"
                className={`${inputBase} ${errors.businessName ? inputError : inputOk}`}
                placeholder="e.g. Ramesh Hardware Store"
                autoComplete="organization"
                aria-invalid={!!errors.businessName}
                aria-describedby={errors.businessName ? 'businessName-error' : undefined}
                value={formData.businessName}
                onChange={e => { setFormData({ ...formData, businessName: e.target.value }); clearError('businessName'); }}
              />
              {errors.businessName && <div id="businessName-error"><FieldError message={errors.businessName} /></div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className={labelBase}>Category*</label>
                <input
                  id="category"
                  className={`${inputBase} ${errors.category ? inputError : inputOk} text-sm`}
                  placeholder="Retail"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                  value={formData.category}
                  onChange={e => { setFormData({ ...formData, category: e.target.value }); clearError('category'); }}
                />
                {errors.category && <div id="category-error"><FieldError message={errors.category} /></div>}
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className={labelBase}>City*</label>
                <input
                  id="city"
                  className={`${inputBase} ${errors.city ? inputError : inputOk} text-sm`}
                  placeholder="Pune"
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  value={formData.city}
                  onChange={e => { setFormData({ ...formData, city: e.target.value }); clearError('city'); }}
                />
                {errors.city && <div id="city-error"><FieldError message={errors.city} /></div>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className={labelBase}>Description</label>
              <textarea
                id="description"
                className={`${inputBase} ${inputOk} min-h-[80px] resize-none`}
                placeholder="What products or services do you offer?"
                value={formData.businessDescription}
                onChange={e => setFormData({ ...formData, businessDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading>Content Preferences</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="language" className={labelBase}>Language</label>
                <select
                  id="language"
                  className={`${inputBase} ${inputOk} text-sm`}
                  value={formData.language}
                  onChange={e => setFormData({ ...formData, language: e.target.value as any })}
                >
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="tone" className={labelBase}>Tone</label>
                <select
                  id="tone"
                  className={`${inputBase} ${inputOk} text-sm`}
                  value={formData.tone}
                  onChange={e => setFormData({ ...formData, tone: e.target.value as any })}
                >
                  <option value="Friendly">Friendly</option>
                  <option value="Professional">Professional</option>
                  <option value="Local">Local</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <details className="group pt-6">
              <summary className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▸</span>
                Cloud Sync (Optional)
              </summary>
              <div className="mt-4 space-y-2">
                 <p className="text-[11px] text-slate-500 leading-normal">
                   Paste the full "firebaseConfig" code block from your Firebase Console here.
                 </p>
                 <textarea
                   className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 font-mono text-[10px] text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 min-h-[100px]"
                   placeholder={`const firebaseConfig = {\n  apiKey: "...",\n  projectId: "..."\n};`}
                   value={formData.firebaseConfigJSON || ''}
                   onChange={e => setFormData({ ...formData, firebaseConfigJSON: e.target.value })}
                 />
              </div>
            </details>
          </div>

          <div className="pt-2 space-y-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl hover:shadow-blue-200 active:scale-95 hover:-translate-y-0.5 transition-all"
            >
              {initialData ? 'Update Profile' : 'Save & Start'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-slate-500 font-bold text-xs uppercase tracking-widest py-2"
              >
                Back
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
