import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('earlycare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('earlycare_role');
    return saved || 'patient';
  });

  const login = (userData, userRole = 'patient') => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem('earlycare_user', JSON.stringify(userData));
    localStorage.setItem('earlycare_role', userRole);
  };

  const logout = () => {
    setUser(null);
    setRole('patient');
    localStorage.removeItem('earlycare_user');
    localStorage.removeItem('earlycare_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
