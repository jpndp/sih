import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'maintenance' | 'compliance' | 'management';
  department: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Mock authentication for demo
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@kmrl.co.in' && password === 'admin') {
      return {
        user: {
          id: '1',
          email: 'admin@kmrl.co.in',
          name: 'System Administrator',
          role: 'admin' as const,
          department: 'IT',
          permissions: ['read', 'write', 'delete', 'admin'],
          avatar: '/avatars/admin.jpg',
          lastLogin: new Date().toISOString(),
        },
        token: 'mock-jwt-token-admin',
      };
    } else if (email === 'engineer@kmrl.co.in' && password === 'engineer') {
      return {
        user: {
          id: '2',
          email: 'engineer@kmrl.co.in',
          name: 'Senior Engineer',
          role: 'engineer' as const,
          department: 'Engineering',
          permissions: ['read', 'write'],
          avatar: '/avatars/engineer.jpg',
          lastLogin: new Date().toISOString(),
        },
        token: 'mock-jwt-token-engineer',
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  // Clear local storage or perform logout API call
  localStorage.removeItem('kmrl_token');
  return null;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('kmrl_token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});