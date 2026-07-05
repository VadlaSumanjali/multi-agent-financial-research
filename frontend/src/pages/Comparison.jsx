import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { GitCompare, Check } from 'lucide-react';

const peerCompanyDatabase = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    pe: 28.4,
    margin: 26.0,
    debtEquity: 1.45,
    roe: 145.4,
    revGrowth: 4.8
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    pe: 34.2,
    margin: 35.9,
    debtEquity: 0.42,
    roe: 38.5,
    revGrowth: 15.6
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    sector: 'Semiconductors',
    pe: 52.3,
    margin: 54.6,
    debtEquity: 0.15,
    roe: 92.1,
    revGrowth: 115.0
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    pe: 68.1,
    margin: 13.6,
    debtEquity: 0.08,
    roe: 18.2,
    revGrowth: 12.4
  }
];

export const Comparison = () => {
  const { theme } = useApp();
  const [selectedTickers, setSelectedTickers] = useState(['AAPL', 'MSFT', 'NVDA']);

  const toggleTicker = (ticker) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((t) => t !== ticker);
      }
      return [...prev, ticker];
    });
  };

  const activeComparisonData = peerCompanyDatabase.filter((c) =>
    selectedTickers.includes(c.ticker)
  );

  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const textStroke = isDark ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: isDark ? '#020617' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: '12px',
    color: isDark ? '#f1f5f9' : '#0f172a'
  };

  return (
    <div className="space-y-6 page-transition-wrapper">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
          Cross-Sectional Peer Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Overlay financial valuations, cash ratios, operating margins, and profit metrics side-by-side.
        </p>
      </div>

      {/* Selector Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-manrope">
          Select Peer Tickers to Compare
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {peerCompanyDatabase.map((company) => {
            const isSelected = selectedTickers.includes(company.ticker);
            return (
              <button
                key={company.ticker}
                onClick={() => toggleTicker(company.ticker)}
                className={`h-9 px-4.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isSelected && <Check size={14} className="shrink-0" />}
                {company.ticker} • {company.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table comparison (2 columns on wide) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare size={16} className="text-brand-blue" />
            Peer Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-slate-400 font-semibold uppercase font-manrope tracking-wider bg-slate-50/55 dark:bg-slate-900/20">
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4 text-center">P/E Ratio</th>
                  <th className="py-3.5 px-4 text-center">Net Margin</th>
                  <th className="py-3.5 px-4 text-center">Debt/Equity</th>
                  <th className="py-3.5 px-4 text-center">ROE (%)</th>
                  <th className="py-3.5 px-4 text-center">Rev. Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/50">
                {activeComparisonData.map((company) => (
                  <tr key={company.ticker} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{company.ticker} • {company.sector}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300 font-manrope">{company.pe}x</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300 font-manrope">{company.margin}%</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300 font-manrope">{company.debtEquity}x</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300 font-manrope">{company.roe}%</td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-500 font-manrope">+{company.revGrowth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-variable Chart (1 column on wide) */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm font-jakarta text-slate-900 dark:text-white mb-2">
              Price-to-Earnings Comparison
            </h3>
            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
              Visualizes relative multiple valuation (lower is generally better, higher implies higher growth expectations).
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="ticker" stroke={textStroke} fontSize={10} tickLine={false} />
                <YAxis stroke={textStroke} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pe" name="P/E Ratio" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
