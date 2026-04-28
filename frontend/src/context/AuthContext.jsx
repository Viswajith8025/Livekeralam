import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
        try {
          // Verify token with backend
          const response = await api.get('/user/me');
          if (response.data.success) {
            setUser(response.data.data);
            setToken(storedToken);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('Auth sync failed:', err);
          if (err.response?.status === 401) {
            handleLogout();
          }
        }
      } else {
        // No token found, clear any potentially stale user data
        handleLogout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    // Custom event to notify other parts of the app (e.g., Navbar)
    window.dispatchEvent(new Event('authChange'));
  };

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.warn('Backend logout cleanup skipped');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user && !!token && token !== 'null' && token !== 'undefined',
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
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
