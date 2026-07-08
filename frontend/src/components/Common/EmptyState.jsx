import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = HelpCircle,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm ${className}`}>
      <div className="p-4 rounded-full bg-slate-50 text-slate-400 mb-4 ring-8 ring-slate-50/50">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h4 className="text-base font-semibold font-jakarta text-slate-900 tracking-tight">
        {title}
      </h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="outline">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
