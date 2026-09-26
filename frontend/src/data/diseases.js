/**
 * EarlyCare — Disease Knowledge Base (MOCK DATA)
 * ------------------------------------------------
 * This file is the single source of truth for every disease-related page
 * (Diseases listing, Disease Details, Check Disease dynamic forms).
 *
 * ⚠️ FRONTEND-ONLY: Nothing here is wired to a database or ML model yet.
 * When the real backend/model is ready, this file can stay as-is for
 * copy/labels, while `services/mockPredictionService.js` gets swapped for
 * a real API call — the UI components don't need to change.
 */

export const DISEASES = [
  {
    id: 'diabetes',
    name: 'Diabetes',
    tagline: 'Type 2 Diabetes',
    icon: '🩸',
    accent: 'sky',
    shortDescription:
      'A chronic condition affecting how your body turns food into energy, marked by elevated blood glucose levels.',
    prevalence: {
      stat: '1 in 9',
      label: 'adults worldwide are estimated to be living with diabetes',
      trend: 'Rising steadily, especially in urban populations',
    },
    overview:
      'Diabetes occurs when the body cannot properly produce or use insulin, causing glucose to build up in the bloodstream instead of being used for energy. Left unmanaged, it can gradually damage the eyes, kidneys, nerves, and heart. Type 2 diabetes — the most common form — develops slowly and is closely linked to weight, activity levels, and family history, which is why early risk screening matters so much.',
    symptoms: [
      'Frequent thirst and dry mouth',
      'Frequent urination, especially at night',
      'Unexplained fatigue',
      'Blurred vision',
      'Slow-healing cuts or wounds',
      'Unintended weight loss',
      'Tingling or numbness in hands or feet',
    ],
    riskFactors: [
      'Body Mass Index (BMI) of 25 or higher',
      'Age 45 years or older',
      'Family history of diabetes',
      'Low physical activity levels',
      'High blood pressure or abnormal cholesterol',
      'History of gestational diabetes',
    ],
    prevention: [
      'Maintain a healthy weight through balanced nutrition',
      'Aim for at least 150 minutes of moderate exercise per week',
      'Limit refined sugar and processed carbohydrates',
      'Get blood glucose checked annually after age 45',
      'Prioritize consistent sleep of 7–9 hours',
      'Stay hydrated and reduce sugary beverage intake',
    ],
    whenToConsult: [
      'You experience persistent thirst, urination, or fatigue',
      'A fasting glucose reading comes back at 100 mg/dL or higher',
      'You have a family history and are over 45 with extra weight',
      'Cuts or infections are healing unusually slowly',
    ],
    formFields: [
      { id: 'age', label: 'Age (years)', type: 'number', min: 1, max: 120, defaultValue: 35 },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'], defaultValue: 'Female' },
      { id: 'height_cm', label: 'Height (cm)', type: 'number', min: 100, max: 230, defaultValue: 165 },
      { id: 'weight_kg', label: 'Weight (kg)', type: 'number', min: 25, max: 250, defaultValue: 65 },
      { id: 'physical_activity', label: 'Physical Activity Level', type: 'select', options: ['Low', 'Moderate', 'High'], defaultValue: 'Moderate' },
      { id: 'family_history_diabetes', label: 'Family history of diabetes', type: 'toggle', group: 'History', defaultValue: false },
      { id: 'frequent_thirst', label: 'Frequent thirst', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'frequent_urination', label: 'Frequent urination', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'fatigue', label: 'Persistent fatigue', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'blurred_vision', label: 'Blurred vision', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'slow_healing', label: 'Slow-healing wounds', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'fasting_glucose', label: 'Fasting glucose (mg/dL) — optional', type: 'number', min: 50, max: 400, optional: true },
    ],
  },
  {
    id: 'hypertension',
    name: 'Hypertension',
    tagline: 'High Blood Pressure',
    icon: '💓',
    accent: 'rose',
    shortDescription:
      'Often called the "silent killer," hypertension is sustained high pressure in the arteries that usually shows no obvious symptoms.',
    prevalence: {
      stat: '1 in 3',
      label: 'adults globally live with elevated blood pressure',
      trend: 'A leading contributor to heart attack and stroke risk',
    },
    overview:
      'Hypertension develops when the force of blood against artery walls stays too high over time. Because it rarely causes noticeable symptoms until it is advanced, it is frequently under-diagnosed. Chronic high blood pressure strains the heart and blood vessels, raising the risk of heart attack, stroke, and kidney damage — making early awareness and lifestyle adjustments especially valuable.',
    symptoms: [
      'Headaches, especially in the morning',
      'Dizziness or lightheadedness',
      'Blurred or disturbed vision',
      'Occasional nosebleeds',
      'Shortness of breath on exertion',
      'Chest discomfort in severe cases',
      'Often no symptoms at all',
    ],
    riskFactors: [
      'High salt intake',
      'Chronic stress',
      'Smoking or heavy alcohol use',
      'Family history of hypertension',
      'Obesity or sedentary lifestyle',
      'Age 40 years or older',
    ],
    prevention: [
      'Reduce dietary sodium and processed foods',
      'Practice stress-reduction techniques like meditation',
      'Exercise regularly to support healthy circulation',
      'Limit alcohol and avoid tobacco products',
      'Monitor blood pressure at home periodically',
      'Maintain a diet rich in potassium (fruits, vegetables)',
    ],
    whenToConsult: [
      'A home reading shows 140/90 mmHg or higher on repeated checks',
      'You experience recurring headaches with dizziness',
      'You have a family history and have not checked BP in over a year',
      'You notice sudden vision changes or chest discomfort',
    ],
    formFields: [
      { id: 'age', label: 'Age (years)', type: 'number', min: 1, max: 120, defaultValue: 40 },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'], defaultValue: 'Female' },
      { id: 'height_cm', label: 'Height (cm)', type: 'number', min: 100, max: 230, defaultValue: 165 },
      { id: 'weight_kg', label: 'Weight (kg)', type: 'number', min: 25, max: 250, defaultValue: 70 },
      { id: 'salt_intake', label: 'Salt Intake', type: 'select', options: ['Low', 'Moderate', 'High'], defaultValue: 'Moderate' },
      { id: 'stress_level', label: 'Stress Level', type: 'select', options: ['Low', 'Medium', 'High'], defaultValue: 'Medium' },
      { id: 'smoking', label: 'Smoking Status', type: 'select', options: ['Never', 'Former', 'Current'], defaultValue: 'Never' },
      { id: 'family_history_hypertension', label: 'Family history of hypertension', type: 'toggle', group: 'History', defaultValue: false },
      { id: 'headache', label: 'Frequent headaches', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'dizziness', label: 'Dizziness / lightheadedness', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'blurred_vision', label: 'Blurred vision', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'nosebleeds', label: 'Occasional nosebleeds', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'known_systolic', label: 'Known Systolic BP (mmHg) — optional', type: 'number', min: 80, max: 220, optional: true },
      { id: 'known_diastolic', label: 'Known Diastolic BP (mmHg) — optional', type: 'number', min: 50, max: 140, optional: true },
    ],
  },
  {
    id: 'heart_disease',
    name: 'Heart Disease',
    tagline: 'Cardiovascular Disease',
    icon: '❤️‍🩹',
    accent: 'amber',
    shortDescription:
      'A broad term for conditions that affect heart function, including narrowed arteries, irregular rhythm, and reduced pumping capacity.',
    prevalence: {
      stat: '~1 in 5',
      label: 'deaths worldwide are linked to cardiovascular disease',
      trend: 'The leading cause of death globally',
    },
    overview:
      'Heart disease covers a range of conditions — most commonly coronary artery disease, where fatty deposits narrow the arteries supplying the heart. Risk builds up silently over years through a combination of lifestyle, metabolic, and genetic factors. Recognizing early warning signs and modifiable risk factors is one of the most effective ways to reduce long-term cardiac risk.',
    symptoms: [
      'Chest pain, tightness, or pressure',
      'Shortness of breath',
      'Palpitations or irregular heartbeat',
      'Swelling in the legs, ankles, or feet',
      'Fatigue with everyday activity',
      'Pain radiating to the arm, jaw, or back',
    ],
    riskFactors: [
      'Smoking or tobacco use',
      'High cholesterol',
      'Sedentary lifestyle',
      'Family history of heart disease',
      'Diabetes or hypertension',
      'Age 45+ (men) or 55+ (women)',
    ],
    prevention: [
      'Eat a heart-healthy diet low in saturated fat',
      'Engage in regular aerobic exercise',
      'Quit smoking and limit alcohol',
      'Manage cholesterol and blood pressure proactively',
      'Maintain a healthy weight',
      'Manage stress and prioritize quality sleep',
    ],
    whenToConsult: [
      'You experience chest pain, pressure, or tightness',
      'You have unexplained shortness of breath with mild activity',
      'You notice palpitations along with dizziness or fatigue',
      'You have diabetes or hypertension and haven\u2019t had a cardiac check-up recently',
    ],
    formFields: [
      { id: 'age', label: 'Age (years)', type: 'number', min: 1, max: 120, defaultValue: 45 },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'], defaultValue: 'Male' },
      { id: 'height_cm', label: 'Height (cm)', type: 'number', min: 100, max: 230, defaultValue: 170 },
      { id: 'weight_kg', label: 'Weight (kg)', type: 'number', min: 25, max: 250, defaultValue: 75 },
      { id: 'smoking', label: 'Smoking Status', type: 'select', options: ['Never', 'Former', 'Current'], defaultValue: 'Never' },
      { id: 'physical_activity', label: 'Physical Activity Level', type: 'select', options: ['Low', 'Moderate', 'High'], defaultValue: 'Moderate' },
      { id: 'family_history_heart', label: 'Family history of heart disease', type: 'toggle', group: 'History', defaultValue: false },
      { id: 'chest_pain', label: 'Chest pain or tightness', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'shortness_of_breath', label: 'Shortness of breath', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'palpitations', label: 'Palpitations / irregular heartbeat', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'leg_swelling', label: 'Swelling in legs or ankles', type: 'toggle', group: 'Symptoms', defaultValue: false },
      { id: 'cholesterol_known', label: 'Known Cholesterol (mg/dL) — optional', type: 'number', min: 100, max: 400, optional: true },
      { id: 'resting_heart_rate', label: 'Resting Heart Rate (bpm) — optional', type: 'number', min: 40, max: 160, optional: true },
    ],
  },
];

export const getDiseaseById = (id) => DISEASES.find((d) => d.id === id) || null;

export const searchDiseases = (query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return DISEASES;
  return DISEASES.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.shortDescription.toLowerCase().includes(q)
  );
};
