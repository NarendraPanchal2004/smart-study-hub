import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('studySyncUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('studySyncUser', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('studySyncUser', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studySyncUser');
  };

  const getAllUsers = async () => {
    const { data } = await axios.get('http://localhost:5000/api/auth/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
    return data;
  };

  const resetPassword = async (email, newPassword) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAllUsers, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
