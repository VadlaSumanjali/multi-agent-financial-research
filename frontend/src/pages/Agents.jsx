import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Sliders, Terminal, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import Button from '../components/Common/Button';

const agentLogsList = {
  'doc-agent': [
    '[10:14:02] Ingestion trigger received for AAPL-10Q',
    '[10:14:05] Decrypting file container... success',
    '[10:14:10] Executing sliding window layout parser',
    '[10:14:22] Extracted 4 balance sheet tables, 2 cash flow grids',
    '[10:14:35] Chunking content (embedding model: text-embedding-3-small)',
    '[10:14:50] Uploading index embeddings to Vector DB',
    '[10:15:01] Ingestion completed. 1,200 nodes registered.'
  ],
  'extraction-agent': [
    '[10:15:02] Analysis triggered for AAPL nodes',
    '[10:15:10] Parsing Q3 balance sheets... matching columns',
    '[10:15:24] Consolidated net revenues: $94.8B (Services: $24.9B)',
    '[10:15:40] Margin check: Gross margin 46.2%, Net margin 24.3%',
    '[10:16:01] Financial structure extraction completed.'
  ],
  'redflag-agent': [
    '[10:16:02] Risk screening initiated',
    '[10:16:15] Reviewing footnote 14 (Litigation contingencies)...',
    '[10:16:30] Flagged FX volatility adjustments: 110 bps impact',
    '[10:16:45] Alert: Silicon procurement commitments increased 18% YoY',
    '[10:17:15] Risk assessment pipeline complete. 2 warnings issued.'
  ],
  'comparison-agent': [
    '[14:02:11] Ingesting tickers AAPL, MSFT, TSLA, NVDA',
    '[14:02:30] Normalizing revenue scales to FY2026 templates',
    '[14:03:01] Calculating comparative multiples (P/E, EV/EBITDA)',
    '[14:03:42] Peer grouping finished. Exporting comparison tables.'
  ],
  'research-agent': [
    '[10:17:16] Orchestrating report components for Apple Inc.',
    '[10:17:40] Cross-checking historical Q2 margins from local index',
    '[10:18:01] Resolving macro indices... inflation buffers parsed',
    '[10:18:15] Synthesis compiled. Generating report blueprint.'
  ],
  'report-agent': [
    '[10:18:16] Received research briefs from Research Agent',
    '[10:18:24] Structuring markdown templates... title blocks set',
    '[10:18:40] Compiling margin statistics tables and warnings sections',
    '[10:18:55] Render process: HTML & PDF schemas completed',
    '[10:19:01] Analyst Brief saved to database. Dispatching notification.'
  ]
};

export const Agents = () => {
  const { agents } = useApp();
  const [selectedAgentId, setSelectedAgentId] = useState('doc-agent');
  const [agentTemps, setAgentTemps] = useState({
    'doc-agent': 0.1,
    'extraction-agent': 0.0,
    'redflag-agent': 0.3,
    'comparison-agent': 0.2,
    'research-agent': 0.7,
    'report-agent': 0.5
  });

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const selectedLogs = agentLogsList[selectedAgentId] || [];

  const handleTempChange = (agentId, val) => {
    setAgentTemps(prev => ({
      ...prev,
      [agentId]: parseFloat(val)
    }));
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          AI Agent Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor orchestration metrics, configure temperature settings, and view diagnostic log outputs for each autonomous agent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Selection Grid */}
        <div className="lg:col-span-1 space-y-3 h-[65vh] overflow-y-auto pr-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`w-full glass-panel p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                agent.id === selectedAgentId
                  ? 'border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/15'
                  : 'border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl text-white bg-gradient-to-tr ${agent.gradient}`}>
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs font-jakarta text-slate-800 dark:text-slate-200">
                    {agent.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 capitalize">{agent.status}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-slate-400 font-manrope">Temp: {agentTemps[agent.id]}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Right: Agent Terminal & Configuration (2 Columns) */}
        {selectedAgent && (
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Parameter Adjustment */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders size={16} className="text-brand-blue" />
                  Model Configuration: {selectedAgent.name}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-brand-blue/10 text-brand-blue font-semibold uppercase font-manrope">
                  Active parameters
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperature slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Agent Temperature</span>
                    <span className="font-bold font-manrope text-brand-blue">{agentTemps[selectedAgent.id]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={agentTemps[selectedAgent.id]}
                    onChange={(e) => handleTempChange(selectedAgent.id, e.target.value)}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <p className="text-[10px] text-slate-400">
                    Lower values force rigid structure (ideal for extraction), higher values allow creative synthesis (reports).
                  </p>
                </div>

                {/* Fixed Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 text-xs">
                    <span className="text-slate-400 block mb-0.5">Model Engine</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Llama-3.3-70b</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 text-xs">
                    <span className="text-slate-400 block mb-0.5">Health State</span>
                    <span className="font-bold text-emerald-500">{selectedAgent.health}% Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal logs */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-[40vh]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60 mb-3 shrink-0">
                <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-500" />
                  Live Operational Output logs
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 green-live-pulse" />
              </div>

              {/* Console log display */}
              <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-2 select-text">
                {selectedLogs.length > 0 ? (
                  selectedLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-600 select-none">[{idx + 1}]</span>
                      <span className={log.includes('success') || log.includes('completed') ? 'text-emerald-400' : log.includes('Alert') ? 'text-amber-400' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 italic">No execution history on buffer. Run workspace triggers.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;
