import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as authApi from '@/api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage on initial load
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }
      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
        setIsAuthenticated(true);
      } catch {
        // Token expired or invalid — clear everything
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
    setUser(result.user);
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
