import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { kmrlTheme } from './theme/kmrlTheme';
import { AuthProvider } from './components/auth/AuthProvider';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { Providers } from './app/providers';

// Root application wrapper replicating what Next.js layout was doing, adapted for Vite
const App: React.FC = () => {
  return (
    <Providers>
      <ThemeProvider theme={kmrlTheme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <Dashboard />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Providers>
  );
};

export default App;
