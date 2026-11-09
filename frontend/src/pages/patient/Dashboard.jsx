import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import Charts from '../../components/Charts';

export default function PatientDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [trends, setTrends] = React.useState({
    diabetes: 'Low Risk',
    heart: 'Moderate',
    hypertension: 'Low Risk',
  });

  React.useEffect(() => {
    const patientRef = user?.patient_id || user?.id;
    if (patientRef) {
      fetch(`/api/patient/dashboard?patient_id=${patientRef}`)
        .then((r) => r.json())
        .then((res) => {
          if (res?.data?.risk_trends) {
            const t = res.data.risk_trends;
            setTrends({
              diabetes: `${(t.diabetes || 'low').charAt(0).toUpperCase() + (t.diabetes || 'low').slice(1)} Risk`,
              heart: `${(t.heart_disease || 'moderate').charAt(0).toUpperCase() + (t.heart_disease || 'moderate').slice(1)}`,
              hypertension: `${(t.hypertension || 'low').charAt(0).toUpperCase() + (t.hypertension || 'low').slice(1)} Risk`,
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-sky-500/30 text-sky-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Welcome, {user?.name || 'Patient'}
          </h1>
          <p className="text-sky-100 text-sm mt-1 max-w-xl">
            Monitor your personal disease risk indicators and take a quick non-invasive screening assessment.
          </p>
        </div>

        <button
          onClick={() => onNavigate('patient-assessment')}
          className="px-6 py-3 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-sm rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          ⚡ Start Quick Assessment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4">
        <StatsCard title="Diabetes Risk" value={trends.diabetes} subtitle="HbA1c & Glucose Telemetry" icon="🩸" />
        <StatsCard title="Heart Disease Risk" value={trends.heart} subtitle="Cardiovascular Telemetry" icon="🫀" />
        <StatsCard title="Hypertension Risk" value={trends.hypertension} subtitle="Blood Pressure Telemetry" icon="❤️" />
      </div>

      {/* Charts & Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Charts title="Your Multi-Disease Telemetry Score" />

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Preventive Health Insights</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              EarlyCare AI evaluates subtle signals across vitals and lifestyle patterns to catch early warning signs of chronic conditions before severe symptoms manifest.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Need a comprehensive lab review?</span>
            <button
              onClick={() => onNavigate('patient-assessment')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              Update Telemetry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
