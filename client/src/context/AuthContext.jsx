import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shikshavid_token');
    const savedUser = localStorage.getItem('shikshavid_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('shikshavid_token');
        localStorage.removeItem('shikshavid_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    if (data.success) {
      localStorage.setItem('shikshavid_token', data.token);
      localStorage.setItem('shikshavid_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message);
  };

  const signup = async (formData) => {
    const { data } = await authAPI.signup(formData);
    if (data.success) {
      localStorage.setItem('shikshavid_token', data.token);
      localStorage.setItem('shikshavid_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message);
  };

  const logout = () => {
    localStorage.removeItem('shikshavid_token');
    localStorage.removeItem('shikshavid_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('shikshavid_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
