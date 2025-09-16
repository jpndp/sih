import React, { Suspense, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { kmrlTheme } from './theme/kmrlTheme';
import { AuthProvider } from './components/auth/AuthProvider';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { Providers } from './app/providers';
import Sidebar from './components/layout/sidebar';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';
import FileUpload from './components/upload/FileUpload';
import { GlobalAlert } from './components/alerts/GlobalAlert';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';

// Root application wrapper
const App: React.FC = () => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // You can add error reporting service here
    console.error('Application error:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <Providers>
        <Router>
          <ThemeProvider theme={kmrlTheme}>
            <CssBaseline />
            <AuthProvider>
              <NotificationProvider>
                <GlobalAlert />
                <div style={{ display: 'flex' }}>
                  <ErrorBoundary
                    onError={handleError}
                    fallback={<div>Error loading sidebar</div>}
                  >
                    <Sidebar />
                  </ErrorBoundary>
                <main style={{ marginLeft: 240, padding: '20px', width: '100%' }}>
                  <ErrorBoundary
                    onError={handleError}
                    fallback={
                      <div className="p-4">
                        <h2>Error loading content</h2>
                        <p>Please refresh the page to try again.</p>
                      </div>
                    }
                  >
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={
                          <>
                            <FileUpload />
                            <Dashboard />
                          </>
                        } />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
        </Router>
      </Providers>
    </ErrorBoundary>
  );
};

export default App;
