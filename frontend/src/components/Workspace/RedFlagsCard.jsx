import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const RedFlagsCard = () => {
  return (
    <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-slate-700 border-b border-slate-100 pb-2">
        <AlertTriangle size={16} className="text-slate-400" />
        <h4 className="text-xs font-bold font-jakarta text-slate-800 uppercase tracking-wider">
          Red Flags
        </h4>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
        <ShieldCheck size={18} className="text-slate-350" />
        <p className="text-xs text-slate-400 font-medium select-none">
          No risks detected yet
        </p>
      </div>
    </div>
  );
};

export default RedFlagsCard;
