'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Upload,
  Assessment,
  Security,
  Settings,
  Add,
  Search,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { setPageTitle, setAlert, setSearchOpen } from '../../store/slices/uiSlice';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    <Button
      fullWidth
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2.5,
        height: 'auto',
        textAlign: 'left',
        justifyContent: 'flex-start',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        background: (theme) => 
          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          borderColor: color,
          background: (theme) => 
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${color}20`,
          '& .MuiAvatar-root': {
            transform: 'scale(1.1)',
            boxShadow: `0 4px 12px ${color}40`,
          },
          '& .action-title': {
            color: color,
          },
        },
      }}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Avatar 
          sx={{ 
            bgcolor: color,
            mr: 2,
            width: 48,
            height: 48,
            transition: 'all 0.3s ease-in-out',
            boxShadow: `0 2px 8px ${color}30`,
          }}
        >
          {icon}
        </Avatar>
      </motion.div>
      <Box>
        <Typography 
          variant="subtitle1" 
          component="div"
          className="action-title"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            transition: 'color 0.3s ease-in-out',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            opacity: 0.8,
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          {description}
        </Typography>
      </Box>
    </Button>
  </motion.div>
);

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpload = () => {
    dispatch(setAlert({
      type: 'info',
      message: 'Upload section activated. Select your documents to begin processing.',
    }));
    // The FileUpload component is already visible in the dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalytics = () => {
    navigate('/analytics');
    dispatch(setPageTitle('Analytics'));
  };

  const handleCompliance = () => {
    navigate('/compliance');
    dispatch(setPageTitle('Compliance Center'));
  };

  const handleSettings = () => {
    navigate('/settings');
    dispatch(setPageTitle('Settings'));
  };

  const handleReport = () => {
    dispatch(setAlert({
      type: 'info',
      message: 'Report generation started. Please select your parameters.',
    }));
    navigate('/reports/new');
    dispatch(setPageTitle('Create Report'));
  };

  const handleSearch = () => {
    dispatch(setSearchOpen(true)); // This action will be handled by the UI slice
  };

  const actions = [
    {
      title: 'Upload Documents',
      description: 'Add new documents for processing',
      icon: <Upload />,
      color: '#FF9933', // Saffron from Indian flag
      onClick: handleUpload,
    },
    {
      title: 'View Analytics',
      description: 'Check processing statistics',
      icon: <Assessment />,
      color: '#138808', // Green from Indian flag
      onClick: handleAnalytics,
    },
    {
      title: 'Compliance Center',
      description: 'Manage regulatory requirements',
      icon: <Security />,
      color: '#000080', // Navy Blue (similar to Ashoka Chakra)
      onClick: handleCompliance,
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: <Settings />,
      color: '#FF9933', // Saffron from Indian flag
      onClick: handleSettings,
    },
    {
      title: 'Create Report',
      description: 'Generate custom reports',
      icon: <Add />,
      color: '#138808', // Green from Indian flag
      onClick: handleReport,
    },
    {
      title: 'Search Documents',
      description: 'Find specific documents',
      icon: <Search />,
      color: '#000080', // Navy Blue (similar to Ashoka Chakra)
      onClick: handleSearch,
    },
  ];

  return (
    <Card
      sx={{
        height: '100%',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardHeader 
        title={
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h5" 
              component="div"
              sx={{
                fontWeight: 700,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Quick Actions
            </Typography>
          </motion.div>
        }
        subheader={
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Common tasks and shortcuts
            </Typography>
          </motion.div>
        }
      />
      <CardContent sx={{ px: 3, pb: 3 }}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <QuickAction {...action} />
            </motion.div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};