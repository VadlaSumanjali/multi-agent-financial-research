import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rect', // 'rect' | 'circle' | 'text'
  height,
  width,
}) => {
  const shapeClass = 
    variant === 'circle' ? 'rounded-full' :
    variant === 'text' ? 'rounded-md h-3 my-1.5' :
    'rounded-xl';

  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      className={`skeleton-shimmer inline-block w-full ${shapeClass} ${className}`}
      style={style}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-800/40">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-5 flex-1" variant={colIndex === 0 ? 'rect' : 'text'} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8" variant="circle" />
      </div>
      <Skeleton className="h-8 w-16" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-3 w-12" variant="text" />
        <Skeleton className="h-3 w-20" variant="text" />
      </div>
    </div>
  );
};
