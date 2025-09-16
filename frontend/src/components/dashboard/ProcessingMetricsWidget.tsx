'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Description,
  TrendingUp,
  Speed,
  Queue,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    <Card 
      sx={{ 
        height: '100%',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Avatar 
              sx={{ 
                bgcolor: color,
                width: 52,
                height: 52,
                boxShadow: `0 2px 8px ${color}30`,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              {icon}
            </Avatar>
          </motion.div>
          <Box flexGrow={1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography 
                variant="h4" 
                component="div"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
            </motion.div>
            <Typography 
              variant="body1" 
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: color,
                },
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{
                color: 'text.secondary',
                opacity: 0.8,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export const ProcessingMetricsWidget: React.FC = () => {
  const { processingMetrics } = useSelector((state: RootState) => state.dashboard);

  if (!processingMetrics) {
    return (
      <Card
        sx={{
          background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: '300px',
        }}
      >
        <CardContent>
          <Box 
            display="flex" 
            flexDirection="column"
            alignItems="center" 
            justifyContent="center" 
            minHeight="300px"
            gap={3}
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
                Loading Processing Metrics...
              </Typography>
            </motion.div>
            <Box sx={{ width: '60%', maxWidth: '400px' }}>
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
        </CardContent>
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
              Processing Metrics
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
              Real-time document processing statistics
            </Typography>
          </motion.div>
        }
      />
      <CardContent>
        <Box
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 4
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MetricCard
              title="Total Documents"
              value={processingMetrics.totalDocuments.toLocaleString()}
              subtitle="All time"
              icon={<Description />}
              color="#1976d2"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MetricCard
              title="Processed Today"
              value={processingMetrics.processedToday}
              subtitle="24 hours"
              icon={<CheckCircle />}
              color="#2e7d32"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MetricCard
              title="Success Rate"
              value={`${processingMetrics.successRate}%`}
              subtitle="Last 7 days"
              icon={<TrendingUp />}
              color="#ed6c02"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MetricCard
              title="Avg Time"
              value={`${processingMetrics.averageProcessingTime}s`}
              subtitle="Per document"
              icon={<Speed />}
              color="#9c27b0"
            />
          </motion.div>
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box 
            mb={4} 
            sx={{
              background: (theme) => theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: (theme) => theme.palette.text.primary,
                mb: 2,
              }}
            >
              Processing Trend (Last 7 Days)
            </Typography>
            <Box 
              height={250}
              sx={{
                '.recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line': {
                  stroke: (theme) => theme.palette.divider,
                },
                '.recharts-tooltip-wrapper': {
                  outline: 'none',
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingMetrics.dailyTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'text.secondary' }}
                    stroke="#E0E0E0"
                  />
                  <YAxis 
                    tick={{ fill: 'text.secondary' }}
                    stroke="#E0E0E0"
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#fff', strokeWidth: 3 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    fill="url(#colorCount)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: (theme) => theme.palette.text.primary,
                mb: 2,
              }}
            >
              Current Queue
            </Typography>
            <Box 
              display="flex" 
              alignItems="center"
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 24,
                  color: (theme) => 
                    processingMetrics.queueLength > 50 
                      ? theme.palette.warning.main
                      : theme.palette.info.main
                }
              }}
            >
              <motion.div
                animate={{ 
                  rotate: processingMetrics.queueLength > 50 ? [0, -10, 10, -10, 0] : 0
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: processingMetrics.queueLength > 50 ? Infinity : 0,
                  repeatDelay: 2
                }}
              >
                <Queue sx={{ mr: 2 }} />
              </motion.div>
              <Typography 
                variant="body1"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                {processingMetrics.queueLength} documents waiting for processing
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </CardContent>
    </Card>
  );
};