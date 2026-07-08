import React from 'react';
import EmptyState from '../components/Common/EmptyState';
import { FileArchive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 page-transition-wrapper p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
          Financial Reports
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Build and access analyst-style PDF briefs and summaries compiled by the Report Agent.
        </p>
      </div>

      <EmptyState
        icon={FileArchive}
        title="No reports compiled"
        description="Filing reports will be generated automatically once documents have been analyzed by the backend agents."
        actionText="Upload Documents"
        onAction={() => navigate('/upload')}
        className="py-16"
      />
    </div>
  );
};

export default Reports;
