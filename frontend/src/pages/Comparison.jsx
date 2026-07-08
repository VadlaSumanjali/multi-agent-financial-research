import React from 'react';
import EmptyState from '../components/Common/EmptyState';
import { GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Comparison = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 page-transition-wrapper p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
          Company Comparison Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Benchmark and compare key financial metrics across active research companies using the Comparison Agent.
        </p>
      </div>

      <EmptyState
        icon={GitCompare}
        title="No comparisons available"
        description="Upload multiple company filings in the Research Workspace to benchmark and compare metrics side-by-side."
        actionText="Upload Documents"
        onAction={() => navigate('/upload')}
        className="py-16"
      />
    </div>
  );
};

export default Comparison;
