import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getCurrentUser } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await getCurrentUser(token);
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      if (response.success && response.data) {
        const { token: newToken, ...userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        return response;
      } else {
        throw new Error(response.message || 'Login failed: Invalid response');
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      if (response.success && response.data) {
        const { token: newToken, ...user } = response.data;
        setToken(newToken);
        setUser(user);
        localStorage.setItem('token', newToken);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed: Invalid response');
      }
    } catch (error) {
      console.error('AuthContext register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

