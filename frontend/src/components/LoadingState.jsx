import React from 'react';

/**
 * Reusable loading indicator.
 * `variant="inline"` for small inline spinners (e.g. buttons),
 * `variant="panel"` (default) for a full card/section placeholder.
 */
export default function LoadingState({ title = 'Loading...', subtitle, variant = 'panel' }) {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        {title}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-slate-200/80">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin mb-4" />
      <p className="font-bold text-slate-800">{title}</p>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-sm">{subtitle}</p>}
    </div>
  );
}
