import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = useCallback(async (name, email, password, confirmPassword, role, phone, city, state) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
        role,
        phone,
        city,
        state,
      });

      const { data } = response.data;
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data,
          token: data.token,
          refreshToken: data.refreshToken,
        },
      });

      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMsg });
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/login', { email, password });

      const { data } = response.data;
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data,
          token: data.token,
          refreshToken: data.refreshToken,
        },
      });

      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMsg });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.token,
    register,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
