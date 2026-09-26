import React, { useState } from 'react';
import DiseaseCard from '../components/DiseaseCard';
import EmptyState from '../components/EmptyState';
import { searchDiseases } from '../data/diseases';

export default function Diseases({ onNavigate }) {
  const [query, setQuery] = useState('');
  const results = searchDiseases(query);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Diseases We Screen For</h1>
        <p className="text-slate-500">
          Explore each condition to learn about symptoms and prevention, or jump straight into a quick AI-assisted risk check.
        </p>
      </div>

      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, e.g. 'heart'..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-sm"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      </div>

      {results.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((d) => (
            <DiseaseCard
              key={d.id}
              disease={d}
              onCheckNow={(id) => onNavigate('check-disease', { diseaseId: id })}
              onKnowMore={(id) => onNavigate('disease-details', { diseaseId: id })}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title={`No diseases match "${query}"`}
          subtitle="Try a different keyword, or browse all conditions we currently support."
          action={
            <button
              onClick={() => setQuery('')}
              className="px-4 py-2 text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
            >
              Clear Search
            </button>
          }
        />
      )}
    </div>
  );
}
