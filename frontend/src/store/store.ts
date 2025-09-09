import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { documentsSlice } from './slices/documentsSlice';
import { dashboardSlice } from './slices/dashboardSlice';
import { complianceSlice } from './slices/complianceSlice';
import { notificationsSlice } from './slices/notificationsSlice';
import { uiSlice } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    documents: documentsSlice.reducer,
    dashboard: dashboardSlice.reducer,
    compliance: complianceSlice.reducer,
    notifications: notificationsSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;