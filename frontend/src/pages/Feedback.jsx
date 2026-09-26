import React, { useState } from 'react';
import StarRating from '../components/StarRating';
import LoadingState from '../components/LoadingState';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', message: '', rating: 0 });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.message.trim()) errs.message = 'Please share a few words of feedback.';
    if (form.rating === 0) errs.rating = 'Please select a star rating.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    // Mock submission — no backend yet.
    setTimeout(() => {
      setStatus('success');
    }, 900);
  };

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mb-4">
          🎉
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Thank you for your feedback!</h1>
        <p className="text-slate-500 mb-6">Your input helps us improve EarlyCare for everyone.</p>
        <button
          onClick={() => {
            setForm({ name: '', email: '', message: '', rating: 0 });
            setStatus('idle');
          }}
          className="px-5 py-2.5 text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">We'd Love Your Feedback</h1>
        <p className="text-slate-500 text-sm sm:text-base">Help us improve EarlyCare's risk checks and experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${errors.name ? 'border-rose-400' : 'border-slate-300'}`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${errors.email ? 'border-rose-400' : 'border-slate-300'}`}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback Message</label>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            rows={4}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm resize-none ${errors.message ? 'border-rose-400' : 'border-slate-300'}`}
            placeholder="Tell us what you think..."
          />
          {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Rating</label>
          <StarRating value={form.rating} onChange={(n) => update('rating', n)} />
          {errors.rating && <p className="text-xs text-rose-600 mt-1">{errors.rating}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all"
        >
          {status === 'submitting' ? <LoadingState variant="inline" title="Submitting..." /> : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
