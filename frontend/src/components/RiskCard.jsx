import React from 'react';

export default function RiskCard({ result }) {
  const { label, probability_pct, tier, flagged, note } = result;

  const getTierDetails = (tierName) => {
    switch (tierName) {
      case 'high':
        return {
          cardBg: 'bg-rose-50/70 border-rose-200',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          barColor: 'bg-rose-600',
          icon: '🚨',
          statusText: 'High Risk Alert'
        };
      case 'moderate':
        return {
          cardBg: 'bg-amber-50/70 border-amber-200',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          barColor: 'bg-amber-500',
          icon: '⚠️',
          statusText: 'Moderate Risk'
        };
      case 'low':
      default:
        return {
          cardBg: 'bg-emerald-50/70 border-emerald-200',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          barColor: 'bg-emerald-500',
          icon: '✅',
          statusText: 'Low Risk'
        };
    }
  };

  const style = getTierDetails(tier);

  return (
    <div className={`p-5 rounded-xl border ${style.cardBg} transition-all duration-200 hover:shadow-md mb-4`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{style.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{label}</h3>
            <span className="text-xs font-semibold text-slate-500">{style.statusText}</span>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${style.badgeBg}`}>
            {probability_pct}% Risk ({tier})
          </span>
        </div>
      </div>

      {/* Risk Percentage Bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.barColor}`}
          style={{ width: `${Math.max(probability_pct, 4)}%` }}
        />
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">{note}</p>

      {flagged && (
        <div className="mt-3 p-3 bg-rose-100/80 border border-rose-300/80 rounded-lg text-xs font-semibold text-rose-900 flex items-start gap-2">
          <span>ℹ️</span>
          <span>Exceeds clinical decision threshold. A diagnostic follow-up with a medical specialist is strongly recommended.</span>
        </div>
      )}
    </div>
  );
}
