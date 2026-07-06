import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    agents,
    logoutUser
  } = useApp();

  const activeAgentsCount = agents.filter(a => a.status === 'active').length;

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Workspace', path: '/workspace' },
    { name: 'Upload', path: '/upload' },
    { name: 'Research', path: '/research' },
    { name: 'Compare', path: '/comparison' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 justify-between select-none">
      {/* Left: Brand Logo & Horizontal Menu */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-slate-900 dark:text-white leading-none font-jakarta tracking-tight">
            multiagent
          </span>
        </Link>

        {/* Horizontal Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'text-primary bg-slate-50 dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
        {/* API Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span>API Active</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User Profile */}
        <Link
          to="/settings"
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
          title="User Profile Settings"
        >
          <User size={15} />
        </Link>

        {/* Log Out */}
        <button
          onClick={logoutUser}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-danger dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          title="Log Out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
