import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth';

export default function Register({ onNavigate }) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [hospital, setHospital] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      role: selectedRole,
      name: fullName,
      email,
      password,
      ...(selectedRole === 'patient' && { phone }),
      ...(selectedRole === 'doctor' && { specialization, hospital }),
    };

    try {
      await registerUser(payload);
      // Dummy auth login automatically
      login({ name: fullName, email, role: selectedRole }, selectedRole);
      onNavigate(`${selectedRole}-dashboard`);
    } catch (err) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create EarlyCare AI Account</h2>
        <p className="text-sm text-slate-500 mt-1">Select your role to configure your personalized health dashboard</p>
      </div>

      {/* Step 1: Select Account Type */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
          Select Account Type
        </label>
        
        <div className="grid grid-cols-3 gap-3">
          <label
            onClick={() => setSelectedRole('patient')}
            className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
              selectedRole === 'patient'
                ? 'border-sky-600 bg-sky-50/80 text-sky-900 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <input
              type="radio"
              name="accountRole"
              value="patient"
              checked={selectedRole === 'patient'}
              onChange={() => setSelectedRole('patient')}
              className="sr-only"
            />
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-sm">Patient</span>
          </label>

          <label
            onClick={() => setSelectedRole('doctor')}
            className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
              selectedRole === 'doctor'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <input
              type="radio"
              name="accountRole"
              value="doctor"
              checked={selectedRole === 'doctor'}
              onChange={() => setSelectedRole('doctor')}
              className="sr-only"
            />
            <span className="text-2xl">👨‍⚕️</span>
            <span className="font-bold text-sm">Doctor</span>
          </label>

          <label
            onClick={() => setSelectedRole('admin')}
            className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <input
              type="radio"
              name="accountRole"
              value="admin"
              checked={selectedRole === 'admin'}
              onChange={() => setSelectedRole('admin')}
              className="sr-only"
            />
            <span className="text-2xl">⚙️</span>
            <span className="font-bold text-sm">Admin</span>
          </label>
        </div>
      </div>

      {/* Step 2: Role-Specific Dynamic Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
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
        {selectedRole === 'patient' && (
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
        {selectedRole === 'doctor' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all text-sm"
        >
          {loading ? 'Creating Profile...' : `Register as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
        </button>

        <p className="text-center text-xs text-slate-500 mt-3">
          Already registered?{' '}
          <button type="button" onClick={() => onNavigate('login')} className="text-sky-600 font-bold hover:underline">
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
