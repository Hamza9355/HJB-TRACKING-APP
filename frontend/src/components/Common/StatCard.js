import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, unit, icon: Icon, color = '#3f51b5', trend }) => {
  return (
    <Card
      sx={{
        background: 'rgba(58, 71, 181, 0.1)',
        border: `1px solid ${color}33`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 20px ${color}44`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            {unit && (
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {unit}
              </Typography>
            )}
            {trend && (
              <Typography variant="caption" sx={{ color: trend > 0 ? '#4caf50' : '#f44336', display: 'block', mt: 0.5 }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box sx={{ color: `${color}80`, fontSize: '2.5rem' }}>
              <Icon sx={{ fontSize: 'inherit' }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
