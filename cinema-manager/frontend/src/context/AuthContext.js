import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const adminLogin = async (credentials) => {
    const userData = await authService.adminLogin(credentials);
    setUser(userData);
    return userData;
  };

  const signup = async (userData) => {
    const result = await authService.signup(userData);
    return result;
  };

  const adminSignup = async (userData) => {
    const result = await authService.adminSignup(userData);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    adminLogin,
    signup,
    adminSignup,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
