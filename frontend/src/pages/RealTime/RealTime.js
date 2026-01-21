import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { Videocam as CameraIcon } from '@mui/icons-material';

const RealTime = () => {
  const { socket, isConnected } = useSocket();
  const [realtimeData, setRealtimeData] = useState({
    activeSessionCount: 0,
    lastUpdate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleSessionStarted = (session) => {
      console.log('Nouvelle session en temps réel:', session);
      setRealtimeData(prev => ({
        ...prev,
        activeSessionCount: prev.activeSessionCount + 1,
        lastUpdate: new Date(),
      }));
    };

    const handleCycleAdded = (data) => {
      console.log('Cycle ajouté en temps réel:', data);
      setRealtimeData(prev => ({
        ...prev,
        lastUpdate: new Date(),
      }));
    };

    socket.on('session-started', handleSessionStarted);
    socket.on('cycle-added', handleCycleAdded);
    socket.on('session-completed', () => {
      setRealtimeData(prev => ({
        ...prev,
        activeSessionCount: Math.max(0, prev.activeSessionCount - 1),
        lastUpdate: new Date(),
      }));
    });

    return () => {
      socket.off('session-started', handleSessionStarted);
      socket.off('cycle-added', handleCycleAdded);
      socket.off('session-completed');
    };
  }, [socket]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Suivi en Temps Réel
        </Typography>
        <Box sx={{ color: isConnected ? '#4caf50' : '#f44336', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isConnected ? '#4caf50' : '#f44336', animation: 'pulse 2s infinite' }} />
          {isConnected ? 'En ligne' : 'Hors ligne'}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Sessions Actives"
            value={realtimeData.activeSessionCount}
            unit="en cours"
            icon={CameraIcon}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Dernière mise à jour
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {realtimeData.lastUpdate.toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Flux en Direct
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Les mises à jour en temps réel s'affichent ici via WebSocket
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1, minHeight: '300px', fontFamily: 'monospace', color: '#4caf50', fontSize: '0.875rem', overflowY: 'auto' }}>
            <Typography>Connexion WebSocket établie: {isConnected ? 'OUI' : 'NON'}</Typography>
            <Typography>Dernière mise à jour: {realtimeData.lastUpdate.toISOString()}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RealTime;
