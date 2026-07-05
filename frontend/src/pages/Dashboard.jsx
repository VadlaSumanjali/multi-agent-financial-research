import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  FileText,
  Bot,
  FileArchive,
  Plus,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Trash,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  AlertCircle
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
    documents,
    agents,
    uploadFile
  } = useApp();

  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTicker, setNewTicker] = useState('');
  
  // Table search & filter states
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
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

  // Upload handler
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Sort & Filter
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.company.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.ticker.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectSessionAndGo = (id) => {
    setActiveSessionId(id);
    navigate('/workspace');
  };

  // Metric stats
  const totalSessions = sessions.length;
  const totalFiles = documents.length;
  const indexedFilesCount = documents.filter(d => d.status === 'indexed').length;
  const processedReportsCount = documents.filter(d => d.name.includes('Report') || d.name.includes('Summary') || d.name.endsWith('.pdf')).length;

  return (
    <div className="space-y-8 page-transition-wrapper">
      {/* Hero Section */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight leading-tight">
            Financial Research Workspace
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Manage company filings, collaborate with AI agents, analyze financial statements, and generate analyst-quality investment reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <Button onClick={() => setIsNewResearchOpen(true)} Icon={Plus} variant="primary">
            New Research
          </Button>
          <Button onClick={handleUploadClick} Icon={Upload} variant="outline">
            Upload Document
          </Button>
          <Button onClick={() => navigate('/reports')} Icon={FileArchive} variant="secondary">
            Generate Report
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.xlsx,.csv,.doc,.docx"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Sessions */}
        <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300 relative group overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Research Sessions</span>
            <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-jakarta">{totalSessions}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center">
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">vs. last month</span>
            {/* Sparkline SVG */}
            <svg className="w-16 h-6 text-emerald-500" viewBox="0 0 100 30" fill="none">
              <path d="M0,25 Q15,5 30,20 T60,10 T90,25 T100,5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Indexed Documents */}
        <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300 relative group overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Indexed Filings</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-jakarta">{indexedFilesCount}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center">
              <ArrowUpRight size={14} /> +8%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Active corpus size</span>
            <svg className="w-16 h-6 text-emerald-500" viewBox="0 0 100 30" fill="none">
              <path d="M0,20 Q10,10 20,25 T40,15 T60,5 T80,22 T100,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Active AI agents */}
        <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300 relative group overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Active AI Agents</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Bot size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-jakarta">6</span>
            <span className="text-xs font-medium text-slate-400">100% Online</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Health assessment</span>
            <svg className="w-16 h-6 text-indigo-500 animate-pulse" viewBox="0 0 100 30" fill="none">
              <path d="M0,15 H20 L25,5 L30,25 L35,15 H50 L55,5 L60,25 L65,15 H100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Reports Generated */}
        <div className="glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300 relative group overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 font-manrope uppercase tracking-wider">Analyst Briefs</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <FileArchive size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-jakarta">{processedReportsCount}</span>
            <span className="text-xs font-medium text-rose-500 flex items-center">
              <ArrowDownRight size={14} /> -3%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">vs. last month</span>
            <svg className="w-16 h-6 text-rose-500" viewBox="0 0 100 30" fill="none">
              <path d="M0,5 Q15,25 30,10 T60,25 T90,15 T100,28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid: Research Table & Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Sessions Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-base font-jakarta text-slate-900 dark:text-white">
              Recent Research Sessions
            </h3>
            {/* Search and Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter table..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="h-8 pl-8 pr-3 text-xs w-40 glass-panel rounded-lg focus:border-brand-blue border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="h-8 pl-2 pr-6 text-xs bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Failed">Failed</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 font-semibold uppercase font-manrope tracking-wider">
                  <th className="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('company')}>
                    <span className="flex items-center gap-1">Company {sortField === 'company' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</span>
                  </th>
                  <th className="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('title')}>
                    <span className="flex items-center gap-1">Session {sortField === 'title' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</span>
                  </th>
                  <th className="py-3 px-3 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('date')}>
                    <span className="flex items-center gap-1">Date {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</span>
                  </th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/50">
                {paginatedSessions.length > 0 ? (
                  paginatedSessions.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => selectSessionAndGo(s.id)}
                      className="hover:bg-slate-100/30 dark:hover:bg-slate-900/30 group cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{s.company}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{s.ticker}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium max-w-xs truncate">
                        {s.title}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{s.date}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-medium text-[10px] ${
                          s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          s.status === 'processing' ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 animate-pulse' :
                          s.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                s.status === 'failed' ? 'bg-rose-500' :
                                s.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-blue'
                              }`}
                              style={{ width: `${s.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 w-6">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => selectSessionAndGo(s.id)}
                            className="p-1 text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Open Workspace"
                          >
                            <Play size={14} />
                          </button>
                          <button
                            onClick={() => deleteSession(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Session"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No matching sessions found. Click 'New Research' to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-3 text-xs text-slate-400">
              <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedSessions.length)} of {sortedSessions.length} sessions</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-2 py-1 rounded ${
                      currentPage === idx + 1
                        ? 'bg-brand-blue text-white'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`glass-panel p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
            dragOver
              ? 'border-brand-blue bg-brand-blue/5 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-transparent'
          }`}
        >
          <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 mb-4 ring-8 ring-slate-100/50 dark:ring-slate-900/40">
            <Upload size={24} className={`transition-all duration-300 ${dragOver ? 'translate-y-[-2px] text-brand-blue' : ''}`} />
          </div>
          <h4 className="text-sm font-semibold font-jakarta text-slate-800 dark:text-slate-200 tracking-tight">
            Drag & Drop Corporate Filings
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[200px] mt-1 mb-4 leading-normal">
            Upload PDF reports, Excel financial statements, or TXT transcript logs (up to 32MB).
          </p>
          <Button size="xs" variant="outline" className="pointer-events-none">
            Browse Files
          </Button>
        </div>
      </div>

      {/* AI Agents Monitor Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
            AI Agent Health & Status
          </h3>
          <span className="text-xs text-brand-blue font-semibold cursor-pointer hover:underline" onClick={() => navigate('/agents')}>
            View System Logs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate('/agents')}
              className={`glass-panel p-5 rounded-2xl hover:translate-y-[-2px] transition-all duration-300 cursor-pointer border relative overflow-hidden group ${
                agent.status === 'active'
                  ? 'border-brand-blue/60 live-pulse'
                  : 'border-slate-200/60 dark:border-slate-800/60'
              }`}
            >
              {/* Agent Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl text-white bg-gradient-to-tr ${agent.gradient}`}>
                    <Bot size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-slate-200 tracking-tight">
                      {agent.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-manrope">Last active: {agent.lastActivity.split(' ')[1]}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <span className={`px-2 py-0.5 rounded font-medium text-[9px] flex items-center gap-1 ${
                  agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  <span className={`h-1 w-1 rounded-full ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {agent.status}
                </span>
              </div>

              {/* Progress Ring & Info */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal flex-1 line-clamp-2">
                  {agent.description}
                </p>

                {/* Simulated circular progress ring */}
                {agent.status === 'active' ? (
                  <div className="relative h-10 w-10 shrink-0">
                    <svg className="h-full w-full -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="rgba(156,163,175,0.15)" strokeWidth="3" fill="transparent" />
                      <circle cx="20" cy="20" r="16" stroke="#2563EB" strokeWidth="3" fill="transparent"
                        strokeDasharray={100}
                        strokeDashoffset={100 - agent.progress}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-brand-blue">
                      {agent.progress}%
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 font-manrope">HEALTH</span>
                    <span className="text-xs font-bold text-emerald-500">{agent.health}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Research Session Modal */}
      <Modal
        isOpen={isNewResearchOpen}
        onClose={() => setIsNewResearchOpen(false)}
        title="Initialize Financial Research Session"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-manrope">
              Research Title
            </label>
            <input
              type="text"
              placeholder="e.g. Microsoft 10-K cloud growth analysis"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-xl focus:border-brand-blue text-sm text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-manrope">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Microsoft Corp."
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-xl focus:border-brand-blue text-sm text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-manrope">
                Ticker Symbol *
              </label>
              <input
                type="text"
                placeholder="e.g. MSFT"
                required
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-xl focus:border-brand-blue text-sm text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
            <Button onClick={() => setIsNewResearchOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!newCompany || !newTicker}>
              Create Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
