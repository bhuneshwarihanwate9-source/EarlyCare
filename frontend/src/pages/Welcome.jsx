import React from 'react';

export default function Welcome({ onNavigate }) {
  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      badge: 'Personal Health',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: '🩺',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      description: 'Take charge of your health telemetry, screen for chronic risks, and receive AI-guided lifestyle recommendations.',
      features: [
        'Personal health management',
        'Disease risk prediction',
        'Medical history & lab tracking',
        'AI health assistant guidance',
      ],
      buttonText: 'Continue as Patient →',
      buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
      accentBorder: 'hover:border-sky-500',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      badge: 'Clinical Suite',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: '👨‍⚕️',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      description: 'Review assigned patients, analyze multi-condition risk flags, evaluate clinical labs, and attach diagnostic notes.',
      features: [
        'Patient telemetry monitoring',
        'In-depth clinical health analysis',
        'ML disease prediction review',
        'Doctor profile & clinical notes',
      ],
      buttonText: 'Continue as Doctor →',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      accentBorder: 'hover:border-emerald-500',
    },
    {
      id: 'admin',
      title: 'Admin',
      badge: 'Operations & Security',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '⚙️',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'Oversee system security, monitor population health metrics, manage user role permissions, and maintain platform stability.',
      features: [
        'User management & RBAC',
        'Platform telemetry & uptime',
        'System monitoring & logs',
        'Administrative governance',
      ],
      buttonText: 'Continue as Admin →',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      accentBorder: 'hover:border-purple-500',
      notice: 'Authorized Admin Login Only',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 space-y-10">
      {/* Heading Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>EarlyCare AI Telemetry Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome to EarlyCare
        </h1>
        <p className="text-base text-slate-600">
          Select your account type to continue.
        </p>
      </div>

      {/* 3 Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm transition-all hover:shadow-lg flex flex-col justify-between ${r.accentBorder} group`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-sm ${r.iconBg}`}>
                  {r.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${r.badgeColor}`}>
                  {r.badge}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                {r.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {r.description}
              </p>

              {/* Feature Bullet Points */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Capabilities:
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  {r.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-7 pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('login', { role: r.id })}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${r.buttonClass}`}
              >
                {r.buttonText}
              </button>

              {r.notice ? (
                <p className="text-center text-[11px] font-semibold text-purple-700">
                  🔒 {r.notice}
                </p>
              ) : (
                <div className="text-center text-[11px] text-slate-500 flex justify-center gap-2">
                  <span>New to EarlyCare?</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('register', { role: r.id })}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    Register as {r.title}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Public Platform Explorer link */}
      <div className="text-center pt-4">
        <p className="text-xs text-slate-500">
          Want to explore diseases and educational tools first?{' '}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="font-bold text-sky-600 hover:underline"
          >
            Explore Public Platform →
          </button>
        </p>
      </div>
    </div>
  );
}
