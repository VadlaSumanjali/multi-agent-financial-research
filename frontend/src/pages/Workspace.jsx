import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Calculator,
  ShieldAlert,
  GitCompare,
  Search,
  FileArchive,
  ChevronDown,
  Plus
} from 'lucide-react';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';

export const Workspace = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    updateSessionNotes,
    uploadFile,
    createNewSession
  } = useApp();

  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTicker, setNewTicker] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!newCompany || !newTicker) return;
    createNewSession(newTitle, newCompany, newTicker);
    setIsNewResearchOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewTicker('');
  };

  // Agent team configuration mapping to user requirements
  const agentsData = [
    {
      id: 'doc-agent',
      name: 'Document Agent',
      icon: Database,
      status: 'Ready',
      statusType: 'success',
      description: 'Parses PDFs, extracts text, chunks documents, generates embeddings, and indexes data into the vector database.',
      progress: 100,
      lastRun: '10 mins ago'
    },
    {
      id: 'extraction-agent',
      name: 'Extraction Agent',
      icon: Calculator,
      status: 'Waiting',
      statusType: 'info',
      description: 'Extracts revenue, profit, EPS, assets, liabilities, cash flow, and financial ratios.',
      progress: 0,
      lastRun: '1 hour ago'
    },
    {
      id: 'redflag-agent',
      name: 'Red Flag Agent',
      icon: ShieldAlert,
      status: 'Monitoring',
      statusType: 'warning',
      description: 'Detects debt growth, declining margins, auditor remarks, and financial anomalies.',
      progress: 100,
      lastRun: 'Just now'
    },
    {
      id: 'comparison-agent',
      name: 'Comparison Agent',
      icon: GitCompare,
      status: 'Ready',
      statusType: 'success',
      description: 'Benchmarks financial metrics across multiple companies.',
      progress: 100,
      lastRun: '3 hours ago'
    },
    {
      id: 'research-agent',
      name: 'Research Agent',
      icon: Search,
      status: 'Online',
      statusType: 'success',
      description: 'Answers financial questions using retrieved document context with citations.',
      progress: 100,
      lastRun: '2 mins ago'
    },
    {
      id: 'report-agent',
      name: 'Report Agent',
      icon: FileArchive,
      status: 'Idle',
      statusType: 'default',
      description: 'Builds analyst-style PDF reports using outputs from all agents.',
      progress: 0,
      lastRun: 'Yesterday'
    }
  ];

  if (sessions.length === 0) {
    return (
      <div className="space-y-8 page-transition-wrapper">
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 enterprise-card bg-white p-8">
          <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            <Database size={32} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Research Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Initialize your first workspace context to start loading financial documents and running the autonomous agents.
            </p>
          </div>
          <Button onClick={() => setIsNewResearchOpen(true)} Icon={Plus} variant="primary" size="sm">
            Create Workspace
          </Button>
        </div>

        {/* Modal inside empty state */}
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
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
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
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
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
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs focus:border-primary text-slate-800 dark:text-slate-200"
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
  }

  return (
    <div className="space-y-8 page-transition-wrapper">
      {/* Workspace Selector & Upload Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeSessionId}
              onChange={(e) => setActiveSessionId(e.target.value)}
              className="h-10 pl-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-primary cursor-pointer appearance-none"
            >
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.company} ({s.ticker}) Workspace</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Status: <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeSession?.status}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleFileUploadClick} Icon={Upload} variant="primary" size="sm">
            Upload Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.xlsx,.csv"
          />
        </div>
      </div>

      {/* Main Workspace Layout Grid: Left Documents/Status, Right Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Documents and Ingest Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="enterprise-card p-6 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white">
              Recent Documents ({activeSession?.documents?.length || 0})
            </h3>
            
            {activeSession?.documents && activeSession.documents.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {activeSession.documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-4">
                      <FileText className="text-slate-400 shrink-0" size={15} />
                      <span className="font-semibold text-slate-850 dark:text-slate-200 truncate">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 font-manrope">({doc.size})</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium text-[9px] ${
                        doc.status === 'indexed' ? 'bg-success/10 text-success' :
                        doc.status === 'indexing' ? 'bg-primary/10 text-primary animate-pulse' :
                        'bg-danger/10 text-danger'
                      }`}>
                        {doc.status === 'indexed' && <CheckCircle2 size={10} />}
                        {doc.status === 'indexing' && <Clock size={10} className="animate-spin" />}
                        {doc.status === 'failed' && <AlertTriangle size={10} />}
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-6 text-center">
                No documents uploaded. Choose files to add corporate filings.
              </div>
            )}
          </div>

          {/* Processing Status Block */}
          {activeSession?.status === 'processing' && (
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-xs flex items-center gap-3 animate-pulse">
              <Clock className="text-primary animate-spin shrink-0" size={16} />
              <div className="flex-1">
                <p className="font-bold text-primary">Ingestion Active</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Financial agents are currently parsing balance sheets and auditing disclosures ({activeSession.progress}%)...</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Notes Panel */}
        <div className="lg:col-span-1 enterprise-card p-6 flex flex-col h-full min-h-[220px]">
          <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            Notes Panel
          </h3>
          <textarea
            value={activeSession?.notes || ''}
            onChange={(e) => updateSessionNotes(e.target.value)}
            placeholder="Type notes and financial findings. Saved in session memory..."
            className="w-full flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl resize-none text-slate-800 dark:text-slate-200 focus:border-primary placeholder-slate-400"
          />
        </div>
      </div>

      {/* Multi-Agent Team Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Multi-Agent Team
        </h2>

        {/* 6 Equal Sized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentsData.map((agent) => (
            <div key={agent.id} className="enterprise-card p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    <agent.icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight">
                      {agent.name}
                    </h4>
                    <span className="text-[9px] text-slate-400">Last run: {agent.lastRun}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-semibold text-[9px] ${
                  agent.statusType === 'success' ? 'bg-success/10 text-success' :
                  agent.statusType === 'info' ? 'bg-primary/10 text-primary' :
                  agent.statusType === 'warning' ? 'bg-warning/10 text-warning' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                {agent.description}
              </p>

              {/* Progress Indicator */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Execution Capacity</span>
                  <span className="font-bold">{agent.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      agent.progress === 100 ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Diagram Below Cards */}
        <div className="enterprise-card p-6">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-manrope block mb-4">
            Analysis Pipeline Workflow
          </span>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto py-2">
            {agentsData.map((agent, index) => (
              <React.Fragment key={agent.id}>
                <div className="flex-1 min-w-[140px] p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-2.5 text-xs">
                  <agent.icon size={14} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{agent.name}</p>
                    <span className="text-[9px] text-slate-400">{agent.status}</span>
                  </div>
                </div>
                {index < agentsData.length - 1 && (
                  <ArrowRight size={14} className="text-slate-300 dark:text-slate-700 rotate-90 lg:rotate-0 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
