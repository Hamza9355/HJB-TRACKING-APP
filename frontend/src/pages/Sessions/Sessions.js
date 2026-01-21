import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sessionService } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import AlertCard from '../../components/Common/AlertCard';
import DataTable from '../../components/Common/DataTable';
import { Add as AddIcon } from '@mui/icons-material';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '' });
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    fetchSessions();
  }, [page, filters]);

  useEffect(() => {
    if (!socket) return;

    socket.on('session-started', () => {
      fetchSessions();
      toast.success('Nouvelle session créée');
    });

    socket.on('session-update', () => {
      fetchSessions();
    });

    return () => {
      socket.off('session-started');
      socket.off('session-update');
    };
  }, [socket]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (filters.status) params.status = filters.status;

      const response = await sessionService.getAll(params);
      setSessions(response.data.sessions);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des sessions:', err);
      setError('Impossible de charger les sessions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Sessions de Chargement
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sessions/new')}
          sx={{
            bgcolor: '#ff9800',
            '&:hover': { bgcolor: '#f57c00' },
          }}
        >
          Nouvelle Session
        </Button>
      </Box>

      {error && <AlertCard type="error" title="Erreur" message={error} />}

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          label="Filtrer par statut"
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setPage(1);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="OK">OK</MenuItem>
          <MenuItem value="EN_COURS">En Cours</MenuItem>
          <MenuItem value="WARNING_LOAD">Alerte Chargement</MenuItem>
          <MenuItem value="WARNING_THEFT">Alerte Vol</MenuItem>
        </TextField>
      </Box>

      <DataTable
        columns={[
          { id: 'excavator_id', label: 'Pelleteuse' },
          { id: 'truck_id', label: 'Camion' },
          { id: 'alert_status', label: 'Statut' },
          { id: 'destination', label: 'Destination' },
          { id: 'operator_name', label: 'Opérateur' },
        ]}
        data={sessions.map((session) => ({
          ...session,
          excavator_id: session.excavator_id?.registration_number || 'N/A',
          truck_id: session.truck_id?.registration_number || 'N/A',
        }))}
        onRowClick={(row) => navigate(`/sessions/${row._id}`)}
      />
    </Box>
  );
};

export default Sessions;
