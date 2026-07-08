import React from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../Common/EmptyState';
import { FileText, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResearchWorkspace = () => {
  const { activeSession } = useApp();
  const navigate = useNavigate();

  // If no session exists
  if (!activeSession) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="No session active"
        description="Initialize a new research session from the sidebar or upload a document to get started."
        actionText="Upload Document"
        onAction={() => navigate('/upload')}
        className="h-full py-16"
      />
    );
  }

  const hasDocuments = activeSession.documents && activeSession.documents.length > 0;

  // If session exists but has no documents
  if (!hasDocuments) {
    return (
      <EmptyState
        icon={FileText}
        title="No document selected"
        description="Upload a financial report to begin analysis for this session."
        actionText="Upload Report"
        onAction={() => navigate('/upload')}
        className="h-full py-16"
      />
    );
  }

  // Active workspace with uploaded document, but no analysis backend connected
  const document = activeSession.documents[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* File status header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-[280px]">
              {document.name}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold font-manrope uppercase mt-0.5">
              Size: {document.size} • Uploaded {document.uploadedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-semibold text-slate-600 font-manrope">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Filing Loaded</span>
        </div>
      </div>

      {/* Main empty workspace content */}
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
        <div className="p-4 rounded-full bg-slate-50 text-slate-400">
          <Sparkles size={28} className="text-slate-400" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">
            No research generated yet
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The filing is parsed and stored in the local session. Connect the backend agent cascades to generate reports, red flag matrices, and financial ratios.
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl flex items-start gap-2.5 text-left text-xs text-yellow-750 mt-2 max-w-sm">
          <Loader2 size={16} className="text-yellow-600 animate-spin shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>System Idle</strong>: Awaiting AI analyst connection. You can use the chat panel below to query the structure.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResearchWorkspace;
