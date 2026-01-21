import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { vehicleService } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import AlertCard from '../../components/Common/AlertCard';
import DataTable from '../../components/Common/DataTable';
import VehicleForm from './VehicleForm';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '' });
  const { socket } = useSocket();

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  useEffect(() => {
    if (!socket) return;

    socket.on('vehicle-added', (vehicle) => {
      fetchVehicles();
      toast.success('Nouveau véhicule ajouté');
    });

    socket.on('vehicle-updated', (vehicle) => {
      fetchVehicles();
      toast.success('Véhicule mis à jour');
    });

    socket.on('vehicle-deleted', (vehicleId) => {
      fetchVehicles();
      toast.success('Véhicule supprimé');
    });

    return () => {
      socket.off('vehicle-added');
      socket.off('vehicle-updated');
      socket.off('vehicle-deleted');
    };
  }, [socket]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;

      const response = await vehicleService.getAll(params);
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des véhicules:', err);
      setError('Impossible de charger les véhicules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await vehicleService.delete(id);
        toast.success('Véhicule supprimé');
        fetchVehicles();
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleOpenDialog = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVehicle(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVehicle) {
        await vehicleService.update(editingVehicle._id, formData);
        toast.success('Véhicule mis à jour');
      } else {
        await vehicleService.create(formData);
        toast.success('Véhicule créé');
      }
      handleCloseDialog();
      fetchVehicles();
    } catch (err) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gestion des Véhicules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#ff9800',
            '&:hover': { bgcolor: '#f57c00' },
          }}
        >
          Ajouter Véhicule
        </Button>
      </Box>

      {error && <AlertCard type="error" title="Erreur" message={error} />}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            label="Type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            size="small"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="CAMION">Camion</MenuItem>
            <MenuItem value="PELLETEUSE">Pelleteuse</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            label="Statut"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            size="small"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="ACTIF">Actif</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
            <MenuItem value="HORS_SERVICE">Hors Service</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <DataTable
        columns={[
          { id: 'registration_number', label: 'Immatriculation' },
          { id: 'type', label: 'Type' },
          { id: 'model', label: 'Modèle' },
          { id: 'status', label: 'Statut' },
          { id: 'actions', label: 'Actions' },
        ]}
        data={vehicles.map((vehicle) => ({
          ...vehicle,
          actions: (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(vehicle)}
                sx={{ color: '#3f51b5' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(vehicle._id)}
                sx={{ color: '#f44336' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ),
        }))}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </Box>
  );
};

export default Vehicles;
