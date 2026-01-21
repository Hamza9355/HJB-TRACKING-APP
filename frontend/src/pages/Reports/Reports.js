import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { FileDownload as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';

const Reports = () => {
  const handleDownload = (format) => {
    alert(`Télécharger le rapport en format ${format}`);
  };

  const reportTypes = [
    {
      title: 'Rapport Journalier',
      description: 'Résumé des sessions de la journée',
      icon: '📅',
    },
    {
      title: 'Rapport Mensuel',
      description: 'Analyse des performances mensuelles',
      icon: '📊',
    },
    {
      title: 'Alertes',
      description: 'Rapport des alertes et anomalies',
      icon: '⚠️',
    },
    {
      title: 'Véhicules',
      description: 'État et utilisation des véhicules',
      icon: '🚛',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Rapports
      </Typography>

      <Grid container spacing={3}>
        {reportTypes.map((report, index) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
            <Card
              sx={{
                background: 'rgba(26, 35, 126, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {report.icon}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {report.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  {report.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload('PDF')}
                    sx={{ color: '#3f51b5' }}
                  >
                    PDF
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload('Excel')}
                    sx={{ color: '#4caf50' }}
                  >
                    Excel
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{ color: '#ff9800' }}
                  >
                    Imprimer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          background: 'rgba(26, 35, 126, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Planification des Rapports
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Vous pouvez planifier des rapports automatiques pour être envoyés par email à une fréquence définie.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: '#ff9800' }}
            onClick={() => alert('Fonctionnalité bientôt disponible')}
          >
            Planifier un Rapport
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
