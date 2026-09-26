import React from 'react';

const RISK_STYLES = {
  Low: {
    ring: 'text-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    panel: 'bg-emerald-50/70 border-emerald-200',
    icon: '✅',
  },
  Moderate: {
    ring: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    panel: 'bg-amber-50/70 border-amber-200',
    icon: '⚠️',
  },
  High: {
    ring: 'text-rose-500',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    panel: 'bg-rose-50/70 border-rose-200',
    icon: '🚨',
  },
};

function ConfidenceGauge({ confidence, riskLevel }) {
  const style = RISK_STYLES[riskLevel];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${style.ring} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-900">{confidence}%</span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Confidence</span>
      </div>
    </div>
  );
}

export default function PredictionResultCard({ disease, prediction, onCheckAnother }) {
  const { confidence, riskLevel, factors } = prediction;
  const style = RISK_STYLES[riskLevel];

  return (
    <div className="space-y-6">
      {/* Prominent warning for high risk */}
      {riskLevel === 'High' && (
        <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-600/25 flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-extrabold">Please consult a qualified doctor as soon as possible.</p>
            <p className="text-sm text-rose-100 mt-0.5">
              Your responses show a strong pattern consistent with elevated {disease.name.toLowerCase()} risk.
            </p>
          </div>
        </div>
      )}

      <div className={`rounded-2xl border ${style.panel} p-6 sm:p-8`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ConfidenceGauge confidence={confidence} riskLevel={riskLevel} />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-2xl">{disease.icon}</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{disease.name}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">Single highest-probability condition from this check</p>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide ${style.badge}`}>
              <span>{style.icon}</span> {riskLevel} Risk
            </span>
          </div>
        </div>
      </div>

      {/* Why this prediction was made */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span>🔎</span> Why this prediction was made
        </h3>
        {factors.length > 0 ? (
          <ul className="space-y-2.5">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-700">{f.label}</span>
                <span className="text-xs font-bold text-slate-400 shrink-0">+{f.points} pts</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No strong contributing factors were flagged — your baseline inputs (age, gender, BMI) were used.</p>
        )}
      </div>

      {/* Precautions & lifestyle recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span>🌱</span> Precautions &amp; Lifestyle Recommendations
        </h3>
        <ul className="grid sm:grid-cols-2 gap-3">
          {disease.prevention.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-emerald-500 mt-0.5">●</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600">
        <span className="font-bold text-slate-800">Disclaimer: </span>
        This is an AI-assisted prediction and not a medical diagnosis.
      </div>

      <div className="flex justify-center">
        <button
          onClick={onCheckAnother}
          className="px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Check Another Condition
        </button>
      </div>
    </div>
  );
}
