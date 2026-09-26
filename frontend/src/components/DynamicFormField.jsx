import React from 'react';

export default function DynamicFormField({ field, value, onChange }) {
  if (field.type === 'toggle') {
    const active = !!value;
    return (
      <label
        className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2.5 transition-colors ${
          active ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => onChange(field.id, e.target.checked)}
          className="rounded text-amber-600"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
        <select
          value={value ?? field.defaultValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // number (default)
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">{field.label}</label>
      <input
        type="number"
        min={field.min}
        max={field.max}
        placeholder={field.optional ? 'Optional' : undefined}
        value={value ?? ''}
        onChange={(e) => onChange(field.id, e.target.value)}
        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
      />
    </div>
  );
}
