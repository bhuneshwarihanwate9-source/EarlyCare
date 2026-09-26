import React from 'react';
import RiskCard from '../../components/RiskCard';
import Charts from '../../components/Charts';

export default function Results({ results, onReset }) {
  const chartData = results.map((r) => ({
    label: r.label,
    value: r.probability_pct,
    color: r.tier === 'high' ? 'bg-rose-500' : r.tier === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500',
    badge: `${r.tier.toUpperCase()} (${r.probability_pct}%)`
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Risk Screening Results</h1>
          <p className="text-xs text-slate-500 mt-1">Evaluated using trained multi-condition machine learning models</p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          ← Retake Assessment
        </button>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {results.map((item) => (
          <RiskCard key={item.key} result={item} />
        ))}
      </div>

      {/* Visual Chart Breakdown */}
      <Charts title="AI Risk Level Breakdown" data={chartData} />

      {/* Limitations note */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <span className="font-bold text-slate-800">⚠️ Clinical Notice:</span>
        <p>
          These predictions are screening estimations generated from machine learning statistical patterns. They do not constitute a medical diagnosis. Please discuss high or moderate risk flags with your primary physician.
        </p>
      </div>
    </div>
  );
}
