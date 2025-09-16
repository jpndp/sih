'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
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
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          '&:hover': {
            boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Box 
                mr={2} 
                sx={{
                  color: (theme) => status === 'healthy' 
                    ? theme.palette.success.main 
                    : status === 'warning'
                      ? theme.palette.warning.main
                      : theme.palette.error.main
                }}
              >
                {icon}
              </Box>
            </motion.div>
            <Typography 
              variant="h6" 
              component="div" 
              flexGrow={1}
              sx={{
                fontWeight: 600,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </Typography>
            <motion.div
              animate={{
                scale: status !== 'healthy' ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: status !== 'healthy' ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {getStatusIcon(status)}
            </motion.div>
          </Box>
          
          <Box mb={2}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Chip
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                color={getStatusColor(status)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  boxShadow: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              />
            </motion.div>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              opacity: 0.9,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1
              }
            }}
          >
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
      <Card
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          sx={{ 
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Loading System Health...
            </Typography>
          </motion.div>
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              sx={{ 
                height: 6,
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.grey[100],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundImage: (theme) => 
                    `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }} 
            />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
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
                System Health Monitor
              </Typography>
            </motion.div>
          </Box>
        }
        subheader={
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date(systemHealth.lastUpdated).toLocaleTimeString()}
            </Typography>
          </motion.div>
        }
        action={
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <IconButton 
              onClick={handleRefresh} 
              disabled={loading}
              sx={{
                '&:hover': {
                  background: (theme) => theme.palette.action.hover,
                }
              }}
            >
              <Refresh />
            </IconButton>
          </motion.div>
        }
        sx={{
          pb: 3,
          '& .MuiCardHeader-action': {
            margin: 0,
          },
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)'
            },
            gap: 3
          }}
        >
          <HealthIndicator
            title="OCR Service"
            status={systemHealth.ocrService}
            icon={<Computer />}
            description="Optical Character Recognition processing engine"
          />
          <HealthIndicator
            title="AI Processing"
            status={systemHealth.aiProcessing}
            icon={<Settings />}
            description="Document classification and routing AI engine"
          />
          <HealthIndicator
            title="Integrations"
            status={systemHealth.integrations}
            icon={<Cloud />}
            description="External system connections (Maximo, SharePoint, etc.)"
          />
          <HealthIndicator
            title="Database"
            status={systemHealth.database}
            icon={<Storage />}
            description="Primary database and data storage systems"
          />
        </Box>
      </CardContent>
    </Card>
  );
};