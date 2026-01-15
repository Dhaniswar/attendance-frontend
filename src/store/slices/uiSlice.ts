import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    read: boolean;
  }>;
  isLoading: boolean;
  loadingMessage: string | null;
  dialog: {
    open: boolean;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'error' | 'success';
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  themeMode: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  notifications: [],
  isLoading: false,
  loadingMessage: null,
  dialog: {
    open: false,
    title: '',
    content: '',
    type: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.themeMode);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        read: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || null;
    },
    showDialog: (
      state,
      action: PayloadAction<{
        title: string;
        content: string;
        type?: 'info' | 'warning' | 'error' | 'success';
      }>
    ) => {
      state.dialog = {
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        type: action.payload.type || 'info',
      };
    },
    hideDialog: (state) => {
      state.dialog.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearNotifications,
  setLoading,
  showDialog,
  hideDialog,
} = uiSlice.actions;

export default uiSlice.reducer;