/**
 * EarlyCare Frontend Authentication Service
 * Communicates with backend authentication endpoints and Supabase Auth.
 */
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetUserPassword,
  isSupabaseConfigured,
} from '../lib/supabase';

const BASE_URL = '/api/auth';

/**
 * Helper to get active auth token from localStorage
 */
function getStoredToken() {
  const session = localStorage.getItem('earlycare_session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return parsed.access_token || '';
    } catch {
      return '';
    }
  }
  return '';
}

export async function loginUser(email, password, role = 'patient') {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.message || 'Login failed');
      err.errorCode = data.error_code;
      throw err;
    }
    return data;
  } catch (backendErr) {
    // If backend returned a specific error (like EMAIL_NOT_CONFIRMED), rethrow it
    if (backendErr.errorCode || backendErr.message.includes('email') || backendErr.message.includes('credentials')) {
      throw backendErr;
    }

    // Direct Supabase fallback if backend server is offline
    if (isSupabaseConfigured) {
      try {
        const directData = await signInWithEmail(email, password);
        const userRole = directData.user.user_metadata?.role || 'patient';
        if (role && userRole !== role) {
          const mismatchErr = new Error('You are not registered under this account type. Please select your registered role.');
          mismatchErr.errorCode = 'ROLE_MISMATCH';
          throw mismatchErr;
        }
        return {
          status: 'success',
          user: {
            id: directData.user.id,
            email: directData.user.email,
            name: directData.user.user_metadata?.full_name || email.split('@')[0],
            role: userRole,
          },
          session: directData.session,
          token: directData.session?.access_token,
        };
      } catch (sbErr) {
        throw new Error(sbErr.message || 'Login failed');
      }
    }
    throw backendErr;
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (backendErr) {
    // Direct Supabase fallback
    if (isSupabaseConfigured && !backendErr.message.includes('already exists')) {
      if (userData.role === 'admin') {
        throw new Error('Admin registration is restricted. Authorized administrators must be provisioned directly.');
      }
      try {
        const directData = await signUpWithEmail(
          userData.email,
          userData.password,
          {
            full_name: userData.name,
            role: userData.role,
            phone: userData.phone,
            specialization: userData.specialization,
            hospital: userData.hospital,
          }
        );
        return {
          status: directData.session ? 'success' : 'verification_required',
          message: directData.session
            ? 'Registration successful!'
            : 'Registration received! Please check your email for confirmation.',
          user: {
            id: directData.user?.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          },
          session: directData.session,
        };
      } catch (sbErr) {
        throw new Error(sbErr.message || 'Registration failed');
      }
    }
    throw backendErr;
  }
}

export async function getCurrentUser(token) {
  const authToken = token || getStoredToken();
  if (!authToken) return null;

  const response = await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function updateUserProfile(profileData, token) {
  const authToken = token || getStoredToken();
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Profile update failed');
  return data;
}

export async function logoutUser() {
  try {
    await fetch(`${BASE_URL}/logout`, { method: 'POST' });
  } catch {
    // Silent fail on network
  }
  await signOutUser();
  return { status: 'success' };
}

export async function requestPasswordReset(email) {
  return resetUserPassword(email);
}
