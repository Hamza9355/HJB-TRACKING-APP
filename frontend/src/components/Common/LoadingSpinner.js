import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <CircularProgress size={size} sx={{ color: '#ff9800' }} />
    </Box>
  );
};

export default LoadingSpinner;
