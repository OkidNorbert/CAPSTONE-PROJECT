import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);

  // Configure axios
  axios.defaults.baseURL = API_URL;

  // Add token to requests if it exists
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleLogout();
        setRedirectPath('/signin');
      }
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      setCurrentUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set redirect path based on user role
      if (user.role === 'jobseeker') {
        setRedirectPath('/jobs/search');
      } else if (user.role === 'employer') {
        setRedirectPath('/company/jobs');
      } else if (user.role === 'admin') {
        setRedirectPath('/admin/dashboard');
      }

      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;

      // Set the user and token after successful registration
      setCurrentUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set redirect path based on user role
      if (user.role === 'jobseeker') {
        setRedirectPath('/jobs/search');
      } else if (user.role === 'employer') {
        setRedirectPath('/company/profile');
      }

      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError(null);
    setRedirectPath('/');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      const { user } = response.data;
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send password reset email');
      throw error;
    }
  };

  const confirmPasswordReset = async (token, password) => {
    try {
      const response = await axios.post('/auth/reset-password', {
        token,
        password
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await axios.get('/auth/me');
          setCurrentUser(response.data.user);
        } catch (error) {
          // Token is invalid or expired
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Provide authentication state and functions
  const value = {
    currentUser,
    login,
    register,
    logout: handleLogout,
    updateProfile,
    forgotPassword,
    confirmPasswordReset,
    isAuthenticated: !!currentUser,
    error,
    clearError: () => setError(null),
    redirectPath,
    clearRedirectPath: () => setRedirectPath(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}