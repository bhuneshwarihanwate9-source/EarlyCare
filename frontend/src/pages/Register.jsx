import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth';

export default function Register({ onNavigate, roleParam = 'patient' }) {
  const { login } = useAuth();
  const [role, setRole] = useState(
    ['patient', 'doctor', 'admin'].includes(roleParam) ? roleParam : 'patient'
  );

  useEffect(() => {
    if (roleParam && ['patient', 'doctor', 'admin'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [roleParam]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [hospital, setHospital] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const roleMeta = {
    patient: {
      name: 'Patient',
      icon: '🩺',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      btnClass: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20',
      subtitle: 'Set up your personal health management profile',
    },
    doctor: {
      name: 'Doctor',
      icon: '👨‍⚕️',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
      subtitle: 'Register as an EarlyCare verified medical practitioner',
    },
    admin: {
      name: 'Admin',
      icon: '⚙️',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      btnClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20',
      subtitle: 'Platform security and administrative governance console',
    },
  }[role] || {
    name: 'Patient',
    icon: '🩺',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    btnClass: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20',
    subtitle: 'Set up your personal health management profile',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      role,
      name: fullName,
      email,
      password,
      ...(role === 'patient' && { phone }),
      ...(role === 'doctor' && { specialization, hospital }),
    };

    try {
      const res = await registerUser(payload);
      if (res.status === 'verification_required') {
        setSuccessMsg(
          res.message ||
            'Account created successfully! A confirmation link has been sent to your email. Please check your inbox or spam folder to confirm your email before signing in.'
        );
      } else {
        const userObj = res.user || { name: fullName, email, role };
        login(userObj, role, res.session);
        onNavigate(`${role}-dashboard`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Admin registration is strictly prohibited publicly
  if (role === 'admin') {
    return (
      <div className="max-w-md mx-auto my-8 sm:my-12 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-md text-center">
        <div className="w-14 h-14 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          ⚙️
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-xs font-bold text-purple-800 uppercase tracking-wider mb-3">
          Admin Provisioning
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Admin Registration Restricted
        </h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Platform administrator accounts cannot be registered publicly. Authorized administrators are provisioned through internal governance.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onNavigate('login', { role: 'admin' })}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all text-sm"
          >
            Sign In to Admin Portal →
          </button>
          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1.5 transition-colors mx-auto pt-2"
          >
            ← Choose a different account type
          </button>
        </div>
      </div>
    );
  }

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
          <span className={roleMeta.badgeClass + ' px-2 py-0.5 rounded-full'}>
            {roleMeta.name} Registration
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create {roleMeta.name} Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">{roleMeta.subtitle}</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm leading-relaxed font-medium">
          <p className="font-bold mb-1">✉️ Action Required</p>
          <p>{successMsg}</p>
          <button
            type="button"
            onClick={() => onNavigate('login', { role })}
            className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors inline-block"
          >
            Go to {roleMeta.name} Login →
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs leading-relaxed font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Role-Specific Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Sarah Jenkins'}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@example.com"
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

        {/* Patient Specific Fields */}
        {role === 'patient' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            />
          </div>
        )}

        {/* Doctor Specific Fields */}
        {role === 'doctor' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="General Internal Medicine">General Internal Medicine</option>
                <option value="Preventive Healthcare">Preventive Healthcare</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
              <input
                type="text"
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="St. Jude General Hospital"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 text-white font-bold rounded-xl shadow-md transition-all text-sm ${roleMeta.btnClass}`}
        >
          {loading ? 'Creating Profile...' : `Register as ${roleMeta.name}`}
        </button>

        <p className="text-center text-xs text-slate-500 mt-3">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login', { role })}
            className="text-sky-600 font-bold hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
