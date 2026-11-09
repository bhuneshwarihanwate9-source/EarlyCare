import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';

export default function DoctorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    patients: '28',
    flags: '4',
    reports: '112',
  });

  React.useEffect(() => {
    fetch('/api/doctor/dashboard')
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) {
          setStats({
            patients: String(res.data.total_assigned_patients ?? 28),
            flags: String(res.data.flagged_patients_count ?? 4),
            reports: String(res.data.reports_processed ?? 112),
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Clinician Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Dr. {user?.name || 'Clinician Workspace'}
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Monitor assigned high-risk patients, evaluate full lab diagnostic telemetry, and attach clinical notes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('doctor-assessment')}
          className="px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-sm rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          📄 New Clinical Assessment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="flex flex-wrap gap-4">
        <StatsCard title="Assigned Patients" value={stats.patients} subtitle="Active clinical tracking" icon="👥" />
        <StatsCard title="Flagged Risk Alerts" value={stats.flags} subtitle="Elevated Diabetes / BP" icon="🚨" />
        <StatsCard title="Reports Processed" value={stats.reports} subtitle="OCR & Lab Uploads" icon="📋" />
      </div>

      {/* Patient Screenings List Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Patient Telemetry Reviews</h3>
          <button
            onClick={() => onNavigate('doctor-assessment')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            + Add New Patient
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">HbA1c / BP</th>
                <th className="py-3 px-4">Primary Risk Flag</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Patient #1042</td>
                <td className="py-3 px-4">52 / Male</td>
                <td className="py-3 px-4">6.8% / 135/88</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    Diabetes (87.3%)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onNavigate('doctor-assessment')}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100"
                  >
                    Open Review
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Patient #1089</td>
                <td className="py-3 px-4">61 / Female</td>
                <td className="py-3 px-4">5.4% / 142/92</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    Hypertension (71.1%)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onNavigate('doctor-assessment')}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100"
                  >
                    Open Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
