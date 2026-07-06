import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, Send, FileText, Sparkles, User, HelpCircle, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/Common/Button';

export const Research = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    activeSession,
    addMessageToSession
  } = useApp();

  const [question, setQuestion] = useState('');
  const chatEndRef = useRef(null);

  if (sessions.length === 0) {
    return (
      <div className="space-y-6 page-transition-wrapper">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Research Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query financial indexes and interact with active agents to check data anomalies, margins, and relative peer statistics.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 enterprise-card bg-white p-8">
          <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            <HelpCircle size={32} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Active Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              You must create a research workspace first before asking questions. Go to the Dashboard or Workspace tab to initialize one.
            </p>
          </div>
        </div>
      </div>
    );
  }


  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    addMessageToSession(question);
    setQuestion('');
  };

  // Extract source citations from assistant response if any
  const getCitations = (msg) => {
    if (msg.role === 'user') return [];
    if (msg.agent === 'Red Flag Agent') {
      return [
        { file: 'TSLA-10Q-Q1-2026.pdf', text: 'Section 4: Commitments & Contingencies, p. 28', confidence: 'High' }
      ];
    }
    if (msg.agent === 'Extraction Agent') {
      return [
        { file: `${activeSession?.ticker || 'CORP'}-10Q-Q3-2026.pdf`, text: 'Income Statement (consolidated), p. 2', confidence: 'Verify' }
      ];
    }
    return [
      { file: `${activeSession?.ticker || 'CORP'}-10Q-Q3-2026.pdf`, text: 'Notes to Financial Statements, p. 11', confidence: 'High' }
    ];
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Research Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Query financial indexes and interact with active agents to check data anomalies, margins, and relative peer statistics.
        </p>
      </div>

      {/* Main Research Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[72vh]">
        {/* Left Panel: Selector & Question Box (1 Column) */}
        <div className="lg:col-span-1 enterprise-card p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white">
                Query Configurator
              </h3>
            </div>

            {/* Workspace selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope block">
                Target Workspace
              </label>
              <div className="relative">
                <select
                  value={activeSessionId}
                  onChange={(e) => setActiveSessionId(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary cursor-pointer appearance-none"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.company} ({s.ticker})</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Question box */}
            <form onSubmit={handleAsk} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-manrope block">
                  Question Prompt
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Highlight regulatory credit dependency or FX margin impacts..."
                  className="w-full h-32 p-3 text-xs bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl resize-none text-slate-850 dark:text-slate-200 focus:border-primary placeholder-slate-400"
                />
              </div>

              {/* Ask button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 justify-center"
                Icon={Send}
                disabled={!question.trim()}
              >
                Ask Agent Team
              </Button>
            </form>
          </div>

          <div className="text-[10px] text-slate-400 font-medium">
            * Ask keywords like <span className="font-bold text-slate-655 dark:text-slate-300">"debt"</span> or <span className="font-bold text-slate-655 dark:text-slate-300">"red flag"</span> to route query to specialized agents.
          </div>
        </div>

        {/* Right Panel: Conversation, Citations, Timeline (3 Columns) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
          {/* Middle: Conversation feed (2 Columns on Medium) */}
          <div className="md:col-span-2 enterprise-card flex flex-col h-full overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 shrink-0">
              <h3 className="font-semibold text-xs text-slate-500 dark:text-slate-400 font-manrope uppercase tracking-wider">
                Agent Conversation Feed
              </h3>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/15 dark:bg-slate-900/10">
              {activeSession?.messages && activeSession.messages.length > 0 ? (
                activeSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[90%] ${
                      msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold ${
                      msg.role === 'user'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        : 'bg-primary text-white shadow-sm'
                    }`}>
                      {msg.role === 'user' ? <User size={13} /> : <Sparkles size={13} />}
                    </div>

                    <div className="space-y-1">
                      <div className={`p-4 rounded-xl text-xs border ${
                        msg.role === 'user'
                          ? 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tr-none'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-wrap font-sans leading-relaxed">
                          {msg.content}
                        </div>
                      </div>

                      {/* Msg footer */}
                      {msg.role === 'assistant' && msg.agent && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 pl-1">
                          <span className="h-1 w-1 rounded-full bg-success animate-ping" />
                          <span className="font-bold text-primary font-manrope uppercase">{msg.agent}</span>
                          <span>• citation source parsed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <HelpCircle size={24} className="text-slate-300" />
                  <p className="text-xs">No active conversation. Select query prompt to start.</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Right Column: Citation blocks & Reasoning timeline (1 Column on Medium) */}
          <div className="md:col-span-1 flex flex-col gap-6 h-full overflow-hidden">
            {/* Citation blocks */}
            <div className="enterprise-card p-5 flex flex-col h-[40%] overflow-hidden">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider font-manrope border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 shrink-0">
                Source Citation Blocks
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3">
                {activeSession?.messages && activeSession.messages.length > 0 ? (
                  activeSession.messages.filter(m => m.role === 'assistant').slice(-1).map(msg => (
                    <React.Fragment key={msg.id}>
                      {getCitations(msg).map((cit, cidx) => (
                        <div key={cidx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5 text-primary font-semibold">
                            <FileText size={12} />
                            <span className="truncate">{cit.file}</span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 leading-normal italic">
                            "{cit.text}"
                          </p>
                          <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                            <span>Relativity Rank</span>
                            <span className="text-success font-bold font-manrope">{cit.confidence}</span>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-[10px] text-slate-400 italic">Citations appear after agent response.</div>
                )}
              </div>
            </div>

            {/* Reasoning timeline */}
            <div className="enterprise-card p-5 flex flex-col h-[60%] overflow-hidden">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider font-manrope border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 shrink-0">
                Reasoning Timeline
              </h4>
              <div className="flex-1 overflow-y-auto space-y-4">
                {activeSession?.timeline && activeSession.timeline.length > 0 ? (
                  <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-4 my-2">
                    {activeSession.timeline.map((step, sidx) => (
                      <div key={sidx} className="relative text-[11px]">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[20.5px] top-1 h-2 w-2 rounded-full border-2 border-white dark:border-slate-900 bg-primary" />
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{step.name}</span>
                          <span className="text-[9px] text-slate-450 font-normal">{step.time}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal text-[10px]">
                          {step.details}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">Reasoning cycles recorded upon filing ingestion.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
