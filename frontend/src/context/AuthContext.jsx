import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('elan_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser({ username: 'Invité' });
      setLoading(false);
      return;
    }
    api.me(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem('elan_token');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (identifier, password) => {
    const data = await api.login({ identifier, password });
    localStorage.setItem('elan_token', data.token);
    localStorage.setItem('elan_visited', 'true');
    setToken(data.token);
    setUser(data.user);
    try {
      await api.syncLocalData(data.token);
    } catch (e) {
      console.warn('Sync local data note:', e);
    }
  }, []);

  const register = useCallback(async (username, password, email) => {
    await api.register({ username, password, email: email || undefined });
    await login(username, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('elan_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
