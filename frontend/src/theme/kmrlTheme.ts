import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    metro: {
      green: string;
      blue: string;
      orange: string;
      lightGreen: string;
      darkBlue: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }

  interface PaletteOptions {
    metro?: {
      green?: string;
      blue?: string;
      orange?: string;
      lightGreen?: string;
      darkBlue?: string;
    };
    status?: {
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
    };
  }
}

const kmrlColors = {
  metro: {
    green: '#00A86B',
    blue: '#003366',
    orange: '#FF6B35',
    lightGreen: '#4CAF50',
    darkBlue: '#1565C0',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};

export const kmrlTheme = createTheme({
  palette: {
    primary: {
      main: kmrlColors.metro.green,
      dark: '#00875A',
      light: '#33BA7C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: kmrlColors.metro.blue,
      dark: '#002244',
      light: '#334D80',
      contrastText: '#FFFFFF',
    },
    error: {
      main: kmrlColors.status.error,
    },
    warning: {
      main: kmrlColors.status.warning,
    },
    info: {
      main: kmrlColors.status.info,
    },
    success: {
      main: kmrlColors.status.success,
    },
    metro: kmrlColors.metro,
    status: kmrlColors.status,
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${kmrlColors.metro.green} 0%, ${kmrlColors.metro.lightGreen} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, #00875A 0%, #43A047 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...kmrlTheme,
  palette: {
    ...kmrlTheme.palette,
    mode: 'dark',
    background: {
      default: '#0F1419',
      paper: '#1A202C',
    },
    text: {
      primary: '#F7FAFC',
      secondary: '#CBD5E0',
    },
  },
});