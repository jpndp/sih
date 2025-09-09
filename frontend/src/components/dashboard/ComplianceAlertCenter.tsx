'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  AccessTime,
  NavigateNext,
  Notifications,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { motion } from 'framer-motion';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'normal':
      return 'info';
    default:
      return 'default';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Error color="error" />;
    case 'high':
      return <Warning color="warning" />;
    case 'normal':
      return <Info color="info" />;
    default:
      return <Info />;
  }
};

const formatDaysRemaining = (days: number) => {
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
};

export const ComplianceAlertCenter: React.FC = () => {
  const { complianceAlerts } = useSelector((state: RootState) => state.dashboard);

  if (!complianceAlerts) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading compliance alerts...</Typography>
        </CardContent>
      </Card>
    );
  }

  const totalAlerts = complianceAlerts.critical + complianceAlerts.warning + complianceAlerts.info;

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Badge badgeContent={totalAlerts} color="error" sx={{ mr: 2 }}>
              <Notifications />
            </Badge>
            Compliance Alerts
          </Box>
        }
        subheader="Regulatory deadlines and compliance status"
      />
      <CardContent>
        {/* Alert Summary */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box textAlign="center">
            <Avatar sx={{ bgcolor: 'error.main', mb: 1, mx: 'auto' }}>
              {complianceAlerts.critical}
            </Avatar>
            <Typography variant="caption">Critical</Typography>
          </Box>
          
          <Box textAlign="center">
            <Avatar sx={{ bgcolor: 'warning.main', mb: 1, mx: 'auto' }}>
              {complianceAlerts.warning}
            </Avatar>
            <Typography variant="caption">Warning</Typography>
          </Box>
          
          <Box textAlign="center">
            <Avatar sx={{ bgcolor: 'info.main', mb: 1, mx: 'auto' }}>
              {complianceAlerts.info}
            </Avatar>
            <Typography variant="caption">Info</Typography>
          </Box>
        </Box>

        {/* Upcoming Deadlines */}
        <Typography variant="h6" gutterBottom>
          Upcoming Deadlines
        </Typography>
        
        <List disablePadding>
          {complianceAlerts.upcomingDeadlines.map((deadline, index) => (
            <motion.div
              key={deadline.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  {getPriorityIcon(deadline.priority)}
                </ListItemIcon>
                
                <ListItemText
                  primary={deadline.title}
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDaysRemaining(deadline.daysRemaining)}
                      </Typography>
                      <Chip
                        label={deadline.priority}
                        size="small"
                        color={getPriorityColor(deadline.priority) as any}
                      />
                    </Box>
                  }
                />
                
                <IconButton size="small">
                  <NavigateNext />
                </IconButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        {complianceAlerts.upcomingDeadlines.length === 0 && (
          <Box textAlign="center" py={2}>
            <Typography color="text.secondary">
              No upcoming compliance deadlines
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};