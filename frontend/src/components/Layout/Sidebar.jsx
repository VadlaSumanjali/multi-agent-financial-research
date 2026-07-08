import React from 'react';
import { useApp } from '../../context/AppContext';
import SessionList from '../Workspace/SessionList';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between select-none transition-all duration-300 shadow-sm ${
        sidebarCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Session Manager Body */}
      <div className="flex-1 p-5 overflow-hidden flex flex-col min-h-0">
        {!sidebarCollapsed ? (
          <SessionList />
        ) : (
          <div className="flex flex-col items-center pt-2 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
              Sess
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
              <HelpCircle size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-center bg-slate-50/50">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-450 hover:text-slate-700 border border-slate-200 bg-white transition-all cursor-pointer shadow-sm"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
