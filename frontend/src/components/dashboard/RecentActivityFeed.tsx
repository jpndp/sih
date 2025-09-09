'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Upload,
  CheckCircle,
  Warning,
  Assignment,
  Person,
  Description,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'upload' | 'processing' | 'completion' | 'assignment' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'completion',
    title: 'Document Processing Completed',
    description: 'Engineering drawing "Metro Station Platform - Aluva" processed successfully',
    timestamp: '2024-01-15T14:30:00Z',
    user: 'AI System',
  },
  {
    id: '2',
    type: 'upload',
    title: 'New Document Uploaded',
    description: 'Maintenance report uploaded via email integration',
    timestamp: '2024-01-15T13:45:00Z',
    user: 'maintenance@kmrl.co.in',
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Document Assigned',
    description: 'Safety audit report assigned to compliance team',
    timestamp: '2024-01-15T12:20:00Z',
    user: 'admin@kmrl.co.in',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Compliance Deadline Alert',
    description: 'Environmental assessment deadline approaching in 30 days',
    timestamp: '2024-01-15T10:00:00Z',
    priority: 'high',
  },
  {
    id: '5',
    type: 'processing',
    title: 'Batch Processing Started',
    description: '15 documents queued for OCR and classification',
    timestamp: '2024-01-15T09:30:00Z',
    user: 'System',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'upload':
      return <Upload />;
    case 'processing':
      return <Description />;
    case 'completion':
      return <CheckCircle />;
    case 'assignment':
      return <Assignment />;
    case 'alert':
      return <Warning />;
    default:
      return <Description />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'upload':
      return '#1976d2';
    case 'processing':
      return '#ed6c02';
    case 'completion':
      return '#2e7d32';
    case 'assignment':
      return '#9c27b0';
    case 'alert':
      return '#d32f2f';
    default:
      return '#757575';
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'normal':
      return 'info';
    case 'low':
      return 'default';
    default:
      return undefined;
  }
};

export const RecentActivityFeed: React.FC = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        subheader="Latest system events and document processing updates"
      />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {mockActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{
                  px: 0,
                  '&:not(:last-child)': {
                    borderBottom: 1,
                    borderColor: 'divider',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getActivityColor(activity.type),
                      width: 32,
                      height: 32,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" component="span">
                        {activity.title}
                      </Typography>
                      {activity.priority && (
                        <Chip
                          label={activity.priority}
                          size="small"
                          color={getPriorityColor(activity.priority) as any}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        {activity.user && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {activity.user}
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(activity.timestamp))} ago
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};