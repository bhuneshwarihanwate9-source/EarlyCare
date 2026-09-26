import React from 'react';

const ACCENT_STYLES = {
  sky: { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', pill: 'bg-sky-100 text-sky-700 border-sky-200' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', pill: 'bg-rose-100 text-rose-700 border-rose-200' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function DiseaseCard({ disease, onCheckNow, onKnowMore }) {
  const style = ACCENT_STYLES[disease.accent] || ACCENT_STYLES.sky;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center text-3xl`}>
            {disease.icon}
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${style.pill}`}>
            {disease.prevalence.stat}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{disease.name}</h3>
        <p className={`text-xs font-semibold ${style.text} mt-0.5 mb-3`}>{disease.tagline}</p>

        <p className="text-sm text-slate-600 leading-relaxed flex-1">{disease.shortDescription}</p>

        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          <span className="font-semibold text-slate-700">Prevalence: </span>
          {disease.prevalence.label}
        </p>
      </div>

      <div className="flex border-t border-slate-100">
        <button
          onClick={() => onKnowMore(disease.id)}
          className="flex-1 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Know More
        </button>
        <button
          onClick={() => onCheckNow(disease.id)}
          className="flex-1 py-3.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
        >
          Check Now →
        </button>
      </div>
    </div>
  );
}
