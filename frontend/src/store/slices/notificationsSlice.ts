import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'critical';
  category: 'system' | 'document' | 'compliance' | 'user';
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  autoHide?: boolean;
  hideDelay?: number;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  settings: {
    enablePush: boolean;
    enableEmail: boolean;
    enableSound: boolean;
    categories: {
      system: boolean;
      document: boolean;
      compliance: boolean;
      user: boolean;
    };
  };
  snackbars: Notification[];
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: '1',
      title: 'Document Processing Completed',
      message: 'Engineering drawing "Metro Station Platform - Aluva" has been successfully processed.',
      type: 'success',
      timestamp: '2024-01-15T14:30:00Z',
      read: false,
      priority: 'normal',
      category: 'document',
      autoHide: true,
      hideDelay: 5000,
    },
    {
      id: '2',
      title: 'Compliance Alert',
      message: 'Safety audit deadline approaching in 10 days. Please ensure all documentation is submitted.',
      type: 'warning',
      timestamp: '2024-01-15T10:00:00Z',
      read: false,
      priority: 'high',
      category: 'compliance',
      actions: [
        { label: 'View Details', action: 'view_compliance', primary: true },
        { label: 'Dismiss', action: 'dismiss' },
      ],
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM IST.',
      type: 'info',
      timestamp: '2024-01-14T16:00:00Z',
      read: true,
      priority: 'normal',
      category: 'system',
    },
  ],
  unreadCount: 2,
  settings: {
    enablePush: true,
    enableEmail: true,
    enableSound: true,
    categories: {
      system: true,
      document: true,
      compliance: true,
      user: true,
    },
  },
  snackbars: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      
      // Add to snackbars if it should auto-hide
      if (notification.autoHide) {
        state.snackbars.push(notification);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    updateSettings: (state, action: PayloadAction<Partial<NotificationsState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    removeSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbars = state.snackbars.filter(snackbar => snackbar.id !== action.payload);
    },
    clearSnackbars: (state) => {
      state.snackbars = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updateSettings,
  removeSnackbar,
  clearSnackbars,
} = notificationsSlice.actions;