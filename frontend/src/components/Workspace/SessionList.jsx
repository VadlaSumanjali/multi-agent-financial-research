import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, FolderKanban, Trash2, ArrowRight } from 'lucide-react';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

export const SessionList = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [ticker, setTicker] = useState('');
  const [title, setTitle] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!company.trim()) return;
    
    createNewSession(
      title.trim() || `${company} Deep Dive`,
      company.trim(),
      ticker.trim().toUpperCase() || 'CORP'
    );

    // Reset and close
    setCompany('');
    setTicker('');
    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full space-y-4 select-none">
      {/* Session Title & Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
          Research Sessions
        </span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          title="New Research Session"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Session List body */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1">
        {sessions.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400 font-medium">No sessions</p>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              Icon={Plus}
              className="mx-auto"
            >
              New Session
            </Button>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-blue-50/50 border-blue-100 text-blue-600 font-semibold shadow-sm'
                    : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FolderKanban size={15} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-xs truncate">{session.title}</span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">
                      {session.company} ({session.ticker})
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  title="Delete Session"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* New Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Session"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. NVIDIA Corp"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
                Ticker Symbol
              </label>
              <input
                type="text"
                placeholder="e.g. NVDA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600 placeholder-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
                Session Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Q3 Earnings Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-blue-600 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" variant="primary" disabled={!company.trim()}>
              Create Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SessionList;
