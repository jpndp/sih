'use client';

import React, { useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
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
  const { loading, error, lastRefresh } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
    dispatch(setBreadcrumbs([{ label: 'Dashboard', path: '/' }]));
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            KMRL Document Processing System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring and management dashboard for automated document processing
          </Typography>
          {lastRefresh && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Last updated: {new Date(lastRefresh).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* System Health Panel */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SystemHealthPanel />
            </motion.div>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <QuickActions />
            </motion.div>
          </Grid>

          {/* Processing Metrics */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProcessingMetricsWidget />
            </motion.div>
          </Grid>

          {/* Compliance Alerts */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ComplianceAlertCenter />
            </motion.div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <RecentActivityFeed />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};