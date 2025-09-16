'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchDashboardData } from '../../store/slices/dashboardSlice';
import { setPageTitle, setBreadcrumbs } from '../../store/slices/uiSlice';
import { SystemHealthPanel } from './SystemHealthPanel';
import { ProcessingMetricsWidget } from './ProcessingMetricsWidget';
import { ComplianceAlertCenter } from './ComplianceAlertCenter';
import { RecentActivityFeed } from './RecentActivityFeed';
import { QuickActions } from './QuickActions';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lastRefresh } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
    dispatch(setBreadcrumbs([{ label: 'Dashboard', path: '/' }]));
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box 
          mb={4}
          sx={{
            background: 'linear-gradient(135deg, rgba(0,168,107,0.08) 0%, rgba(0,51,102,0.08) 100%)',
            borderRadius: 3,
            p: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #00A86B 0%, #003366 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              KMRL Document Processing System
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
              Real-time monitoring and management dashboard for automated document processing
            </Typography>
            {lastRefresh && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    display: 'inline-block',
                  }}
                />
                Last updated: {new Date(lastRefresh).toLocaleString()}
              </Typography>
            )}
          </motion.div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <QuickActions />
          </motion.div>

          {/* System Health Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <SystemHealthPanel />
          </motion.div>

          {/* Processing Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <ProcessingMetricsWidget />
          </motion.div>

          {/* Compliance Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <ComplianceAlertCenter />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <RecentActivityFeed />
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};