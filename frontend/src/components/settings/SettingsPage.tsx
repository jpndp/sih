'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
} from '@mui/material';
import {
  Notifications,
  Visibility,
  Language,
  DarkMode,
  Security,
} from '@mui/icons-material';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    language: 'en',
    autoSave: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleLanguageChange = (event: any) => {
    setSettings((prev) => ({
      ...prev,
      language: event.target.value,
    }));
  };

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
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <List sx={{ width: '100%' }}>
          <ListItem>
            <Notifications sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Push Notifications"
              secondary="Receive notifications about document updates"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          <ListItem>
            <Visibility sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Email Alerts"
              secondary="Get important updates via email"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailAlerts}
                onChange={() => handleToggle('emailAlerts')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          <ListItem>
            <DarkMode sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Dark Mode"
              secondary="Switch between light and dark theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          <ListItem>
            <Language sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Language"
              secondary="Choose your preferred language"
            />
            <ListItemSecondaryAction>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={settings.language}
                  onChange={handleLanguageChange}
                  displayEmpty
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिंदी</MenuItem>
                  <MenuItem value="ml">മലയാളം</MenuItem>
                </Select>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          <ListItem>
            <Security sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText
              primary="Auto Save"
              secondary="Automatically save document changes"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          <Button variant="outlined">Reset to Default</Button>
          <Button 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF9933, #138808)',
              color: 'white'
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};