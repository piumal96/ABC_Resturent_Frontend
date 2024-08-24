import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const FacilityForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [location, setLocation] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityDescription, setFacilityDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the form submission to your backend
    if (isEditMode) {
      console.log('Editing Facility:', { id, location, facilityName, facilityDescription });
    } else {
      console.log('Adding Facility:', { location, facilityName, facilityDescription });
    }
    navigate('/facilities');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          {isEditMode ? 'Edit Facility' : 'Add Facility'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Facility Name"
            variant="outlined"
            fullWidth
            required
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Facility Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={facilityDescription}
            onChange={(e) => setFacilityDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" type="submit">
              {isEditMode ? 'Update Facility' : 'Add Facility'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/facilities')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FacilityForm;
