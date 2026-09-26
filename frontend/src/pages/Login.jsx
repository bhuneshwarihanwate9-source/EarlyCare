import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password, role);
      login({ email, name: email.split('@')[0] }, role);
      onNavigate(`${role}-dashboard`);
    } catch (err) {
      alert('Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-md">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-3 border border-sky-200">
          🔓
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Login to EarlyCare AI</h2>
        <p className="text-xs text-slate-500 mt-1">Access your risk assessment telemetry and diagnostic suite</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                role === 'patient'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                role === 'doctor'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                role === 'admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@earlycare.org"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all text-sm mt-2"
        >
          {loading ? 'Authenticating...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        </button>

        <p className="text-center text-xs text-slate-500 mt-4">
          Need an account?{' '}
          <button type="button" onClick={() => onNavigate('register')} className="text-sky-600 font-bold hover:underline">
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}
