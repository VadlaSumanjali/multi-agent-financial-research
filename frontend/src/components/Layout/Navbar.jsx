import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, LogOut, FileText, Bot, HelpCircle } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export const Navbar = () => {
  const { logoutUser } = useApp();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Research Workspace', path: '/workspace' },
    { name: 'Compare', path: '/comparison' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between select-none shadow-sm">
      {/* Left: Brand Logo & Horizontal Menu */}
      <div className="flex items-center gap-10">
        <Link to="/upload" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Bot size={18} />
          </div>
          <span className="font-bold text-lg text-slate-900 leading-none font-jakarta tracking-tight">
            multiagent
          </span>
        </Link>

        {/* Horizontal Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right side: Operations & Utilities */}
      <div className="flex items-center gap-4">
        {/* Connection Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-655 font-manrope">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
          <span>Local Demo Mode</span>
        </div>

        {/* User Profile */}
        <Link
          to="/settings"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all"
          title="User Profile Settings"
        >
          <User size={15} />
        </Link>

        {/* Log Out */}
        <button
          onClick={logoutUser}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 border border-slate-200 transition-all cursor-pointer"
          title="Log Out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
