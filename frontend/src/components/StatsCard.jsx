import React from 'react';

export default function StatsCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[220px]">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <span className="p-2 bg-slate-50 rounded-lg text-lg border border-slate-100">{icon}</span>}
      </div>

      <div className="text-3xl font-extrabold text-slate-900 tracking-tight my-1">{value}</div>

      {subtitle && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          {trend && <span className="text-emerald-600 font-bold">{trend}</span>}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
