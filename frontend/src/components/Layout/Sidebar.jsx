import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Bot,
  BarChart3,
  GitCompare,
  FileArchive,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Research Sessions', icon: FolderKanban, path: '/workspace' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'AI Agents', icon: Bot, path: '/agents' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Company Comparison', icon: GitCompare, path: '/comparison' },
    { name: 'Reports', icon: FileArchive, path: '/reports' },
    { name: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  return (
    <aside
      className={`glass-panel border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between select-none transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Menu */}
      <div className="py-4 space-y-1.5 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4.5 py-3 text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'text-brand-blue dark:text-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 active-left-indicator'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
              }`
            }
            title={sidebarCollapsed ? item.name : undefined}
          >
            <item.icon size={19} className="shrink-0 transition-transform group-hover:scale-105" />
            <span
              className={`transition-all duration-300 font-jakarta whitespace-nowrap overflow-hidden ${
                sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
            >
              {item.name}
            </span>
            
            {/* Tooltip for collapsed view */}
            {sidebarCollapsed && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all z-50 bg-slate-900 dark:bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-lg ml-2 shadow-xl border border-slate-700/50 pointer-events-none whitespace-nowrap font-jakarta">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 transition-all cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
