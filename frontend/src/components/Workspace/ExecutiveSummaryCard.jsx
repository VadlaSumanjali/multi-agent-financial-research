import React from 'react';
import { FileText, Hourglass } from 'lucide-react';

export const ExecutiveSummaryCard = () => {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-2">
        <FileText size={16} className="text-slate-400" />
        <h4 className="text-xs font-bold font-jakarta text-slate-800 uppercase tracking-wider">
          Executive Summary
        </h4>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
        <Hourglass size={18} className="text-slate-300 animate-spin" style={{ animationDuration: '3s' }} />
        <p className="text-xs text-slate-400 font-medium select-none">
          Waiting for analysis...
        </p>
      </div>
    </div>
  );
};

export default ExecutiveSummaryCard;
