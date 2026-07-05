import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Sparkles,
  User,
  Plus,
  Trash,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  Search,
  BookOpen,
  Info,
  Calendar,
  CheckCircle,
  Clock,
  Circle
} from 'lucide-react';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

export const Workspace = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    deleteSession,
    createNewSession,
    updateSessionNotes,
    addMessageToSession,
    uploadFile
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [leftSearch, setLeftSearch] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'summary' | 'meta'
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    addMessageToSession(inputMessage);
    setInputMessage('');
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Simple Markdown-lite Renderer
  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index} className="font-semibold text-slate-900 dark:text-white">{part}</strong> : part
    );
  };

  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-semibold font-jakarta text-slate-800 dark:text-slate-200 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs font-semibold font-jakarta text-brand-blue dark:text-brand-blue-hover mt-3 mb-1">
            {line.substring(5)}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-600 dark:text-slate-300 my-1 text-xs">
            {parseBoldText(line.substring(2))}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-600 dark:text-slate-300 my-1 text-xs">
            {parseBoldText(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      return (
        <p key={idx} className="my-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  const filteredSessions = sessions.filter(s =>
    s.company.toLowerCase().includes(leftSearch.toLowerCase()) ||
    s.ticker.toLowerCase().includes(leftSearch.toLowerCase()) ||
    s.title.toLowerCase().includes(leftSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 page-transition-wrapper min-h-[calc(100vh-8rem)]">
      {/* COLUMN 1: Company selector */}
      <div className="lg:col-span-1 glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-[75vh] overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search companies..."
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-slate-100/50 dark:bg-slate-900/50 text-xs rounded-xl border border-transparent focus:border-brand-blue/30 focus:bg-white dark:focus:bg-slate-950 focus:shadow text-slate-800 dark:text-slate-200"
            />
          </div>
          <Button
            onClick={() => {
              const comp = prompt("Enter Company Name:");
              const tick = prompt("Enter Ticker Symbol:");
              if (comp && tick) createNewSession(null, comp, tick);
            }}
            variant="secondary"
            size="xs"
            className="w-full justify-center gap-1.5"
            Icon={Plus}
          >
            New Session
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900/50">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`w-full text-left p-3.5 flex items-center justify-between text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer ${
                  s.id === activeSessionId
                    ? 'bg-brand-blue/5 dark:bg-brand-blue/10 active-left-indicator'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">{s.company}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{s.ticker}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-normal">
                    {s.title}
                  </span>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[9px] text-slate-400 font-medium">{s.date.split('-').slice(1).join('/')}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    s.status === 'completed' ? 'bg-emerald-500' :
                    s.status === 'processing' ? 'bg-brand-blue animate-pulse' :
                    'bg-rose-500'
                  }`} />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">No sessions found.</div>
          )}
        </div>
      </div>

      {/* COLUMN 2 & 3: Chat conversation timeline */}
      <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-[75vh] overflow-hidden">
        {/* Workspace Title bar */}
        <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-white truncate">
              {activeSession?.title}
            </h2>
            <p className="text-[10px] text-slate-400">
              Active Session: {activeSession?.company} ({activeSession?.ticker})
            </p>
          </div>
          
          {/* Quick upload trigger */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fileInputRef.current.click()}
              size="xs"
              variant="outline"
              className="text-[10px]"
            >
              Add Filing
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.xlsx,.csv"
            />
          </div>
        </div>

        {/* Timeline bar (Active operations) */}
        {activeSession?.timeline && activeSession.timeline.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-100/40 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4 overflow-x-auto text-[10px] text-slate-500">
            <span className="font-bold font-manrope uppercase text-slate-400 tracking-wider">Workflow:</span>
            <div className="flex items-center gap-3 whitespace-nowrap">
              {activeSession.timeline.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {step.status === 'completed' ? (
                    <CheckCircle className="text-emerald-500 h-3.5 w-3.5 shrink-0" />
                  ) : step.status === 'processing' ? (
                    <Clock className="text-brand-blue h-3.5 w-3.5 shrink-0 animate-spin" />
                  ) : (
                    <Circle className="text-slate-300 dark:text-slate-700 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className={step.status === 'completed' ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                    {step.name}
                  </span>
                  {idx < activeSession.timeline.length - 1 && <ChevronRight size={10} className="text-slate-300 dark:text-slate-700" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20 dark:bg-slate-950/10">
          {activeSession?.messages && activeSession.messages.length > 0 ? (
            activeSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-brand-blue text-white shadow-md shadow-brand-blue/15'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl shadow-sm text-xs ${
                    msg.role === 'user'
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-200/40 dark:border-slate-800/40'
                      : 'glass-panel rounded-tl-none border border-slate-200/80 dark:border-slate-800/80'
                  }`}>
                    {renderContent(msg.content)}
                  </div>
                  
                  {/* Metadata: Agent indicator */}
                  {msg.role === 'assistant' && msg.agent && (
                    <div className="flex items-center gap-1.5 pl-1.5 text-[9px] text-slate-400">
                      <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                      <span className="font-semibold text-brand-blue uppercase font-manrope">{msg.agent}</span>
                      <span>• online response</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No Conversation History"
              description="Ask a financial question regarding balance sheets, margins, audit footnotes, or comparative peer ratios."
            />
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI Agents (e.g. 'check red flags', 'valuation comparison', 'debt analysis')..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 h-10 px-4 bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          <Button type="submit" size="sm" className="h-10 px-4.5" Icon={Send} disabled={!inputMessage.trim()}>
            Send
          </Button>
        </form>
      </div>

      {/* COLUMN 4: Utility workspace notes / details */}
      <div className="lg:col-span-1 glass-panel rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-[75vh] overflow-hidden">
        {/* Navigation Tab Header */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 text-center font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === 'notes'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-brand-blue/5'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Notepad
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 text-center font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === 'summary'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-brand-blue/5'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex-1 py-3 text-center font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === 'meta'
                ? 'border-brand-blue text-brand-blue dark:text-brand-blue bg-brand-blue/5'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Filing Info
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'notes' && (
            <div className="h-full flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">Analyst Draft Notes</span>
              <textarea
                value={activeSession?.notes || ''}
                onChange={(e) => updateSessionNotes(e.target.value)}
                placeholder="Type analyst commentary here. Saves dynamically in local session cache..."
                className="w-full flex-1 p-3 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-xl resize-none text-slate-800 dark:text-slate-200 focus:border-brand-blue"
              />
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">AI Synthesis</span>
              <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-slate-700 dark:text-slate-300 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-blue">
                  <Sparkles size={12} /> SYNOPSIS SUMMARY
                </div>
                <p>{activeSession?.summary || 'No AI summary available. Upload filings to populate.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-4">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">Financial Parameters</span>
              
              {activeSession?.metadata ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {Object.entries(activeSession.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 text-[11px]">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-6">No data. Ingest filings first.</div>
              )}

              {/* Connected Docs */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">Session Documents ({activeSession?.documents?.length || 0})</span>
                <div className="space-y-1.5">
                  {activeSession?.documents && activeSession.documents.length > 0 ? (
                    activeSession.documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200/40 dark:border-slate-800/40 text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileText size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{d.name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0">{d.size}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No files connected to this session.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
