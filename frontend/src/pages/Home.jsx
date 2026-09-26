import React from 'react';
import DiseaseCard from '../components/DiseaseCard';
import { DISEASES } from '../data/diseases';

const STEPS = [
  { icon: '📝', title: 'Answer a Few Questions', text: 'Pick a condition and fill a short, guided form about your lifestyle, history, and symptoms.' },
  { icon: '🤖', title: 'AI-Assisted Analysis', text: 'Our engine weighs your inputs against known risk patterns for that condition.' },
  { icon: '📊', title: 'Get a Clear Result', text: 'See your confidence score, risk level, and exactly why — in plain language.' },
  { icon: '🩺', title: 'Take Informed Action', text: 'Follow tailored precautions, or get flagged to see a doctor promptly if needed.' },
];

const STATS = [
  { value: '3', label: 'Conditions Screened' },
  { value: '<2 min', label: 'Average Check Time' },
  { value: '24/7', label: 'AI Assistant Availability' },
  { value: '100%', label: 'Free to Use' },
];

export default function Home({ onNavigate }) {
  return (
    <div className="space-y-20 py-8">
      {/* Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
          Early Awareness, Not Diagnosis
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
          Know Your Risk, <span className="text-sky-600">Early.</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          EarlyCare uses guided, symptom-based checks to help you understand your risk of{' '}
          <span className="font-semibold text-slate-800">Diabetes</span>,{' '}
          <span className="font-semibold text-slate-800">Hypertension</span>, and{' '}
          <span className="font-semibold text-slate-800">Heart Disease</span> — in minutes, from anywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={() => onNavigate('diseases')}
            className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all hover:shadow-sky-600/40 text-base"
          >
            Start a Free Check
          </button>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm transition-colors text-base"
          >
            Ask the AI Assistant
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 p-5 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-700">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How EarlyCare Works</h2>
          <p className="text-slate-500 text-sm sm:text-base">Four simple steps from symptoms to actionable insight.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
              <span className="absolute top-4 right-5 text-3xl font-extrabold text-slate-100">{i + 1}</span>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disease Cards */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Conditions We Screen For</h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">Based on our clinical research dataset.</p>
          </div>
          <button
            onClick={() => onNavigate('diseases')}
            className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 shrink-0"
          >
            View All Diseases →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISEASES.map((d) => (
            <DiseaseCard
              key={d.id}
              disease={d}
              onCheckNow={(id) => onNavigate('check-disease', { diseaseId: id })}
              onKnowMore={(id) => onNavigate('disease-details', { diseaseId: id })}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-sky-600/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Your health deserves a head start.</h2>
        <p className="text-sky-100 max-w-xl mx-auto mb-6">
          Early risk awareness is one of the most powerful tools in preventive health. Take your first check today — it's free and takes less than two minutes.
        </p>
        <button
          onClick={() => onNavigate('diseases')}
          className="px-8 py-3.5 bg-white text-sky-700 font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          Check My Risk Now
        </button>
      </section>
    </div>
  );
}
