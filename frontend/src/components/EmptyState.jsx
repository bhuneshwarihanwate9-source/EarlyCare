import React from 'react';

export default function EmptyState({ icon = '🔍', title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <p className="font-bold text-slate-800">{title}</p>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
