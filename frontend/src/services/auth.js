/**
 * EarlyCare Frontend Authentication Service
 * Interface ready for JWT authentication & role authorization.
 */

const BASE_URL = '/api/auth';

export async function loginUser(email, password, role = 'patient') {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/logout`, { method: 'POST' });
  return response.json();
}
