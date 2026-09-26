import React, { useState } from 'react';
import RiskCard from '../../components/RiskCard';

export default function DoctorResults({ patientName, vitals, labs, results, onReset }) {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveNote = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">Clinical Report</span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{patientName}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-Condition ML Risk Telemetry & Feature Attribution</p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          ← New Assessment
        </button>
      </div>

      {/* Summary Vitals Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-wrap gap-6 items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block font-semibold">Patient Demographics</span>
          <span className="text-sm font-bold text-white">{vitals.age} Yrs / {vitals.gender}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">Blood Pressure / HR</span>
          <span className="text-sm font-bold text-white">{vitals.bp} mmHg ({vitals.hr} bpm)</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">HbA1c / Fasting Glucose</span>
          <span className="text-sm font-bold text-emerald-400">{labs.hbA1c}% / {labs.glucose} mg/dL</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">Model Confidence</span>
          <span className="text-sm font-bold text-sky-400">98.4% Confidence Score</span>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {results.map((item) => (
          <RiskCard key={item.key} result={item} />
        ))}
      </div>

      {/* Explainability & Contributing Factors */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📊</span> Explainability & Contributing Factors
        </h3>
        <p className="text-xs text-slate-500">
          Feature contribution analysis highlighting clinical markers driving elevated risk probabilities:
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-rose-900 block">Elevated Fasting Glucose & HbA1c</span>
              <span className="text-slate-600">Glucose 145 mg/dL exceeds normal diagnostic threshold (100 mg/dL)</span>
            </div>
            <span className="font-extrabold text-rose-700">+48% Risk Attribution</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-amber-900 block">Systolic Blood Pressure (135 mmHg)</span>
              <span className="text-slate-600">Stage 1 Pre-hypertension signal</span>
            </div>
            <span className="font-extrabold text-amber-700">+24% Risk Attribution</span>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-sky-900 block">Elevated LDL Cholesterol (138 mg/dL)</span>
              <span className="text-slate-600">Atherosclerosis cardiovascular marker</span>
            </div>
            <span className="font-extrabold text-sky-700">+18% Risk Attribution</span>
          </div>
        </div>
      </div>

      {/* Doctor Diagnostic Notes Form */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📝</span> Attach Doctor Clinical Note
        </h3>
        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter clinical observations, diagnostic test recommendations, or medication adjustments..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            {saved ? 'Clinical Note Attached ✓' : 'Save Diagnostic Note'}
          </button>
        </form>
      </div>
    </div>
  );
}
