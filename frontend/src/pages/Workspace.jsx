import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ResearchWorkspace from '../components/Workspace/ResearchWorkspace';
import ChatPanel from '../components/Workspace/ChatPanel';
import ExecutiveSummaryCard from '../components/Workspace/ExecutiveSummaryCard';
import FinancialMetricsCard from '../components/Workspace/FinancialMetricsCard';
import RedFlagsCard from '../components/Workspace/RedFlagsCard';
import ComparisonCard from '../components/Workspace/ComparisonCard';
import ReportCard from '../components/Workspace/ReportCard';

export const Workspace = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 page-transition-wrapper">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Scrollable Feed */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0 space-y-6 bg-slate-50">
        <ResearchWorkspace />
        <ChatPanel />
      </div>

      {/* Right Sidebar Placeholder Cards */}
      <aside className="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto space-y-5 shrink-0 hidden xl:block shadow-sm">
        <div className="pb-2 border-b border-slate-100 mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-manrope">
            Intelligence Feeds
          </span>
        </div>
        <ExecutiveSummaryCard />
        <FinancialMetricsCard />
        <RedFlagsCard />
        <ComparisonCard />
        <ReportCard />
      </aside>
    </div>
  );
};

export default Workspace;
