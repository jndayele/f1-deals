import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as authApi from '@/api/authApi';

const AuthContext = createContext();

// Decode a JWT payload without verifying signature (client-side display only)
function parseJwtPayload(token) {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore admin profile from localStorage on initial load
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, verify the stored token is still valid by hitting a protected endpoint
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Quick expiry check from the JWT payload (no signature verification)
      const payload = parseJwtPayload(token);
      if (payload?.exp && Date.now() / 1000 > payload.exp) {
        // Token already expired locally — clear and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Validate with the server — me() hits a protected endpoint
        await authApi.me();
        setIsAuthenticated(true);
      } catch {
        // Token rejected by backend (expired/invalid)
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    // Backend returns { token, expiresIn } — no user object
    // Store the admin email so we can display it in the Settings page
    const adminProfile = { email };
    localStorage.setItem('auth_user', JSON.stringify(adminProfile));
    setUser(adminProfile);
    setIsAuthenticated(true);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
