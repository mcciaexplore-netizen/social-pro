import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { TrashIcon, ContentIcon, HistoryIcon } from './Icons';

type Segment = 'content' | 'activity';

interface Props {
  history: HistoryItem[];
  segment: Segment;
  onSegmentChange: (segment: Segment) => void;
  onExport: () => void;
  onDelete: (id: string) => void;
}

const FILTERS = ['all', 'post', 'offer', 'reply', 'broadcast', 'prompt'] as const;

const TYPE_DOT: Record<string, string> = {
  post: 'bg-purple-500',
  offer: 'bg-orange-500',
  reply: 'bg-green-500',
  broadcast: 'bg-blue-500',
  prompt: 'bg-pink-500'
};

const ContentHub: React.FC<Props> = ({ history, segment, onSegmentChange, onExport, onDelete }) => {
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const filtered = filter === 'all' ? history : history.filter(item => item.type === filter);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {segment === 'content' ? 'My Content' : 'Activity Log'}
          </h2>
          <p className="text-sm font-medium text-slate-400">
            {segment === 'content' ? 'Everything you\'ve generated, ready to reuse' : 'Cloud-synced history of every action'}
          </p>
        </div>
        {segment === 'activity' && history.length > 0 && (
          <button onClick={onExport} className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
            Export CSV
          </button>
        )}
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => onSegmentChange('content')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${segment === 'content' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ContentIcon className="w-4 h-4" /> My Content
        </button>
        <button
          onClick={() => onSegmentChange('activity')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${segment === 'activity' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <HistoryIcon className="w-4 h-4" /> Activity
        </button>
      </div>

      {history.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
          <div className="text-5xl mb-4 opacity-10">📁</div>
          <p className="text-slate-400 font-bold italic">Nothing here yet.</p>
        </div>
      ) : segment === 'content' ? (
        <div className="space-y-4">
          {filtered.map(item => (
            <div key={item.id} className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black bg-blue-50 text-blue-600 ring-1 ring-blue-100">{item.type}</span>
                <span className="text-[10px] font-bold text-slate-300 tracking-tighter uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-[15px] text-slate-700 whitespace-pre-wrap line-clamp-4 font-bold leading-relaxed">{item.content}</p>
              <div className="mt-5 flex justify-end items-center gap-5">
                <button
                  onClick={() => { if (confirm('Delete this item?')) onDelete(item.id); }}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(item.content); alert('Copied!'); }} className="text-xs font-black text-blue-600 hover:underline">Copy Again</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => {
            const d = new Date(item.timestamp);
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${TYPE_DOT[item.type] || 'bg-slate-400'}`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.content.replace(/\n/g, ' ')}</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.type} · {d.toLocaleDateString()} {d.toLocaleTimeString()}</p>
                </div>
                <button
                  onClick={() => { if (confirm('Delete this item?')) onDelete(item.id); }}
                  className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentHub;
