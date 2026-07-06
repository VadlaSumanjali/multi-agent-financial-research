import React from 'react';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Shell = ({ children }) => {
  const { notifications, clearNotification } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Notifications Toaster */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg flex gap-3 items-start"
            >
              {/* Type Icon */}
              <div className="shrink-0 mt-0.5">
                {notif.type === 'success' && <CheckCircle className="text-emerald-600 h-4.5 w-4.5" />}
                {notif.type === 'info' && <Info className="text-primary h-4.5 w-4.5" />}
                {notif.type === 'warning' && <AlertTriangle className="text-amber-500 h-4.5 w-4.5" />}
              </div>

              {/* Message */}
              <div className="flex-1 text-xs">
                <p className="font-semibold text-slate-900 dark:text-white leading-normal">
                  {notif.text}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-manrope">
                  {notif.time}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => clearNotification(notif.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0 mt-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shell;
