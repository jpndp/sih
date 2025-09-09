import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Providers } from './providers';
import { AuthProvider } from '../components/auth/AuthProvider';
import { NotificationProvider } from '../components/notifications/NotificationProvider';
import { kmrlTheme } from '../theme/kmrlTheme';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KMRL Document Processing System',
  description: 'Automated document processing and compliance management for Kochi Metro Rail Limited',
  keywords: ['KMRL', 'document processing', 'compliance', 'metro rail'],
  authors: [{ name: 'KMRL IT Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider theme={kmrlTheme}>
            <CssBaseline />
            <AuthProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}