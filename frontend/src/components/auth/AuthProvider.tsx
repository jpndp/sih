'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { User } from '../../store/slices/authSlice';
import { LoginForm } from './LoginForm';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('kmrl_token');
    if (token && !isAuthenticated) {
      // In a real app, validate token with backend
      // For demo, we'll assume token is valid
    }
  }, [isAuthenticated]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};