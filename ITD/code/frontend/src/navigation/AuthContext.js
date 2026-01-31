import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, clearSession } from '../storage';

export const AuthContext = createContext(null);

/**
 * Authentication state provider.
 * Reads token and user from storage on mount; exposes logout (clearSession) to sign out.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredAuth = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        getToken(),
        getUser(),
      ]);
      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser ?? null);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading auth:', err);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const logout = useCallback(async () => {
    try {
      await clearSession();
    } catch (err) {
      console.error('Error on logout:', err);
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    token,
    setToken,
    isAuthenticated: !!token,
    isLoading,
    logout,
    refreshAuth: loadStoredAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
