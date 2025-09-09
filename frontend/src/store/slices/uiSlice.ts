import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeTab: string;
  loadingStates: Record<string, boolean>;
  modals: Record<string, boolean>;
  currentPage: string;
  breadcrumbs: Array<{ label: string; path: string }>;
  pageTitle: string;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeTab: 'dashboard',
  loadingStates: {},
  modals: {},
  currentPage: 'dashboard',
  breadcrumbs: [{ label: 'Dashboard', path: '/' }],
  pageTitle: 'Dashboard',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      localStorage.setItem('kmrl_theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loadingStates[action.payload.key] = action.payload.loading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[action.payload];
    },
    setModal: (state, action: PayloadAction<{ key: string; open: boolean }>) => {
      state.modals[action.payload.key] = action.payload.open;
    },
    closeAllModals: (state) => {
      state.modals = {};
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
      if (typeof document !== 'undefined') {
        document.title = `${action.payload} - KMRL Document Processing System`;
      }
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setMobileMenuOpen,
  setActiveTab,
  setLoading,
  clearLoading,
  setModal,
  closeAllModals,
  setCurrentPage,
  setBreadcrumbs,
  setPageTitle,
} = uiSlice.actions;