import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { dashboardService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import AlertCard from '../../components/Common/AlertCard';
import StatCard from '../../components/Common/StatCard';
import DailySessionsChart from '../../components/Charts/DailySessionsChart';
import VehiclesChart from '../../components/Charts/VehiclesChart';
import DataTable from '../../components/Common/DataTable';
import {
  LocalShipping as TruckIcon,
  Construction as ExcavatorIcon,
  Warning as AlertIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSessionStarted = (session) => {
      console.log('Nouvelle session:', session);
      fetchDashboardData();
    };

    const handleCycleAdded = () => {
      fetchDashboardData();
    };

    socket.on('session-started', handleSessionStarted);
    socket.on('cycle-added', handleCycleAdded);

    return () => {
      socket.off('session-started', handleSessionStarted);
      socket.off('cycle-added', handleCycleAdded);
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération du dashboard:', err);
      setError('Impossible de charger le dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const overview = dashboardData?.overview || {};
  const weeklyStats = dashboardData?.weeklyStats || [];
  const vehiclesByType = dashboardData?.vehiclesByType || [];
  const recentAlerts = dashboardData?.recentAlerts || [];

  return (
    <Box className="dashboard-container" sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Tableau de Bord
        </Typography>
        <Box sx={{ color: isConnected ? '#4caf50' : '#f44336', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isConnected ? '#4caf50' : '#f44336' }} />
          {isConnected ? 'Connecté' : 'Déconnecté'}
        </Box>
      </Box>

      {error && <AlertCard type="error" title="Erreur" message={error} />}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sessions Aujourd'hui"
            value={overview.todaySessions || 0}
            unit="en cours"
            icon={TruckIcon}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sessions Actives"
            value={overview.activeSessions || 0}
            unit="en cours"
            icon={TrendIcon}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Véhicules Actifs"
            value={overview.activeVehicles || 0}
            unit="disponibles"
            icon={ExcavatorIcon}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alertes Aujourd'hui"
            value={overview.todayAlerts || 0}
            unit="signalées"
            icon={AlertIcon}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <DailySessionsChart data={weeklyStats} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <VehiclesChart data={vehiclesByType} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {recentAlerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Alertes Récentes
          </Typography>
          <DataTable
            columns={[
              { id: 'excavator_id', label: 'Pelleteuse' },
              { id: 'truck_id', label: 'Camion' },
              { id: 'alert_status', label: 'Statut' },
              { id: 'destination', label: 'Destination' },
            ]}
            data={recentAlerts.map(alert => ({
              excavator_id: alert.excavator_id?.registration_number || 'N/A',
              truck_id: alert.truck_id?.registration_number || 'N/A',
              alert_status: alert.alert_status,
              destination: alert.destination,
            }))}
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
