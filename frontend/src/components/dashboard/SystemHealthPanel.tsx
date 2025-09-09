'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Computer,
  Cloud,
  Storage,
  Settings,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { refreshSystemHealth } from '../../store/slices/dashboardSlice';
import { motion } from 'framer-motion';

interface HealthIndicatorProps {
  title: string;
  status: 'healthy' | 'warning' | 'error';
  icon: React.ReactNode;
  description: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ title, status, icon, description }) => {
  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CheckCircle />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Box mr={1} color="text.secondary">
              {icon}
            </Box>
            <Typography variant="h6" component="div" flexGrow={1}>
              {title}
            </Typography>
            {getStatusIcon(status)}
          </Box>
          
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={getStatusColor(status)}
            size="small"
            sx={{ mb: 1 }}
          />
          
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const SystemHealthPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { systemHealth, loading } = useSelector((state: RootState) => state.dashboard);

  const handleRefresh = () => {
    dispatch(refreshSystemHealth());
  };

  if (!systemHealth) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="System Health Monitor"
        subheader={`Last updated: ${new Date(systemHealth.lastUpdated).toLocaleTimeString()}`}
        action={
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <HealthIndicator
              title="OCR Service"
              status={systemHealth.ocrService}
              icon={<Computer />}
              description="Optical Character Recognition processing engine"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <HealthIndicator
              title="AI Processing"
              status={systemHealth.aiProcessing}
              icon={<Settings />}
              description="Document classification and routing AI engine"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <HealthIndicator
              title="Integrations"
              status={systemHealth.integrations}
              icon={<Cloud />}
              description="External system connections (Maximo, SharePoint, etc.)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <HealthIndicator
              title="Database"
              status={systemHealth.database}
              icon={<Storage />}
              description="Primary database and data storage systems"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};