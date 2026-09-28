import React from 'react';
import { ToolDef } from './toolsConfig';

interface Props {
  tool: ToolDef;
  onClick: () => void;
}

const ToolCard: React.FC<Props> = ({ tool, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex items-center gap-4 lg:flex-col lg:items-start lg:gap-0 p-4 lg:p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all text-left bg-white active:scale-[0.98] duration-200"
  >
    <div className={`text-2xl ${tool.color} ${tool.iconColor} w-14 h-14 lg:w-12 lg:h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform lg:mb-4`}>
      {tool.icon}
    </div>
    <div className="flex-1 lg:flex-none">
      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
      <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">{tool.desc}</p>
    </div>
    <div className="text-slate-300 group-hover:text-blue-400 transition-colors pr-2 lg:absolute lg:top-4 lg:right-4 lg:pr-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
);

export default ToolCard;
