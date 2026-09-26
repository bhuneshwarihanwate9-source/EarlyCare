import React, { useMemo, useState } from 'react';
import DynamicFormField from '../components/DynamicFormField';
import PredictionResultCard from '../components/PredictionResultCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getDiseaseById } from '../data/diseases';
import { requestPrediction } from '../services/mockPredictionService';
import { calcBmi } from '../utils/mockPrediction';

function groupFields(fields) {
  const groups = { core: [], History: [], Symptoms: [] };
  fields.forEach((f) => {
    if (f.group === 'History') groups.History.push(f);
    else if (f.group === 'Symptoms') groups.Symptoms.push(f);
    else groups.core.push(f);
  });
  return groups;
}

export default function CheckDisease({ diseaseId, onNavigate }) {
  const disease = getDiseaseById(diseaseId);

  const initialValues = useMemo(() => {
    if (!disease) return {};
    const v = {};
    disease.formFields.forEach((f) => {
      v[f.id] = f.defaultValue ?? (f.type === 'toggle' ? false : '');
    });
    return v;
  }, [disease]);

  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [result, setResult] = useState(null);

  if (!disease) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <EmptyState
          icon="❓"
          title="Disease not found"
          subtitle="We couldn't find a check form for that condition."
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

  const handleChange = (fieldId, value) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const prediction = await requestPrediction(disease.id, values);
      setResult(prediction);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(initialValues);
    setResult(null);
    setStatus('idle');
  };

  if (status === 'success' && result) {
    const resultDisease = getDiseaseById(result.diseaseId) || disease;
    return (
      <div className="max-w-2xl mx-auto py-4">
        <PredictionResultCard disease={resultDisease} prediction={result} onCheckAnother={() => onNavigate('diseases')} />
      </div>
    );
  }

  const { core, History, Symptoms } = groupFields(disease.formFields);
  const bmi = calcBmi(values.height_cm, values.weight_kg);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => onNavigate('disease-details', { diseaseId: disease.id })}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 mb-2"
        >
          ← Back to {disease.name} Overview
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>{disease.icon}</span> Check My {disease.name} Risk
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Answer the questions below. Fields marked "optional" can be left blank if you don't know the value.
        </p>
      </div>

      {status === 'error' && (
        <ErrorState
          title="We couldn't generate your result"
          subtitle="Something went wrong while analyzing your answers."
          onRetry={handleSubmit}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>👤</span> Personal &amp; Lifestyle Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {core.map((field) => (
              <DynamicFormField key={field.id} field={field} value={values[field.id]} onChange={handleChange} />
            ))}
          </div>
          {bmi && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
              <span className="font-medium text-slate-600">Calculated Body Mass Index (BMI):</span>
              <span className="font-extrabold text-sky-700 text-sm">{bmi} kg/m²</span>
            </div>
          )}
        </div>

        {/* History */}
        {History.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🧬</span> Medical History
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {History.map((field) => (
                <DynamicFormField key={field.id} field={field} value={values[field.id]} onChange={handleChange} />
              ))}
            </div>
          </div>
        )}

        {/* Symptoms */}
        {Symptoms.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>⚡</span> Current Symptoms
            </h2>
            <p className="text-xs text-slate-500">Select any symptoms you've experienced recently:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Symptoms.map((field) => (
                <DynamicFormField key={field.id} field={field} value={values[field.id]} onChange={handleChange} />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-extrabold text-base rounded-xl shadow-lg shadow-sky-600/25 transition-all"
        >
          {status === 'loading' ? <LoadingState variant="inline" title="Analyzing your responses..." /> : 'Predict My Risk'}
        </button>
      </form>

      {status === 'loading' && (
        <LoadingState title="Running AI-assisted analysis..." subtitle="This usually takes just a second." />
      )}
    </div>
  );
}
