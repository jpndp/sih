'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import { Person, Email, Badge, Business, AccessTime } from '@mui/icons-material';

export const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(255,153,51,0.1) 0%, rgba(255,255,255,1) 50%, rgba(19,136,8,0.1) 100%)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {user.name[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.department}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <List sx={{ width: '100%' }}>
          <ListItem>
            <Person sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText 
              primary="Full Name" 
              secondary={user.name} 
            />
          </ListItem>
          <ListItem>
            <Email sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText 
              primary="Email" 
              secondary={user.email} 
            />
          </ListItem>
          <ListItem>
            <Badge sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText 
              primary="Role" 
              secondary={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
            />
          </ListItem>
          <ListItem>
            <Business sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText 
              primary="Department" 
              secondary={user.department} 
            />
          </ListItem>
          <ListItem>
            <AccessTime sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText 
              primary="Last Login" 
              secondary={new Date(user.lastLogin || '').toLocaleString()} 
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {user.permissions.map((permission) => (
                <Box
                  key={permission}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                  }}
                >
                  {permission}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};