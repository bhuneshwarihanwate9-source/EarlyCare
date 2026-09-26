/**
 * EarlyCare Frontend API Service
 * Handles HTTP client requests to Flask backend endpoints.
 */

const BASE_URL = '/api';

export async function fetchFormSchema() {
  const response = await fetch(`${BASE_URL}/form-schema`);
  if (!response.ok) throw new Error('Failed to load form schema');
  return response.json();
}

export async function submitPrediction(formData) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Prediction API request failed');
  return response.json();
}

export async function uploadMedicalReport(file) {
  const data = new FormData();
  data.append('file', file);
  const response = await fetch(`${BASE_URL}/patient/upload-report`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error('Report upload failed');
  return response.json();
}
