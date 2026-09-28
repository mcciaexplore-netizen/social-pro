
import React, { useState } from 'react';
import { generateTodayPost, generateImagePromptForPost, GeneratedPost } from '../geminiService';
import { BrandContext, HistoryItem, ImagePrompt } from '../types';
import { CopyIcon, CheckCircleIcon } from './Icons';
import Stepper from './Stepper';
import ScheduleStep from './ScheduleStep';
import { ContentStatus } from '../types';

interface Props {
  brand: BrandContext;
  history: HistoryItem[];
  onSave: (item: any) => void;
}

const OBJECTIVES = ['Event Promotion', 'Product/Service', 'Educational', 'Announcement', 'Engagement'];
const TONES = ['Professional', 'Friendly', 'Premium', 'Informative'];
const PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook'];
const STEPS = ['Create', 'Review', 'Schedule'];

const Chip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-black transition-all ${active ? 'bg-blue-600 text-white ' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
  >
    {label}
  </button>
);

const PostGenerator: React.FC<Props> = ({ brand, history, onSave }) => {
  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [brief, setBrief] = useState('');

  const [post, setPost] = useState<GeneratedPost | null>(null);
  const [imagePrompt, setImagePrompt] = useState<ImagePrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'caption' | 'visual'>('caption');

  const [savedStatus, setSavedStatus] = useState<ContentStatus | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const output = await generateTodayPost(brand, history, objective, platform, brief || undefined, tone);
      setPost(output);
      setStep(1);
      const visual = await generateImagePromptForPost(brand, output.caption);
      setImagePrompt(visual);
    } catch (e) {
      alert("Error generating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fullText = post ? `${post.headline ? post.headline + '\n\n' : ''}${post.caption}\n\n${post.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}\n\n${post.cta}` : '';

  const copyCaption = () => {
    navigator.clipboard.writeText(fullText);
    alert("Caption copied!");
  };

  const copyVisualPrompt = () => {
    if (imagePrompt) {
      navigator.clipboard.writeText(JSON.stringify(imagePrompt, null, 2));
      alert("Visual prompt JSON copied!");
    }
  };

  const handleConfirmSchedule = (status: ContentStatus, scheduledAt?: number) => {
    if (!post) return;
    onSave({
      type: 'post',
      content: fullText,
      status,
      scheduledAt,
      meta: { objective, tone, platform, headline: post.headline, hashtags: post.hashtags, cta: post.cta, imagePrompt }
    });
    setSavedStatus(status);
  };

  const startOver = () => {
    setStep(0);
    setPost(null);
    setImagePrompt(null);
    setSavedStatus(null);
    setBrief('');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-3xl font-black text-black tracking-tighter">Today's Post</h2>
        <p className="text-sm font-medium text-black">Create engaging posts with captions, visuals and hashtags.</p>
      </div>

      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-5 bg-white border border-slate-200 rounded-xl p-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Objective</label>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map(o => <Chip key={o} label={o} active={objective === o} onClick={() => setObjective(o)} />)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What do you want to post?</label>
              <textarea
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 min-h-[110px] resize-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-black font-bold placeholder:text-slate-300 placeholder:font-medium"
                placeholder="e.g. Our upcoming workshop on AI for MSMEs"
                value={brief}
                onChange={e => setBrief(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => <Chip key={t} label={t} active={tone === t} onClick={() => setTone(t)} />)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => <Chip key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />)}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg font-black disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Crafting Magic...</span>
                </>
              ) : (
                'AI Generate'
              )}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Post Preview</span>
            <div className="mt-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white min-h-[220px] flex flex-col justify-between shadow-lg">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{platform}</p>
                <p className="font-black text-lg mt-2 leading-snug">{brief || 'Your post preview will appear here'}</p>
              </div>
              <p className="text-xs opacity-70 font-bold">{brand.businessName} · {objective}</p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && post && (
        <div className="animate-in fade-in duration-300">
          <div className="flex bg-slate-100 p-2 rounded-2xl mb-6">
            <button
              onClick={() => setActiveTab('caption')}
              className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'caption' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Post Caption
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'visual' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Visual Idea
            </button>
          </div>

          <div className="bg-white border-2 border-slate-50 rounded-xl p-6 shadow-sm">
            {activeTab === 'caption' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ready-to-copy Caption</span>
                  <button onClick={copyCaption} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
                    <CopyIcon className="w-4 h-4" /> Copy
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    value={post.headline}
                    onChange={e => setPost({ ...post, headline: e.target.value })}
                    className="w-full bg-slate-50 p-3 rounded-xl font-black text-black border-l-4 border-blue-500"
                    placeholder="Headline"
                  />
                  <textarea
                    value={post.caption}
                    onChange={e => setPost({ ...post, caption: e.target.value })}
                    className="w-full bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-base leading-relaxed text-black font-bold min-h-[100px]"
                  />
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((h, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">{h.startsWith('#') ? h : `#${h}`}</span>
                    ))}
                  </div>
                  <input
                    value={post.cta}
                    onChange={e => setPost({ ...post, cta: e.target.value })}
                    className="w-full bg-slate-50 p-3 rounded-xl font-bold text-sm text-black border-l-4 border-green-500"
                    placeholder="Call to action"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">AI Designer Prompt</span>
                  {imagePrompt && (
                    <button onClick={copyVisualPrompt} className="text-blue-600 flex items-center gap-2 text-xs font-black bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all active:scale-95">
                      <CopyIcon className="w-4 h-4" /> Copy JSON
                    </button>
                  )}
                </div>
                <div className="bg-slate-900 text-green-400 p-6 rounded-xl text-[13px] font-mono overflow-auto min-h-[240px] flex items-center">
                  {imagePrompt ? (
                    <pre className="whitespace-pre-wrap w-full leading-relaxed">
                      {JSON.stringify(imagePrompt, null, 2)}
                    </pre>
                  ) : (
                    <div className="w-full text-center py-10 space-y-4">
                      <div className="w-10 h-10 border-3 border-green-400/20 border-t-green-400 rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-500 font-sans italic font-medium">Designing the perfect visual...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-4 rounded-lg font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-lg font-black text-white bg-blue-600 hover:bg-blue-700 transition-all">Next</button>
          </div>
        </div>
      )}

      {step === 2 && post && (
        savedStatus ? (
          <div className="animate-in fade-in duration-300 bg-white border border-slate-200 rounded-xl p-6 text-center py-10 space-y-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600 mx-auto" />
            <p className="font-black text-black text-lg">
              {savedStatus === 'draft' ? 'Saved as draft' : savedStatus === 'scheduled' ? 'Post scheduled' : 'Marked as published'}
            </p>
            <button onClick={startOver} className="text-blue-600 font-black text-sm underline">Create another post</button>
          </div>
        ) : (
          <ScheduleStep onBack={() => setStep(1)} onConfirm={handleConfirmSchedule} />
        )
      )}
    </div>
  );
};

export default PostGenerator;
