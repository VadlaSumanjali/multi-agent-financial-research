import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sun, Moon, Sparkles, User, Settings, Check, Trash, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    notifications,
    clearNotification,
    markAllNotificationsRead,
    globalSearchQuery,
    setGlobalSearchQuery,
    sessions,
    setActiveSessionId,
    agents,
    logoutUser
  } = useApp();

  const [showNotif, setShowNotif] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered sessions based on search
  const filteredSearchSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    s.company.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    s.ticker.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const handleSearchResultClick = (id) => {
    setActiveSessionId(id);
    setShowSearchDropdown(false);
    setGlobalSearchQuery('');
    navigate('/workspace');
  };

  const activeAgentsCount = agents.filter(a => a.status === 'active').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 h-16 flex items-center px-6 justify-between select-none">
      {/* Left: Brand logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 shadow-md shadow-brand-blue/20 dark:shadow-brand-blue/5">
          <Sparkles className="text-white h-5.5 w-5.5" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white leading-tight font-jakarta tracking-tight">
            Multi-Agent
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-manrope uppercase tracking-wider">
            Financial Research
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div ref={searchRef} className="relative w-full max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4.5 w-4.5" />
          <input
            type="text"
            placeholder="Search companies, reports, or research..."
            value={globalSearchQuery}
            onChange={(e) => {
              setGlobalSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full h-10 pl-11 pr-4 bg-slate-100/70 hover:bg-slate-200/50 dark:bg-slate-900/60 dark:hover:bg-slate-900/90 text-sm rounded-xl border border-transparent focus:border-brand-blue/30 focus:bg-white dark:focus:bg-slate-950 focus:shadow-md focus:shadow-brand-blue/5 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && globalSearchQuery && (
          <div className="absolute top-12 left-0 right-0 glass-panel-dense rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 max-h-72 overflow-y-auto">
            <div className="text-[10px] text-slate-400 font-semibold px-3 py-1 font-manrope uppercase tracking-wider">
              Research Sessions ({filteredSearchSessions.length})
            </div>
            {filteredSearchSessions.length > 0 ? (
              filteredSearchSessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSearchResultClick(s.id)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg flex items-center justify-between text-sm transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{s.title}</span>
                    <span className="text-[11px] text-slate-400">{s.company} • {s.ticker}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    s.status === 'processing' ? 'bg-brand-blue/10 text-brand-blue animate-pulse' :
                    s.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {s.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-xs text-slate-400 p-3 text-center">No matching sessions found.</div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Operations & Utilities */}
      <div className="flex items-center gap-3">
        {/* Agent Activity Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 text-xs">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeAgentsCount > 0 ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${activeAgentsCount > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Agents: {activeAgentsCount > 0 ? `${activeAgentsCount} active` : 'all idle'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all cursor-pointer relative"
          >
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white dark:border-slate-950">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 glass-panel-dense rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50 mb-1">
                <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Live Agent Notifications</span>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-brand-blue hover:text-brand-blue-hover font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={11} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-colors ${
                        n.read ? 'bg-transparent text-slate-500 dark:text-slate-400' : 'bg-brand-blue/5 dark:bg-brand-blue/10 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="leading-normal font-medium">{n.text}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                      <button
                        onClick={() => clearNotification(n.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">No active agent alerts.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile Avatar */}
        <Link
          to="/settings"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all"
        >
          <User size={18} />
        </Link>

        {/* Log Out */}
        <button
          onClick={logoutUser}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all cursor-pointer"
          title="Log Out Node"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
