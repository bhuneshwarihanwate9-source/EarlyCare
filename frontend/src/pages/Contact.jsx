import React, { useState } from 'react';
import LoadingState from '../components/LoadingState';

const CONTACT_INFO = [
  { icon: '✉️', label: 'Email', value: 'support@earlycare.ai' },
  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
  { icon: '📍', label: 'Address', value: 'EarlyCare AI HQ, Bengaluru, Karnataka, India' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.message.trim()) errs.message = 'Please enter a message.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    setTimeout(() => setStatus('success'), 900);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Questions, partnership ideas, or issues with the platform? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-4">
          {CONTACT_INFO.map((c) => (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{c.label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          {status === 'success' ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mb-3">
                ✅
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-1">Message Sent</h2>
              <p className="text-sm text-slate-500 mb-4">We'll get back to you as soon as possible.</p>
              <button
                onClick={() => {
                  setForm({ name: '', email: '', subject: '', message: '' });
                  setStatus('idle');
                }}
                className="px-4 py-2 text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${errors.name ? 'border-rose-400' : 'border-slate-300'}`}
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
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject (optional)</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={5}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm resize-none ${errors.message ? 'border-rose-400' : 'border-slate-300'}`}
                />
                {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-sky-600/25 transition-all"
              >
                {status === 'submitting' ? <LoadingState variant="inline" title="Sending..." /> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
