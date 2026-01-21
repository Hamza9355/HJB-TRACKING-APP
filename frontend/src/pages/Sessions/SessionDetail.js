import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sessionService, cycleService } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import AlertCard from '../../components/Common/AlertCard';
import StatCard from '../../components/Common/StatCard';
import DataTable from '../../components/Common/DataTable';
import { ArrowBack as BackIcon } from '@mui/icons-material';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cycleInput, setCycleInput] = useState({
    bucket_weight: 0,
    travel_distance: 0,
    material_type: 'GRAVIER',
  });
  const { socket, joinSession } = useSocket();

  useEffect(() => {
    fetchSessionDetail();
    if (id) joinSession(id);
  }, [id, joinSession]);

  useEffect(() => {
    if (!socket) return;

    socket.on('session-update', (updatedSession) => {
      setSessionData(updatedSession);
    });

    return () => {
      socket.off('session-update');
    };
  }, [socket]);

  const fetchSessionDetail = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getById(id);
      setSessionData(response.data.session);
      setCycles(response.data.cycles);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger la session');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCycle = async () => {
    try {
      if (!cycleInput.bucket_weight) {
        toast.error('Veuillez entrer le poids du seau');
        return;
      }
      await sessionService.addCycle(id, cycleInput);
      toast.success('Cycle ajouté');
      fetchSessionDetail();
      setCycleInput({ bucket_weight: 0, travel_distance: 0, material_type: 'GRAVIER' });
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du cycle');
    }
  };

  const handleRecordDeparture = async () => {
    const weight = prompt('Poids du camion (kg):');
    if (weight) {
      try {
        await sessionService.recordDeparture(id, { total_weight_truck_start: Number(weight) });
        toast.success('Départ enregistré');
        fetchSessionDetail();
      } catch (err) {
        toast.error('Erreur lors de l\'enregistrement');
      }
    }
  };

  const handleRecordArrival = async () => {
    const weight = prompt('Poids du camion (kg):');
    if (weight) {
      try {
        await sessionService.recordArrival(id, { total_weight_truck_arrival: Number(weight) });
        toast.success('Arrivée enregistrée');
        fetchSessionDetail();
      } catch (err) {
        toast.error('Erreur lors de l\'enregistrement');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!sessionData) return <AlertCard type="error" message="Session non trouvée" />;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/sessions')}
        sx={{ mb: 2, color: '#ff9800' }}
      >
        Retour
      </Button>

      {error && <AlertCard type="error" message={error} />}

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Détail de la Session
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Pelleteuse"
            value={sessionData.excavator_id?.registration_number}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Camion"
            value={sessionData.truck_id?.registration_number}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Poids Total (Excavateur)"
            value={`${(sessionData.total_weight_excavator / 1000).toFixed(1)} t`}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Statut"
            value={sessionData.alert_status}
            color={sessionData.alert_status === 'OK' ? '#4caf50' : '#f44336'}
          />
        </Grid>
      </Grid>

      <Card sx={{ background: 'rgba(26, 35, 126, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', mt: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ajouter Cycle
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Poids du seau (kg)"
                type="number"
                value={cycleInput.bucket_weight}
                onChange={(e) => setCycleInput({ ...cycleInput, bucket_weight: Number(e.target.value) })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Distance (m)"
                type="number"
                value={cycleInput.travel_distance}
                onChange={(e) => setCycleInput({ ...cycleInput, travel_distance: Number(e.target.value) })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Type de matériau"
                value={cycleInput.material_type}
                onChange={(e) => setCycleInput({ ...cycleInput, material_type: e.target.value })}
                size="small"
              >
                <option value="GRAVIER">Gravier</option>
                <option value="SABLE">Sable</option>
                <option value="TERRE">Terre</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddCycle}
                sx={{ bgcolor: '#4caf50', height: '40px' }}
              >
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRecordDeparture}
          disabled={!sessionData.is_active}
          sx={{ bgcolor: '#2196f3' }}
        >
          Enregistrer Départ
        </Button>
        <Button
          variant="contained"
          onClick={handleRecordArrival}
          disabled={!sessionData.is_active}
          sx={{ bgcolor: '#f44336' }}
        >
          Enregistrer Arrivée
        </Button>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Cycles ({cycles.length})
      </Typography>
      <DataTable
        columns={[
          { id: 'bucket_weight', label: 'Poids (kg)' },
          { id: 'travel_distance', label: 'Distance (m)' },
          { id: 'material_type', label: 'Matériau' },
          { id: 'timestamp', label: 'Heure' },
        ]}
        data={cycles.map((cycle) => ({
          ...cycle,
          timestamp: new Date(cycle.timestamp).toLocaleTimeString(),
        }))}
      />
    </Box>
  );
};

export default SessionDetail;
