/**
 * EarlyCare — Mock Prediction Service
 * ------------------------------------------------
 * ⚠️ FRONTEND-ONLY MOCK. Simulates the shape and latency of a real API call.
 *
 * FUTURE INTEGRATION NOTE:
 * When the trained model / backend is ready, replace the body of
 * `requestPrediction()` with a real call, e.g.:
 *
 *   import { submitPrediction } from './api';
 *   export async function requestPrediction(diseaseId, formValues) {
 *     const res = await submitPrediction({ diseaseId, ...formValues });
 *     return res.topPrediction; // shape: { diseaseId, confidence, riskLevel, factors }
 *   }
 *
 * No page or component needs to change — they only depend on this function's
 * return shape and the fact that it returns a Promise.
 */

import { getTopPrediction } from '../utils/mockPrediction';

const SIMULATED_LATENCY_MS = 1100;

export function requestPrediction(diseaseId, formValues) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = getTopPrediction({ ...formValues, checkedDiseaseId: diseaseId });
        resolve(result);
      } catch (err) {
        reject(new Error('Unable to generate a prediction from the provided data.'));
      }
    }, SIMULATED_LATENCY_MS);
  });
}
