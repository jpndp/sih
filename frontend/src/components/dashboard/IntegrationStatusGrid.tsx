'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Business,
  CloudSync,
  Email,
  WhatsApp,
  Sync,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface IntegrationCardProps {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  icon: React.ReactNode;
  color: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, status, lastSync, icon, color }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle color="success" fontSize="small" />;
      case 'disconnected':
        return <Warning color="warning" fontSize="small" />;
      case 'error':
        return <Error color="error" fontSize="small" />;
      default:
        return <Warning fontSize="small" />;
    }
  };

  const getLastSyncText = (lastSync: string) => {
    try {
      return `${formatDistanceToNow(new Date(lastSync))} ago`;
    } catch {
      return 'Unknown';
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
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: color, mr: 2 }}>
              {icon}
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6" component="div">
                {name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {getStatusIcon(status)}
                <Chip
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  size="small"
                  color={getStatusColor(status) as any}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Sync fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Last sync: {getLastSyncText(lastSync)}
              </Typography>
            </Box>
            
            {status === 'connected' && (
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'success.main',
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const IntegrationStatusGrid: React.FC = () => {
  const { integrationStatus } = useSelector((state: RootState) => state.dashboard);

  if (!integrationStatus) {
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

  const integrations = [
    {
      name: 'Maximo',
      status: integrationStatus.maximo.status,
      lastSync: integrationStatus.maximo.lastSync,
      icon: <Business />,
      color: '#1976d2',
    },
    {
      name: 'SharePoint',
      status: integrationStatus.sharepoint.status,
      lastSync: integrationStatus.sharepoint.lastSync,
      icon: <CloudSync />,
      color: '#0078d4',
    },
    {
      name: 'Email System',
      status: integrationStatus.email.status,
      lastSync: integrationStatus.email.lastSync,
      icon: <Email />,
      color: '#d32f2f',
    },
    {
      name: 'WhatsApp',
      status: integrationStatus.whatsapp.status,
      lastSync: integrationStatus.whatsapp.lastSync,
      icon: <WhatsApp />,
      color: '#25d366',
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Integration Status"
        subheader="External system connections and sync status"
      />
      <CardContent>
        <Grid container spacing={2}>
          {integrations.map((integration, index) => (
            <Grid item xs={12} sm={6} md={3} key={integration.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <IntegrationCard {...integration} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};