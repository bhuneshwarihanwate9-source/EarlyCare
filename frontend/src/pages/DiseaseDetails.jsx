import React from 'react';
import EmptyState from '../components/EmptyState';
import { getDiseaseById } from '../data/diseases';

function Section({ icon, title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

export default function DiseaseDetails({ diseaseId, onNavigate }) {
  const disease = getDiseaseById(diseaseId);

  if (!disease) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <EmptyState
          icon="❓"
          title="Disease not found"
          subtitle="The condition you're looking for isn't in our current dataset."
          action={
            <button
              onClick={() => onNavigate('diseases')}
              className="px-4 py-2 text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
            >
              Browse All Diseases
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <button
          onClick={() => onNavigate('diseases')}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 mb-4"
        >
          ← Back to Diseases
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-4xl shrink-0">
            {disease.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{disease.name}</h1>
            <p className="text-sm font-semibold text-sky-700">{disease.tagline}</p>
          </div>
        </div>

        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-lg font-extrabold text-slate-900">{disease.prevalence.stat}</span>
          <span className="text-sm text-slate-600">{disease.prevalence.label}</span>
        </div>

        <button
          onClick={() => onNavigate('check-disease', { diseaseId: disease.id })}
          className="mt-5 w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all"
        >
          Check My Risk for {disease.name} →
        </button>
      </div>

      <Section icon="📖" title="Overview">
        <p className="text-sm text-slate-600 leading-relaxed">{disease.overview}</p>
      </Section>

      <Section icon="⚡" title="Symptoms">
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {disease.symptoms.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-amber-500 mt-0.5">●</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🧬" title="Risk Factors">
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {disease.riskFactors.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-rose-500 mt-0.5">●</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🌱" title="Prevention Tips">
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {disease.prevention.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-emerald-500 mt-0.5">●</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="🩺" title="When to Consult a Doctor">
        <ul className="space-y-2.5">
          {disease.whenToConsult.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
              <span className="text-sky-500 mt-0.5">▶</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
