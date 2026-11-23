import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('phishguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('phishguard_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('phishguard_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('phishguard_token', res.data.token);
      localStorage.setItem('phishguard_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('phishguard_token', res.data.token);
      localStorage.setItem('phishguard_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const loginAsDemo = async () => {
    return login('analyst@phishguard.ai', 'Demo@1234');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('phishguard_token');
    localStorage.removeItem('phishguard_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
