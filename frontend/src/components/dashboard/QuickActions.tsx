'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
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
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Button
      fullWidth
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2,
        height: 'auto',
        textAlign: 'left',
        justifyContent: 'flex-start',
        border: 2,
        borderColor: 'divider',
        '&:hover': {
          borderColor: color,
          bgcolor: `${color}08`,
        },
      }}
    >
      <Avatar sx={{ bgcolor: color, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Button>
  </motion.div>
);

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Upload Documents',
      description: 'Add new documents for processing',
      icon: <Upload />,
      color: '#1976d2',
      onClick: () => console.log('Upload clicked'),
    },
    {
      title: 'View Analytics',
      description: 'Check processing statistics',
      icon: <Assessment />,
      color: '#2e7d32',
      onClick: () => console.log('Analytics clicked'),
    },
    {
      title: 'Compliance Center',
      description: 'Manage regulatory requirements',
      icon: <Security />,
      color: '#d32f2f',
      onClick: () => console.log('Compliance clicked'),
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: <Settings />,
      color: '#ed6c02',
      onClick: () => console.log('Settings clicked'),
    },
    {
      title: 'Create Report',
      description: 'Generate custom reports',
      icon: <Add />,
      color: '#9c27b0',
      onClick: () => console.log('Report clicked'),
    },
    {
      title: 'Search Documents',
      description: 'Find specific documents',
      icon: <Search />,
      color: '#0288d1',
      onClick: () => console.log('Search clicked'),
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Quick Actions"
        subheader="Common tasks and shortcuts"
      />
      <CardContent>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} key={action.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <QuickAction {...action} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};