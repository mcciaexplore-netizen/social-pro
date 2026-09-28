import React, { useState } from 'react';
import { BrandContext, View } from '../types';
import { ChevronLeftIcon, SearchIcon, BellIcon, ChevronDownIcon } from './Icons';

interface Props {
  view: View;
  brand: BrandContext;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onOpenSettings: () => void;
  isSyncing?: boolean;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const TopBar: React.FC<Props> = ({ view, brand, searchQuery, onSearchChange, onBack, onOpenSettings, isSyncing }) => {
  const [notified, setNotified] = useState(false);
  const displayName = brand.ownerName || brand.businessName;
  const showSearch = view === 'dashboard' || view === 'tools';

  return (
    <header className="px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 bg-white z-30 border-b border-slate-100/50">
      <div className="flex items-center gap-3 md:hidden shrink-0">
        {view !== 'dashboard' ? (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
            <ChevronLeftIcon className="w-5 h-5 text-slate-800" />
          </button>
        ) : (
          <img src="/mccia-logo.png" alt="MCCIA" className="h-8 w-auto" />
        )}
      </div>

      <div className="hidden md:flex items-center shrink-0">
        {view !== 'dashboard' && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
            <ChevronLeftIcon className="w-5 h-5 text-slate-800" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center md:justify-start">
        {showSearch && (
          <div className="relative w-full max-w-sm">
            <SearchIcon className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search tools, features..."
              className="w-full bg-slate-50 border border-slate-100 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isSyncing && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" aria-label="Syncing"></div>}
        <button
          onClick={() => setNotified(true)}
          className="relative p-2.5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5 text-slate-400" />
          {!notified && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>}
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 pl-1 pr-2 py-1 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
        >
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0">
            {getInitials(displayName || 'MCCIA Business')}
          </span>
          <span className="hidden sm:block text-left leading-tight">
            <span className="block text-xs font-black text-slate-800 truncate max-w-[9rem]">{displayName || 'Your Business'}</span>
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">MCCIA</span>
          </span>
          <ChevronDownIcon className="hidden sm:block w-3.5 h-3.5 text-slate-300 shrink-0" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
