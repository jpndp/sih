import React from 'react';
import { CircularProgress } from '@mui/material';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <CircularProgress />
    </div>
  );
};