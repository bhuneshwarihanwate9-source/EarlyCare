import React from 'react';

export default function Charts({ title, data }) {
  const chartItems = data || [
    { label: 'Diabetes Screening Signal', value: 87.3, color: 'bg-rose-500', badge: 'High Risk' },
    { label: 'Heart Disease Signal', value: 71.1, color: 'bg-amber-500', badge: 'High Risk' },
    { label: 'Hypertension Signal', value: 12.0, color: 'bg-emerald-500', badge: 'Low Risk' }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
      <h4 className="text-base font-bold text-slate-900 mb-4 tracking-tight">{title || 'Multi-Disease Risk Distribution'}</h4>
      
      <div className="space-y-4">
        {chartItems.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                )}
                <span className="font-extrabold text-slate-900">{item.value}%</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${item.color || 'bg-sky-600'}`}
                style={{ width: `${Math.max(item.value, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
