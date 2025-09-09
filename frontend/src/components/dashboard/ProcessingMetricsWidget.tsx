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
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  CheckCircle,
  Queue,
  Description,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const ProcessingMetricsWidget: React.FC = () => {
  const { processingMetrics } = useSelector((state: RootState) => state.dashboard);

  if (!processingMetrics) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Processing Metrics"
        subheader="Real-time document processing statistics"
      />
      <CardContent>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={3}>
            <MetricCard
              title="Total Documents"
              value={processingMetrics.totalDocuments.toLocaleString()}
              subtitle="All time"
              icon={<Description />}
              color="#1976d2"
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <MetricCard
              title="Processed Today"
              value={processingMetrics.processedToday}
              subtitle="24 hours"
              icon={<CheckCircle />}
              color="#2e7d32"
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <MetricCard
              title="Success Rate"
              value={`${processingMetrics.successRate}%`}
              subtitle="Last 7 days"
              icon={<TrendingUp />}
              color="#ed6c02"
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <MetricCard
              title="Avg Time"
              value={`${processingMetrics.averageProcessingTime}s`}
              subtitle="Per document"
              icon={<Speed />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Processing Trend (Last 7 Days)
          </Typography>
          <Box height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingMetrics.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1976d2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Current Queue
          </Typography>
          <Box display="flex" alignItems="center">
            <Queue sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              {processingMetrics.queueLength} documents waiting for processing
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};