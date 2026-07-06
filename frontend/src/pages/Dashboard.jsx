import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  FileText,
  Building,
  FileArchive,
  Plus,
  ArrowRight,
  Trash,
  Play
} from 'lucide-react';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const {
    sessions,
    createNewSession,
    deleteSession,
    setActiveSessionId,
    documents
  } = useApp();

  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTicker, setNewTicker] = useState('');
  const navigate = useNavigate();

  // Create new session handler
  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!newCompany || !newTicker) return;
    createNewSession(newTitle, newCompany, newTicker);
    setIsNewResearchOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewTicker('');
    navigate('/workspace');
  };

  const selectSessionAndGo = (id) => {
    setActiveSessionId(id);
    navigate('/workspace');
  };

  // Calculations for KPI Cards
  const activeWorkspacesCount = sessions.length;
  const indexedDocumentsCount = documents.filter(d => d.status === 'indexed').length;
  // Get unique companies
  const uniqueCompanies = Array.from(new Set(sessions.map(s => s.company))).length;
  // Let's count files that look like reports or let's say 2 default reports
  const generatedReportsCount = 2; // Fixed default catalog size

  return (
    <div className="space-y-8 page-transition-wrapper">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Financial Research Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage research workspaces and analyze company financial documents using AI agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewResearchOpen(true)} Icon={Plus} variant="primary" size="sm">
            New Workspace
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Active Workspaces */}
        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Active Workspaces</span>
            <FolderKanban size={16} className="text-primary" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta">{activeWorkspacesCount}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-medium">
            Active analyst workspaces
          </div>
        </div>

        {/* KPI 2: Indexed Documents */}
        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Indexed Documents</span>
            <FileText size={16} className="text-success" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta">{indexedDocumentsCount}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-medium">
            Embeddings indexed in vector database
          </div>
        </div>

        {/* KPI 3: Companies */}
        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Companies</span>
            <Building size={16} className="text-warning" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta">{uniqueCompanies}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-medium">
            Unique corporate entities
          </div>
        </div>

        {/* KPI 4: Generated Reports */}
        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Generated Reports</span>
            <FileArchive size={16} className="text-danger" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta">{generatedReportsCount}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-medium">
            Analyst PDF briefs compiled
          </div>
        </div>
      </div>

      {/* Main Grid: Workspaces and recent uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspaces list */}
        <div className="lg:col-span-2 enterprise-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
              Recent Workspaces
            </h3>
            <span className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1" onClick={() => navigate('/workspace')}>
              View all workspaces <ArrowRight size={12} />
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => selectSessionAndGo(s.id)}
                className="py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{s.company}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-500">{s.ticker}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 truncate">{s.title}</span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-2 py-0.5 rounded font-medium text-[9px] ${
                    s.status === 'completed' ? 'bg-success/10 text-success' :
                    s.status === 'processing' ? 'bg-primary/10 text-primary animate-pulse' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {s.status}
                  </span>
                  
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => selectSessionAndGo(s.id)}
                      className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Open workspace"
                    >
                      <Play size={13} />
                    </button>
                    <button
                      onClick={() => deleteSession(s.id)}
                      className="p-1.5 text-slate-400 hover:text-danger rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete workspace"
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System activity */}
        <div className="lg:col-span-1 enterprise-card p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
                Recent Documents
              </h3>
            </div>
            <div className="space-y-3">
              {documents.slice(0, 4).map((d) => (
                <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <FileText className="text-slate-400 shrink-0" size={14} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{d.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{d.company}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    d.status === 'indexed' ? 'bg-success/10 text-success' :
                    d.status === 'indexing' ? 'bg-primary/10 text-primary animate-pulse' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={() => navigate('/upload')} variant="outline" size="sm" className="w-full justify-center">
              Go to Upload
            </Button>
          </div>
        </div>
      </div>

      {/* New Research Session Modal */}
      <Modal
        isOpen={isNewResearchOpen}
        onClose={() => setIsNewResearchOpen(false)}
        title="Initialize Financial Research Workspace"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
              Workspace Title
            </label>
            <input
              type="text"
              placeholder="e.g. Microsoft 10-K cloud growth analysis"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-850 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Microsoft Corp."
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-850 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope">
                Ticker Symbol *
              </label>
              <input
                type="text"
                placeholder="e.g. MSFT"
                required
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-850 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={() => setIsNewResearchOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!newCompany || !newTicker}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
