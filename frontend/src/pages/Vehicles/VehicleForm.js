import React, { useState } from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from '@mui/material';

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(vehicle || {
    type: '',
    registration_number: '',
    model: '',
    capacity: 0,
    manufacturer: '',
    status: 'ACTIF',
    year: new Date().getFullYear(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['capacity', 'year'].includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.registration_number) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <DialogTitle>
        {vehicle ? 'Modifier Véhicule' : 'Ajouter Véhicule'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="CAMION">Camion</MenuItem>
            <MenuItem value="PELLETEUSE">Pelleteuse</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Immatriculation"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Modèle"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Capacité (kg)"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Fabricant"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Année"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="ACTIF">Actif</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
            <MenuItem value="HORS_SERVICE">Hors Service</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#ff9800' }}>
          {vehicle ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </>
  );
};

export default VehicleForm;
