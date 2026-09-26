import React, { useState } from 'react';
import { submitPrediction } from '../../services/api';
import Results from './Results';

export default function PatientAssessment({ onNavigate }) {
  // 1. Personal Information
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Female');
  const [height, setHeight] = useState(168); // cm
  const [weight, setWeight] = useState(65); // kg

  // 2. Lifestyle
  const [smoking, setSmoking] = useState('Never');
  const [alcohol, setAlcohol] = useState(2);
  const [sleepHours, setSleepHours] = useState(7.0);
  const [exercise, setExercise] = useState('Moderate');
  const [stress, setStress] = useState('Medium');

  // 3. Family History
  const [familyDiabetes, setFamilyDiabetes] = useState(false);
  const [familyHeart, setFamilyHeart] = useState(false);
  const [familyHypertension, setFamilyHypertension] = useState(false);

  // 4. Symptoms
  const [symptoms, setSymptoms] = useState({
    thirst: false,
    urination: false,
    fatigue: false,
    chestPain: false,
    dizziness: false,
    headache: false,
    blurredVision: false,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate BMI dynamically
  const computedBmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

  const toggleSymptom = (key) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map patient responses into prediction API inputs while defaulting lab fields cleanly
    const hasFamilyHistory = familyDiabetes || familyHeart || familyHypertension;

    const apiPayload = {
      age: Number(age),
      gender,
      bmi: Number(computedBmi),
      smoking,
      alcohol_intake: Number(alcohol),
      sleep_hours: Number(sleepHours),
      physical_activity: exercise,
      stress_level: stress,
      family_history: hasFamilyHistory ? 'Yes' : 'No',
      
      // Clinical Defaults for Lab values (hidden from patient)
      HbA1c_level: symptoms.thirst || symptoms.urination ? 6.2 : 5.6,
      glucose: symptoms.thirst || symptoms.urination ? 125 : 100,
      systolic_bp: symptoms.dizziness || symptoms.headache ? 135 : 120,
      diastolic_bp: symptoms.dizziness || symptoms.headache ? 88 : 80,
      blood_pressure: 120,
      cholesterol: symptoms.chestPain ? 210 : 190,
      hdl: 55,
      ldl: symptoms.chestPain ? 135 : 110,
      triglycerides: 130,
      heart_rate: 72,
      crp_level: 3.0,
      homocysteine_level: 10.0,
    };

    try {
      const res = await submitPrediction(apiPayload);
      if (res.status === 'success') {
        setResults(res.results);
      }
    } catch (err) {
      setError('Failed to process prediction. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return <Results results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quick Health Risk Assessment</h1>
        <p className="text-sm text-slate-500 mt-1">
          Answer the questions below to evaluate your multi-disease risk. No lab reports required.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>👤</span> 1. Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
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
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
            <span className="font-medium text-slate-600">Calculated Body Mass Index (BMI):</span>
            <span className="font-extrabold text-sky-700 text-sm">{computedBmi} kg/m²</span>
          </div>
        </div>

        {/* Section 2: Lifestyle */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🏃</span> 2. Lifestyle Habits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Smoking Status</label>
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Never">Never</option>
                <option value="Former">Former</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alcohol Intake (Units/Week)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={alcohol}
                onChange={(e) => setAlcohol(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Average Sleep (Hours/Night)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="14"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Exercise Level</label>
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stress Level</label>
              <select
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Family History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🧬</span> 3. Family Medical History
          </h2>
          <p className="text-xs text-slate-500">Check if your immediate family members have a history of:</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 ${familyDiabetes ? 'bg-sky-50 border-sky-400 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <input
                type="checkbox"
                checked={familyDiabetes}
                onChange={(e) => setFamilyDiabetes(e.target.checked)}
                className="rounded text-sky-600"
              />
              <span>Diabetes</span>
            </label>

            <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 ${familyHeart ? 'bg-sky-50 border-sky-400 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <input
                type="checkbox"
                checked={familyHeart}
                onChange={(e) => setFamilyHeart(e.target.checked)}
                className="rounded text-sky-600"
              />
              <span>Heart Disease</span>
            </label>

            <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 ${familyHypertension ? 'bg-sky-50 border-sky-400 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <input
                type="checkbox"
                checked={familyHypertension}
                onChange={(e) => setFamilyHypertension(e.target.checked)}
                className="rounded text-sky-600"
              />
              <span>Hypertension</span>
            </label>
          </div>
        </div>

        {/* Section 4: Symptoms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>⚡</span> 4. Current Symptoms
          </h2>
          <p className="text-xs text-slate-500">Select any symptoms you have experienced recently:</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'thirst', label: 'Frequent Thirst' },
              { key: 'urination', label: 'Frequent Urination' },
              { key: 'fatigue', label: 'Fatigue' },
              { key: 'chestPain', label: 'Chest Pain' },
              { key: 'dizziness', label: 'Dizziness' },
              { key: 'headache', label: 'Headache' },
              { key: 'blurredVision', label: 'Blurred Vision' },
            ].map((sym) => (
              <label
                key={sym.key}
                className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 transition-colors ${
                  symptoms[sym.key]
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={symptoms[sym.key]}
                  onChange={() => toggleSymptom(sym.key)}
                  className="rounded text-amber-600"
                />
                <span>{sym.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-sky-600/25 transition-all"
        >
          {loading ? 'Evaluating ML Risk Models...' : 'Predict Risk'}
        </button>
      </form>
    </div>
  );
}
