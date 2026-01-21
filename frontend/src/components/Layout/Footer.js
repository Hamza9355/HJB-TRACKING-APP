import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#0a1929',
        color: 'rgba(255, 255, 255, 0.7)',
        py: 3,
        mt: 6,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1fr 1fr' }, gap: 3, mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
              HJB Tracking System
            </Typography>
            <Typography variant="body2">
              Système de suivi et de gestion du chargement de matériaux
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Navigation
            </Typography>
            <Typography variant="body2" component="div">Dashboard</Typography>
            <Typography variant="body2" component="div">Véhicules</Typography>
            <Typography variant="body2" component="div">Sessions</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Support
            </Typography>
            <Typography variant="body2" component="div">Documentation</Typography>
            <Typography variant="body2" component="div">Contact</Typography>
            <Typography variant="body2" component="div">Assistance</Typography>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 2 }}>
          <Typography variant="body2" align="center">
            © 2024 HJB Technologie. Tous droits réservés. | v1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
