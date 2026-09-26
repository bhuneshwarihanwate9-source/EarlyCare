import React from 'react';

const VALUES = [
  { icon: '🔍', title: 'Early Risk Assessment', text: 'Surface potential health risks before symptoms become serious, using guided, accessible checks anyone can complete in minutes.' },
  { icon: '📢', title: 'Awareness', text: 'Translate complex clinical risk factors into clear, plain-language explanations people can actually understand and act on.' },
  { icon: '🌱', title: 'Prevention', text: 'Pair every result with practical, personalized lifestyle guidance — because prevention is more powerful than cure.' },
  { icon: '🧭', title: 'Health Guidance', text: 'Help people know when a symptom is worth watching versus when it\'s time to see a qualified doctor.' },
];

export default function About({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-6">
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide">
          Our Mission
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Making Early Disease Risk Awareness Accessible to Everyone
        </h1>
        <p className="text-slate-600 leading-relaxed">
          EarlyCare exists to close the gap between "I feel a little off" and "I have a diagnosis." We believe early
          risk assessment, clear awareness, practical prevention, and simple health guidance can help people take
          action long before a condition becomes serious — no lab coat required to get started.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-5">
        {VALUES.map((v) => (
          <div key={v.title} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl mb-4">
              {v.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-1.5">{v.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Where We Are Today</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          EarlyCare currently screens for three conditions — Diabetes, Hypertension, and Heart Disease — using
          guided questionnaires and a transparent risk-scoring approach. This platform is under active development:
          the experience you see today runs on mock, frontend-only logic while our trained clinical models and
          database integration are finalized behind the scenes.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every prediction is built to be explainable — showing you exactly which factors influenced your result —
          because we believe trust in preventive health tools comes from transparency, not black boxes.
        </p>
      </section>

      <section className="text-center bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Have thoughts on where we should go next?</h2>
        <p className="text-sky-100 mb-6 max-w-xl mx-auto">We're building this in the open — your feedback shapes our roadmap.</p>
        <button
          onClick={() => onNavigate('feedback')}
          className="px-7 py-3 bg-white text-sky-700 font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          Share Feedback
        </button>
      </section>
    </div>
  );
}
