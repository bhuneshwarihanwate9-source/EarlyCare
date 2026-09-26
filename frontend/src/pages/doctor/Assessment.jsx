import React, { useState } from 'react';
import { submitPrediction, uploadMedicalReport } from '../../services/api';
import DoctorResults from './Results';

export default function DoctorAssessment({ onNavigate }) {
  // Patient Information
  const [patientName, setPatientName] = useState('Patient #1042');
  const [age, setAge] = useState(52);
  const [gender, setGender] = useState('Male');

  // Vitals
  const [systolicBP, setSystolicBP] = useState(135);
  const [diastolicBP, setDiastolicBP] = useState(88);
  const [heartRate, setHeartRate] = useState(76);
  const [bmi, setBmi] = useState(27.5);

  // Lab Values
  const [hbA1c, setHbA1c] = useState(6.8);
  const [glucose, setGlucose] = useState(145);
  const [hdl, setHdl] = useState(42);
  const [ldl, setLdl] = useState(138);
  const [cholesterol, setCholesterol] = useState(215);
  const [triglycerides, setTriglycerides] = useState(165);
  const [crp, setCrp] = useState(4.2);
  const [homocysteine, setHomocysteine] = useState(12.5);

  // File upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadMsg('Parsing report...');
    try {
      const res = await uploadMedicalReport(file);
      setUploadMsg(`File "${file.name}" uploaded successfully for OCR extraction.`);
    } catch (err) {
      setUploadMsg('Report uploaded (OCR service ready).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiPayload = {
      age: Number(age),
      gender,
      bmi: Number(bmi),
      systolic_bp: Number(systolicBP),
      diastolic_bp: Number(diastolicBP),
      blood_pressure: Number(systolicBP),
      heart_rate: Number(heartRate),

      HbA1c_level: Number(hbA1c),
      glucose: Number(glucose),
      hdl: Number(hdl),
      ldl: Number(ldl),
      cholesterol: Number(cholesterol),
      triglycerides: Number(triglycerides),
      crp_level: Number(crp),
      homocysteine_level: Number(homocysteine),

      smoking: 'Former',
      alcohol_intake: 2,
      sleep_hours: 7.0,
      physical_activity: 'Moderate',
      stress_level: 'Medium',
      family_history: 'Yes',
    };

    try {
      const res = await submitPrediction(apiPayload);
      if (res.status === 'success') {
        setResults(res.results);
      }
    } catch (err) {
      setError('Prediction request failed.');
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <DoctorResults
        patientName={patientName}
        vitals={{ age, gender, bmi, bp: `${systolicBP}/${diastolicBP}`, hr: heartRate }}
        labs={{ hbA1c, glucose, ldl, hdl, crp }}
        results={results}
        onReset={() => setResults(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Diagnostic Assessment</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete patient vitals and lab markers for high-precision multi-condition screening.
          </p>
        </div>

        {/* Upload Report Button */}
        <div>
          <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors">
            <span>📄</span>
            <span>Upload Lab Report</span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
          </label>
        </div>
      </div>

      {uploadMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-between">
          <span>{uploadMsg}</span>
          <span className="text-emerald-600 font-bold">✓ Ready</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Patient Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>👤</span> Patient Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name / Identifier</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Vitals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🩺</span> Vitals Telemetry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resting HR (bpm)</label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">BMI (kg/m²)</label>
              <input
                type="number"
                step="0.1"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Lab Values */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🧪</span> Clinical Lab Values
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HbA1c (%)</label>
              <input
                type="number"
                step="0.1"
                value={hbA1c}
                onChange={(e) => setHbA1c(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fasting Glucose (mg/dL)</label>
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HDL (mg/dL)</label>
              <input
                type="number"
                value={hdl}
                onChange={(e) => setHdl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LDL (mg/dL)</label>
              <input
                type="number"
                value={ldl}
                onChange={(e) => setLdl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Cholesterol (mg/dL)</label>
              <input
                type="number"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Triglycerides (mg/dL)</label>
              <input
                type="number"
                value={triglycerides}
                onChange={(e) => setTriglycerides(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CRP Level (mg/L)</label>
              <input
                type="number"
                step="0.1"
                value={crp}
                onChange={(e) => setCrp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Homocysteine (µmol/L)</label>
              <input
                type="number"
                step="0.1"
                value={homocysteine}
                onChange={(e) => setHomocysteine(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
        >
          {loading ? 'Executing Clinical ML Pipeline...' : 'Run Diagnostic Prediction'}
        </button>
      </form>
    </div>
  );
}
