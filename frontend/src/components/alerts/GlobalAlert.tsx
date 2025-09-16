'use client';

import { useState, useEffect } from 'react';
import { Alert, Collapse, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearAlert } from '../../store/slices/uiSlice';

export const GlobalAlert = () => {
  const { alert } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(100);

  const handleClose = () => {
    dispatch(clearAlert());
  };

  useEffect(() => {
    if (alert && alert.autoHide !== false) {
      const duration = alert.duration || 5000; // Default 5 seconds
      const startTime = Date.now();
      const endTime = startTime + duration;

      const timer = setInterval(() => {
        const now = Date.now();
        if (now >= endTime) {
          clearInterval(timer);
          handleClose();
        } else {
          const remaining = endTime - now;
          const percentage = (remaining / duration) * 100;
          setProgress(percentage);
        }
      }, 10);

      return () => {
        clearInterval(timer);
        setProgress(100);
      };
    }
  }, [alert]);

  const getAlertColor = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return '#138808'; // Indian flag green
      case 'error':
        return '#FF9933'; // Indian flag saffron
      case 'warning':
        return '#FF9933'; // Indian flag saffron
      case 'info':
      default:
        return '#000080'; // Navy blue (similar to Ashoka Chakra)
    }
  };

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              p: 1,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Collapse in={Boolean(alert)}>
              <Box position="relative">
                <Alert
                  severity={alert?.type || 'info'}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleClose}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{
                    '& .MuiAlert-message': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    },
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                    },
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {alert?.message}
                </Alert>
                {alert.autoHide !== false && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: `${progress}%`,
                      height: 2,
                      bgcolor: getAlertColor(alert.type),
                      transition: 'width 10ms linear',
                    }}
                  />
                )}
              </Box>
            </Collapse>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};