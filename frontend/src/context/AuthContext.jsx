import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('elan_token'));
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('elan_guest') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      if (isGuest) {
        setUser({ username: 'Invité' });
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    api.me(token)
      .then((userData) => {
        setUser(userData);
        setIsGuest(false);
        sessionStorage.removeItem('elan_guest');
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('elan_token');
        sessionStorage.removeItem('elan_guest');
      })
      .finally(() => setLoading(false));
  }, [token, isGuest]);

  const login = useCallback(async (identifier, password) => {
    const data = await api.login({ identifier, password });
    localStorage.setItem('elan_token', data.token);
    sessionStorage.removeItem('elan_guest');
    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
  }, []);

  const register = useCallback(async (username, password, email) => {
    await api.register({ username, password, email: email || undefined });
    await login(username, password);
  }, [login]);

  const startGuestSession = useCallback(() => {
    sessionStorage.setItem('elan_guest', 'true');
    setIsGuest(true);
    setUser({ username: 'Invité' });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('elan_token');
    sessionStorage.removeItem('elan_guest');
    setToken(null);
    setUser(null);
    setIsGuest(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isGuest, loading, login, register, startGuestSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
