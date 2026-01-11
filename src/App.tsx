import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

import { store } from './store/store';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useDevUser } from './hooks/useDevUser'; // Add this import

import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Create a wrapper component that uses the dev user hook
function AppContent() {
  useDevUser(); // Initialize development user
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin', 'teacher']}>
            <AdminPage />
          </PrivateRoute>
        } />
        
        <Route path="/student" element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentPage />
          </PrivateRoute>
        } />
        
        <Route path="/attendance" element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
        } />
        
        <Route path="/analytics" element={
          <PrivateRoute allowedRoles={['admin', 'teacher']}>
            <AnalyticsPage />
          </PrivateRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <ThemeProvider>
                <MuiThemeProvider theme={theme}>
                  <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    autoHideDuration={3000}
                  >
                    <CssBaseline />
                    <AppContent />
                  </SnackbarProvider>
                </MuiThemeProvider>
              </ThemeProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;