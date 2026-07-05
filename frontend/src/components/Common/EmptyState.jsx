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
    <div className={`flex flex-col items-center justify-center text-center p-8 glass-panel rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 ${className}`}>
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 mb-4 ring-8 ring-slate-100/50 dark:ring-slate-900/40">
        <Icon size={28} className="animate-pulse" />
      </div>
      <h4 className="text-base font-semibold font-jakarta text-slate-800 dark:text-slate-200 tracking-tight">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
