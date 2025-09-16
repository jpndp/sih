'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { loginAsync } from '../../store/slices/authSlice';
import {
  Box,
  CardContent,
  Collapse,
  Tooltip,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  IconButton,
  Avatar,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Info, Train, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                backgroundImage: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
                color: 'black',
                p: 3,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Train sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                KMRL
              </Typography>
              <Typography variant="subtitle1">Document Processing System</Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom textAlign="center">
                Sign In
              </Typography>

              <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                Access your document processing dashboard
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Box>

              {/* Demo Credentials */}
              <Box sx={{ mt: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Demo Credentials
                  </Typography>
                  <Tooltip title="Show demo credentials">
                    <IconButton size="small" onClick={() => setDemoOpen(!demoOpen)}>
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Collapse in={demoOpen}>
                  <Box mt={1} p={2} bgcolor="grey.50" borderRadius={1}>
                    <Typography variant="body2">
                      <strong>Admin:</strong> admin@kmrl.co.in / admin
                    </Typography>
                    <Typography variant="body2">
                      <strong>Engineer:</strong> engineer@kmrl.co.in / engineer
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            </CardContent>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};
