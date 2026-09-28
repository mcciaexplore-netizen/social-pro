import React from 'react';
import { View } from '../types';
import { HomeIcon, ToolsIcon, ContentIcon, HistoryIcon, SettingsIcon } from './Icons';

interface NavItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}

interface Props {
  view: View;
  contentSegment: 'content' | 'activity';
  onNavigate: (view: View, segment?: 'content' | 'activity') => void;
}

const Sidebar: React.FC<Props> = ({ view, contentSegment, onNavigate }) => {
  const items: NavItem[] = [
    { label: 'Home', icon: HomeIcon, active: view === 'dashboard', onClick: () => onNavigate('dashboard') },
    { label: 'Tools', icon: ToolsIcon, active: view === 'tools', onClick: () => onNavigate('tools') },
    { label: 'My Content', icon: ContentIcon, active: view === 'content' && contentSegment === 'content', onClick: () => onNavigate('content', 'content') },
    { label: 'History', icon: HistoryIcon, active: view === 'content' && contentSegment === 'activity', onClick: () => onNavigate('content', 'activity') },
    { label: 'Settings', icon: SettingsIcon, active: view === 'settings', onClick: () => onNavigate('settings') }
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-slate-100 bg-white px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src="/mccia-logo.png" alt="MCCIA" className="h-8 w-auto" />
        <div className="leading-none">
          <p className="font-black text-blue-600 tracking-tight text-sm">MCCIA</p>
          <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">Socials</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(item => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 p-5 rounded-[1.75rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <p className="font-black tracking-tight">MCCIA</p>
        <p className="text-xs opacity-80 font-medium mt-1 leading-snug">Empowering Industries Through Innovation</p>
      </div>
    </aside>
  );
};

export default Sidebar;
