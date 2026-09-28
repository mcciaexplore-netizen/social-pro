import React from 'react';
import { View } from '../types';
import { TOOLS } from './toolsConfig';
import ToolCard from './ToolCard';

interface Props {
  setView: (view: View) => void;
  searchQuery?: string;
}

const ToolsGrid: React.FC<Props> = ({ setView, searchQuery }) => {
  const query = (searchQuery || '').trim().toLowerCase();
  const tools = query
    ? TOOLS.filter(t => t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query))
    : TOOLS;

  if (tools.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold italic">No tools match "{searchQuery}".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {tools.map(tool => (
        <ToolCard key={tool.view} tool={tool} onClick={() => setView(tool.view)} />
      ))}
    </div>
  );
};

export default ToolsGrid;
