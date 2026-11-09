import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth';

export default function Login({ onNavigate, roleParam = 'patient' }) {
  const { login } = useAuth();
  const validRole = ['patient', 'doctor', 'admin'].includes(roleParam) ? roleParam : 'patient';
  const [role, setRole] = useState(validRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Update role if roleParam changes
  React.useEffect(() => {
    if (roleParam && ['patient', 'doctor', 'admin'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [roleParam]);

  const roleMeta = {
    patient: {
      name: 'Patient',
      icon: '🩺',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      btnClass: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20',
      subtitle: 'Access your health telemetry and screening assessments',
    },
    doctor: {
      name: 'Doctor',
      icon: '👨‍⚕️',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
      subtitle: 'Access clinician suite, patient records, and diagnostic review',
    },
    admin: {
      name: 'Admin',
      icon: '⚙️',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      btnClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20',
      subtitle: 'Platform security and administrative governance console',
    },
  }[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await loginUser(email, password, role);
      const userObj = res.user || { email, name: email.split('@')[0], role };
      const targetRole = userObj.role || role;

      // Ensure verified role strictly matches the selected portal
      if (targetRole !== role) {
        throw new Error('You are not registered under this account type. Please select your registered role.');
      }

      login(userObj, targetRole, res.session);
      onNavigate(`${targetRole}-dashboard`);
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (err.errorCode === 'ROLE_MISMATCH' || msg.includes('not registered under this account type')) {
        setErrorMsg('You are not registered under this account type. Please select your registered role.');
      } else if (err.errorCode === 'EMAIL_NOT_CONFIRMED' || msg.toLowerCase().includes('email not confirmed')) {
        setInfoMsg('Email verification pending: Please check your inbox or spam folder for the confirmation link before signing in.');
      } else if (err.errorCode === 'INVALID_CREDENTIALS' || msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please double check your credentials.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-12 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-md">
      {/* Switch role back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Choose a different account type
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
          {roleMeta.icon}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2">
          <span className={roleMeta.badgeClass + ' px-2 py-0.5 rounded-full'}>{roleMeta.name} Portal</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In as {roleMeta.name}
        </h2>
        <p className="text-xs text-slate-500 mt-1">{roleMeta.subtitle}</p>
      </div>

      {infoMsg && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs leading-relaxed font-medium">
          {infoMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs leading-relaxed font-semibold">
          {errorMsg}
        </div>
      )}

      {role === 'admin' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-medium flex items-center gap-2">
          <span>🔒</span>
          <span>Authorized administrator access only. Public registration is disabled.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${role}@earlycare.org`}
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
          className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2 ${roleMeta.btnClass}`}
        >
          {loading ? 'Authenticating...' : `Sign In to ${roleMeta.name} Dashboard`}
        </button>

        {role !== 'admin' ? (
          <p className="text-center text-xs text-slate-500 mt-4">
            Need a {role} account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register', { role })}
              className="text-sky-600 font-bold hover:underline"
            >
              Register here
            </button>
          </p>
        ) : (
          <p className="text-center text-xs text-slate-400 mt-4">
            Standard user?{' '}
            <button
              type="button"
              onClick={() => onNavigate('welcome')}
              className="text-purple-600 font-bold hover:underline"
            >
              Select Patient or Doctor
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
