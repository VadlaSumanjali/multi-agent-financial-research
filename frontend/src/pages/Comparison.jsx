import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, Play, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../components/Common/Button';

// Mock comparison database matching requested metrics
const financialDataMap = {
  AAPL: {
    revenue: '$94.8B',
    profit: '$23.0B',
    debt: '$101.2B',
    eps: '$1.46',
    margin: '30.2%',
    cashFlow: '$26.8B'
  },
  TSLA: {
    revenue: '$21.3B',
    profit: '$1.1B',
    debt: '$9.5B',
    eps: '$0.35',
    margin: '5.5%',
    cashFlow: '$3.1B'
  },
  NVDA: {
    revenue: '$26.0B',
    profit: '$14.8B',
    debt: '$8.5B',
    eps: '$0.61',
    margin: '56.9%',
    cashFlow: '$15.3B'
  },
  MSFT: {
    revenue: '$65.6B',
    profit: '$24.7B',
    debt: '$75.5B',
    eps: '$3.30',
    margin: '37.7%',
    cashFlow: '$22.0B'
  }
};

export const Comparison = () => {
  const { sessions, activeSessionId, setActiveSessionId, activeSession, addNotification } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [showTable, setShowTable] = useState(true);

  if (sessions.length === 0) {
    return (
      <div className="space-y-6 page-transition-wrapper">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Company Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Benchmark and compare key financial metrics across active research companies using the Comparison Agent.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 enterprise-card bg-white p-8">
          <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">No Active Workspaces</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              You must create a research workspace first before benchmarking metrics. Go to the Dashboard or Workspace tab to initialize one.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [selectedPeers, setSelectedPeers] = useState(['MSFT', 'NVDA']);

  const handleRunComparison = () => {
    setIsRunning(true);
    addNotification('Comparison Agent starting cross-sectional analysis...', 'info');
    setTimeout(() => {
      setIsRunning(false);
      setShowTable(true);
      addNotification('Peer benchmarking complete.', 'success');
    }, 1500);
  };

  const activeTicker = activeSession?.ticker || 'AAPL';
  const activeCompanyData = financialDataMap[activeTicker] || financialDataMap.AAPL;

  const togglePeer = (ticker) => {
    if (ticker === activeTicker) return;
    setSelectedPeers(prev => {
      if (prev.includes(ticker)) {
        return prev.filter(t => t !== ticker);
      } else {
        return [...prev, ticker];
      }
    });
  };

  const allTickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA'];

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Company Comparison Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Benchmark and compare key financial metrics across active research companies using the Comparison Agent.
        </p>
      </div>

      {/* Selector Toolbar */}
      <div className="enterprise-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Workspace selector */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-manrope block">Active Workspace</span>
            <div className="relative">
              <select
                value={activeSessionId}
                onChange={(e) => setActiveSessionId(e.target.value)}
                className="h-10 pl-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-primary cursor-pointer appearance-none min-w-[200px]"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.company} ({s.ticker})</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Peer company selection */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-manrope block">Peer Benchmarks</span>
            <div className="flex items-center gap-2">
              {allTickers.map(ticker => {
                if (ticker === activeTicker) return null;
                const isSelected = selectedPeers.includes(ticker);
                return (
                  <button
                    key={ticker}
                    onClick={() => togglePeer(ticker)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-350 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {ticker}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="flex items-end pt-4 md:pt-0">
          <Button
            onClick={handleRunComparison}
            Icon={Play}
            variant="primary"
            size="sm"
            loading={isRunning}
          >
            Run Comparison
          </Button>
        </div>
      </div>

      {/* Comparison table */}
      {showTable && (
        <div className="enterprise-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm font-jakarta text-slate-950 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              Comparison Results
            </h3>
            <span className="text-[10px] text-slate-400 font-manrope">Values normalized based on Q3/Q1 filings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 font-bold uppercase font-manrope tracking-wider">
                  <th className="py-3 px-4">Financial Metric</th>
                  <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {activeSession?.company} ({activeTicker}) <span className="text-[9px] text-primary lowercase font-normal">(target)</span>
                  </th>
                  {selectedPeers.map(peerTicker => (
                    <th key={peerTicker} className="py-3 px-4 font-semibold text-slate-500">
                      {peerTicker}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Metric: Revenue */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Revenue</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.revenue}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300">
                      {financialDataMap[peerTicker]?.revenue || '--'}
                    </td>
                  ))}
                </tr>

                {/* Metric: Profit */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Profit</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.profit}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300">
                      {financialDataMap[peerTicker]?.profit || '--'}
                    </td>
                  ))}
                </tr>

                {/* Metric: Debt */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Debt</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.debt}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300">
                      {financialDataMap[peerTicker]?.debt || '--'}
                    </td>
                  ))}
                </tr>

                {/* Metric: EPS */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">EPS</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.eps}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300">
                      {financialDataMap[peerTicker]?.eps || '--'}
                    </td>
                  ))}
                </tr>

                {/* Metric: Operating Margin */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Operating Margin</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.margin}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300 font-manrope">
                      {financialDataMap[peerTicker]?.margin || '--'}
                    </td>
                  ))}
                </tr>

                {/* Metric: Cash Flow */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">Cash Flow</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{activeCompanyData.cashFlow}</td>
                  {selectedPeers.map(peerTicker => (
                    <td key={peerTicker} className="py-4 px-4 text-slate-650 dark:text-slate-300">
                      {financialDataMap[peerTicker]?.cashFlow || '--'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;
