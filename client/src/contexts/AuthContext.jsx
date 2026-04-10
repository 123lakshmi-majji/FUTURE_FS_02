// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfileKey = (userData) => {
    if (!userData) return null;
    if (userData.email) return `profile:${userData.email}`;
    if (userData._id) return `profile:${userData._id}`;
    return null;
  };

  const mergeWithSavedProfile = (userData) => {
    const key = getProfileKey(userData);
    if (!key) return userData;
    const saved = localStorage.getItem(key);
    if (!saved) return userData;
    try {
      const savedProfile = JSON.parse(saved);
      return { ...userData, ...savedProfile };
    } catch {
      return userData;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsed = JSON.parse(userData);
      setUser(mergeWithSavedProfile(parsed));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      const mergedUser = mergeWithSavedProfile(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mergedUser));
      setUser(mergedUser);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      const mergedUser = mergeWithSavedProfile(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mergedUser));
      setUser(mergedUser);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out');
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      const key = getProfileKey(nextUser);
      if (key) {
        localStorage.setItem(
          key,
          JSON.stringify({
            name: nextUser.name,
            email: nextUser.email,
            phone: nextUser.phone,
            role: nextUser.role,
            company: nextUser.company,
            location: nextUser.location,
            bio: nextUser.bio,
          })
        );
      }
      return nextUser;
    });
    toast.success('Profile updated');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
