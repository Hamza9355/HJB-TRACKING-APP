import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const AlertCard = ({ type = 'info', title, message, icon, onClose }) => {
  const icons = {
    error: <ErrorIcon sx={{ color: '#f44336' }} />,
    warning: <WarningIcon sx={{ color: '#ff9800' }} />,
    success: <SuccessIcon sx={{ color: '#4caf50' }} />,
    info: <InfoIcon sx={{ color: '#2196f3' }} />,
  };

  return (
    <Alert
      severity={type}
      onClose={onClose}
      icon={icon || icons[type]}
      sx={{
        mb: 2,
        borderRadius: 2,
        background: type === 'error' ? 'rgba(244, 67, 54, 0.1)' : 
                   type === 'warning' ? 'rgba(255, 152, 0, 0.1)' :
                   type === 'success' ? 'rgba(76, 175, 80, 0.1)' :
                   'rgba(33, 150, 243, 0.1)',
      }}
    >
      {title && <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>}
      {message && <Typography variant="body2">{message}</Typography>}
    </Alert>
  );
};

export default AlertCard;
