'use client';

import React, { useEffect, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { removeSnackbar } from '../../store/slices/notificationsSlice';

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { snackbars } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    // Auto-hide snackbars
    snackbars.forEach((snackbar) => {
      if (snackbar.autoHide && snackbar.hideDelay) {
        const timer = setTimeout(() => {
          dispatch(removeSnackbar(snackbar.id));
        }, snackbar.hideDelay);

        return () => clearTimeout(timer);
      }
    });
  }, [snackbars, dispatch]);

  const handleClose = (snackbarId: string) => {
    dispatch(removeSnackbar(snackbarId));
  };

  return (
    <>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={() => handleClose(snackbar.id)}
        >
          <Alert
            onClose={() => handleClose(snackbar.id)}
            severity={snackbar.type}
            variant="filled"
            sx={{ width: '100%', maxWidth: 400 }}
          >
            <AlertTitle>{snackbar.title}</AlertTitle>
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};