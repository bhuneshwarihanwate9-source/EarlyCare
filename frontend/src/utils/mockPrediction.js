/**
 * EarlyCare — Mock Prediction Engine
 * ------------------------------------------------
 * ⚠️ THIS IS NOT A REAL ML MODEL.
 * It's a transparent, rule-based heuristic that produces a plausible-looking
 * risk score from form answers so the UI/UX can be fully built and tested
 * before the real trained model / backend is wired in.
 *
 * Swap point for the future: replace `runAllRiskScores()` with a call to
 * the real prediction API (see services/mockPredictionService.js), keeping
 * the same return shape: { diabetes, hypertension, heart_disease } each
 * as { score, factors[] }.
 */

const clamp = (n, min = 0, max = 97) => Math.max(min, Math.min(max, n));

export const calcBmi = (heightCm, weightKg) => {
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!h || !w) return null;
  return +(w / (h * h)).toFixed(1);
};

function scoreDiabetes(v) {
  const factors = [];
  let score = 6;
  const bmi = calcBmi(v.height_cm, v.weight_kg);

  if (bmi !== null) {
    if (bmi >= 30) {
      score += 20;
      factors.push({ label: 'BMI in the obesity range', points: 20 });
    } else if (bmi >= 25) {
      score += 11;
      factors.push({ label: 'BMI in the overweight range', points: 11 });
    }
  }
  if (Number(v.age) >= 45) {
    score += 10;
    factors.push({ label: 'Age 45 or older', points: 10 });
  }
  if (v.family_history_diabetes) {
    score += 15;
    factors.push({ label: 'Family history of diabetes', points: 15 });
  }
  if (v.physical_activity === 'Low') {
    score += 8;
    factors.push({ label: 'Low physical activity', points: 8 });
  }
  if (v.frequent_thirst) {
    score += 12;
    factors.push({ label: 'Reported frequent thirst', points: 12 });
  }
  if (v.frequent_urination) {
    score += 12;
    factors.push({ label: 'Reported frequent urination', points: 12 });
  }
  if (v.fatigue) {
    score += 6;
    factors.push({ label: 'Reported persistent fatigue', points: 6 });
  }
  if (v.blurred_vision) {
    score += 7;
    factors.push({ label: 'Reported blurred vision', points: 7 });
  }
  if (v.slow_healing) {
    score += 8;
    factors.push({ label: 'Reported slow-healing wounds', points: 8 });
  }
  if (v.fasting_glucose) {
    const g = Number(v.fasting_glucose);
    if (g >= 126) {
      score += 26;
      factors.push({ label: 'Fasting glucose ≥126 mg/dL (diabetic range)', points: 26 });
    } else if (g >= 100) {
      score += 13;
      factors.push({ label: 'Fasting glucose 100–125 mg/dL (prediabetic range)', points: 13 });
    }
  }
  return { score: clamp(score), factors };
}

function scoreHypertension(v) {
  const factors = [];
  let score = 6;
  const bmi = calcBmi(v.height_cm, v.weight_kg);

  if (bmi !== null && bmi >= 30) {
    score += 12;
    factors.push({ label: 'BMI in the obesity range', points: 12 });
  }
  if (Number(v.age) >= 40) {
    score += 10;
    factors.push({ label: 'Age 40 or older', points: 10 });
  }
  if (v.family_history_hypertension) {
    score += 14;
    factors.push({ label: 'Family history of hypertension', points: 14 });
  }
  if (v.salt_intake === 'High') {
    score += 12;
    factors.push({ label: 'High dietary salt intake', points: 12 });
  }
  if (v.stress_level === 'High') {
    score += 10;
    factors.push({ label: 'High chronic stress level', points: 10 });
  }
  if (v.smoking === 'Current') {
    score += 10;
    factors.push({ label: 'Current smoker', points: 10 });
  }
  if (v.headache) {
    score += 9;
    factors.push({ label: 'Reported frequent headaches', points: 9 });
  }
  if (v.dizziness) {
    score += 8;
    factors.push({ label: 'Reported dizziness', points: 8 });
  }
  if (v.blurred_vision) {
    score += 6;
    factors.push({ label: 'Reported blurred vision', points: 6 });
  }
  if (v.nosebleeds) {
    score += 6;
    factors.push({ label: 'Reported occasional nosebleeds', points: 6 });
  }
  if (v.known_systolic && v.known_diastolic) {
    const sys = Number(v.known_systolic);
    const dia = Number(v.known_diastolic);
    if (sys >= 140 || dia >= 90) {
      score += 25;
      factors.push({ label: `Known reading ${sys}/${dia} mmHg (stage 2 range)`, points: 25 });
    } else if (sys >= 130 || dia >= 80) {
      score += 14;
      factors.push({ label: `Known reading ${sys}/${dia} mmHg (elevated range)`, points: 14 });
    }
  }
  return { score: clamp(score), factors };
}

function scoreHeartDisease(v) {
  const factors = [];
  let score = 6;
  const bmi = calcBmi(v.height_cm, v.weight_kg);

  if (bmi !== null && bmi >= 30) {
    score += 10;
    factors.push({ label: 'BMI in the obesity range', points: 10 });
  }
  const ageThreshold = v.gender === 'Female' ? 55 : 45;
  if (Number(v.age) >= ageThreshold) {
    score += 10;
    factors.push({ label: `Age above typical risk threshold (${ageThreshold}+)`, points: 10 });
  }
  if (v.family_history_heart) {
    score += 15;
    factors.push({ label: 'Family history of heart disease', points: 15 });
  }
  if (v.smoking === 'Current') {
    score += 14;
    factors.push({ label: 'Current smoker', points: 14 });
  } else if (v.smoking === 'Former') {
    score += 6;
    factors.push({ label: 'Former smoker', points: 6 });
  }
  if (v.physical_activity === 'Low') {
    score += 8;
    factors.push({ label: 'Low physical activity', points: 8 });
  }
  if (v.chest_pain) {
    score += 20;
    factors.push({ label: 'Reported chest pain or tightness', points: 20 });
  }
  if (v.shortness_of_breath) {
    score += 12;
    factors.push({ label: 'Reported shortness of breath', points: 12 });
  }
  if (v.palpitations) {
    score += 10;
    factors.push({ label: 'Reported palpitations', points: 10 });
  }
  if (v.leg_swelling) {
    score += 8;
    factors.push({ label: 'Reported swelling in legs/ankles', points: 8 });
  }
  if (v.cholesterol_known) {
    const c = Number(v.cholesterol_known);
    if (c >= 240) {
      score += 18;
      factors.push({ label: `Cholesterol ${c} mg/dL (high range)`, points: 18 });
    } else if (c >= 200) {
      score += 9;
      factors.push({ label: `Cholesterol ${c} mg/dL (borderline range)`, points: 9 });
    }
  }
  if (v.resting_heart_rate) {
    const hr = Number(v.resting_heart_rate);
    if (hr >= 100) {
      score += 8;
      factors.push({ label: `Elevated resting heart rate (${hr} bpm)`, points: 8 });
    }
  }
  return { score: clamp(score), factors };
}

/** Runs the heuristic across all three known conditions from whatever fields are present. */
export function runAllRiskScores(values) {
  return {
    diabetes: scoreDiabetes(values),
    hypertension: scoreHypertension(values),
    heart_disease: scoreHeartDisease(values),
  };
}

export function riskLevelFromScore(score) {
  if (score >= 65) return 'High';
  if (score >= 35) return 'Moderate';
  return 'Low';
}

/**
 * Returns ONLY the single highest-probability disease, per product requirement:
 * "Show ONLY the single disease with the highest prediction probability."
 * All three conditions are scored under the hood (multi-condition awareness),
 * but the UI surfaces just the top one.
 */
export function getTopPrediction(values) {
  const all = runAllRiskScores(values);
  const entries = Object.entries(all).map(([diseaseId, result]) => ({ diseaseId, ...result }));
  entries.sort((a, b) => b.score - a.score);
  const top = entries[0];
  const topFactors = [...top.factors].sort((a, b) => b.points - a.points).slice(0, 4);

  return {
    diseaseId: top.diseaseId,
    confidence: Math.round(top.score),
    riskLevel: riskLevelFromScore(top.score),
    factors: topFactors,
  };
}
