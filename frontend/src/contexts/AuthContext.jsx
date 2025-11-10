import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        token: null,
        loading: false,
        error: null 
      };
    case 'LOADING_COMPLETE':
      return { 
        ...state, 
        loading: false 
      };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: { ...state.user, ...action.payload } 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: true,
  error: null
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Axios interceptor for token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        verifyToken();
      }
    }
  }, []);

  // Set auth token
  const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  };

  // Set user data
  const setUserData = (user) => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  // Verify token
  const verifyToken = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        dispatch({ type: 'LOADING_COMPLETE' });
        return;
      }
      
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        setUserData(response.data.user);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: token
          }
        });
      } else {
        dispatch({ type: 'LOADING_COMPLETE' });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setAuthToken(null);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUserData(user);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        });
        
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await axios.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUserData(user);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        });
        
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { token });
      
      if (response.data.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: { isEmailVerified: true }
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      return { success: false, message: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, message: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return { success: false, message: errorMessage };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/users/profile', profileData);
      
      if (response.data.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data.user
        });
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, message: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put('/api/users/change-password', passwordData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      return { success: false, message: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};