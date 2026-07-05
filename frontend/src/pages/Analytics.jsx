import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, Database, ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';
import Button from '../components/Common/Button';
import EmptyState from '../components/Common/EmptyState';

const companyData = {
  'AAPL': [
    { year: '2022', revenue: 394.3, profit: 99.8, debt: 120.0, margins: 25.3, cashFlow: 122.1 },
    { year: '2023', revenue: 383.2, profit: 96.9, debt: 111.0, margins: 25.2, cashFlow: 110.5 },
    { year: '2024', revenue: 391.0, profit: 101.9, debt: 104.0, margins: 26.0, cashFlow: 116.2 },
    { year: '2025', revenue: 405.5, profit: 108.2, debt: 95.0, margins: 26.6, cashFlow: 125.0 },
    { year: '2026 (Est)', revenue: 422.0, profit: 115.0, debt: 88.0, margins: 27.2, cashFlow: 132.5 }
  ],
  'MSFT': [
    { year: '2022', revenue: 198.2, profit: 72.7, debt: 49.7, margins: 36.6, cashFlow: 89.0 },
    { year: '2023', revenue: 211.9, profit: 72.3, debt: 47.0, margins: 34.1, cashFlow: 87.5 },
    { year: '2024', revenue: 245.1, profit: 88.1, debt: 44.5, margins: 35.9, cashFlow: 99.2 },
    { year: '2025', revenue: 278.4, profit: 102.5, debt: 41.0, margins: 36.8, cashFlow: 112.0 },
    { year: '2026 (Est)', revenue: 312.0, profit: 118.0, debt: 38.0, margins: 37.8, cashFlow: 124.0 }
  ],
  'NVDA': [
    { year: '2022', revenue: 26.9, profit: 4.3, debt: 10.9, margins: 16.0, cashFlow: 5.6 },
    { year: '2023', revenue: 27.0, profit: 4.7, debt: 9.7, margins: 17.4, cashFlow: 6.1 },
    { year: '2024', revenue: 60.9, profit: 29.7, debt: 8.5, margins: 48.7, cashFlow: 28.0 },
    { year: '2025', revenue: 110.8, profit: 60.5, debt: 8.0, margins: 54.6, cashFlow: 58.2 },
    { year: '2026 (Est)', revenue: 145.0, profit: 82.0, debt: 7.5, margins: 56.5, cashFlow: 80.0 }
  ],
  'TSLA': [
    { year: '2022', revenue: 81.4, profit: 12.5, debt: 5.7, margins: 15.3, cashFlow: 14.7 },
    { year: '2023', revenue: 96.7, profit: 14.9, debt: 5.2, margins: 15.4, cashFlow: 13.2 },
    { year: '2024', revenue: 98.5, profit: 13.4, debt: 4.8, margins: 13.6, cashFlow: 12.8 },
    { year: '2025', revenue: 105.0, profit: 14.8, debt: 4.2, margins: 14.0, cashFlow: 14.0 },
    { year: '2026 (Est)', revenue: 120.0, profit: 18.0, debt: 3.5, margins: 15.0, cashFlow: 18.5 }
  ]
};

export const Analytics = () => {
  const { theme } = useApp();
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [isEmptyState, setIsEmptyState] = useState(false);

  const activeData = companyData[selectedTicker] || [];
  const isDark = theme === 'dark';

  // Chart styling parameters
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare corporate growth scales, debt maturity ratios, operational margins, and net free cash flows.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200/40 dark:border-slate-800/40">
            {Object.keys(companyData).map((tick) => (
              <button
                key={tick}
                onClick={() => setSelectedTicker(tick)}
                disabled={isEmptyState}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedTicker === tick && !isEmptyState
                    ? 'bg-white dark:bg-slate-800 text-brand-blue shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {tick}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setIsEmptyState(!isEmptyState)}
            size="sm"
            variant="outline"
            className="text-xs"
            Icon={RefreshCcw}
          >
            {isEmptyState ? 'Load Chart Data' : 'Simulate Empty Charts'}
          </Button>
        </div>
      </div>

      {isEmptyState ? (
        <EmptyState
          icon={BarChart3}
          title="No Analytics Data Rendered"
          description="To view company comparisons and margin trends, go back to the Dashboard or Workspace, select an active session, and upload a valid financial filing PDF."
          actionText="Load Default Company Chart"
          onAction={() => setIsEmptyState(false)}
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue and Profit Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-white">
              Revenue & Net Profit Trend ($B)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={10} tickLine={false} />
                  <YAxis stroke={textStroke} fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Margins Trend Line Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-white">
              Operating Margin Percentage (%)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={10} tickLine={false} />
                  <YAxis stroke={textStroke} fontSize={10} tickLine={false} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="margins" name="Operating Margin" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Debt Leverage Bar Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-white">
              Total Outstanding Long-Term Debt ($B)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={10} tickLine={false} />
                  <YAxis stroke={textStroke} fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="debt" name="Total Debt" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cash Flow Area Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="font-semibold text-sm font-jakarta text-slate-800 dark:text-white">
              Free Cash Flow Trend ($B)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={10} tickLine={false} />
                  <YAxis stroke={textStroke} fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="cashFlow" name="Free Cash Flow" stroke="#EC4899" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
