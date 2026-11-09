import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/auth';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('earlycare_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('earlycare_role');
    return saved || 'patient';
  });

  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('earlycare_session');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Listen to Supabase auth state changes if Supabase client is available
  useEffect(() => {
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          localStorage.setItem('earlycare_session', JSON.stringify(newSession));
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setRole('patient');
          localStorage.removeItem('earlycare_user');
          localStorage.removeItem('earlycare_role');
          localStorage.removeItem('earlycare_session');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = (userData, userRole = 'patient', sessionData = null) => {
    const effectiveRole = userRole || userData?.role || 'patient';
    setUser(userData);
    setRole(effectiveRole);
    localStorage.setItem('earlycare_user', JSON.stringify(userData));
    localStorage.setItem('earlycare_role', effectiveRole);

    if (sessionData) {
      setSession(sessionData);
      localStorage.setItem('earlycare_session', JSON.stringify(sessionData));
    }
  };

  const logout = async () => {
    setUser(null);
    setRole('patient');
    setSession(null);
    localStorage.removeItem('earlycare_user');
    localStorage.removeItem('earlycare_role');
    localStorage.removeItem('earlycare_session');
    try {
      await logoutUser();
    } catch {
      // Ignored on teardown
    }
  };

  const updateProfile = (updatedFields) => {
    // Strip role to prevent role alteration from client-side profile editing
    const { role: ignoredRole, ...safeFields } = updatedFields || {};
    setUser((prev) => {
      const merged = { ...prev, ...safeFields };
      localStorage.setItem('earlycare_user', JSON.stringify(merged));
      return merged;
    });
  };

  const refreshUser = async () => {
    const token = session?.access_token;
    if (!token) return;
    try {
      const res = await getCurrentUser(token);
      if (res?.status === 'success' && res.user) {
        setUser(res.user);
        setRole(res.user.role || role);
        localStorage.setItem('earlycare_user', JSON.stringify(res.user));
        localStorage.setItem('earlycare_role', res.user.role || role);
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        session,
        setRole,
        login,
        logout,
        updateProfile,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
