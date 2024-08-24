import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the form submission to your backend
    if (isEditMode) {
      console.log('Editing Service:', { id, serviceName, serviceDescription });
    } else {
      console.log('Adding Service:', { serviceName, serviceDescription });
    }
    navigate('/services');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          {isEditMode ? 'Edit Service' : 'Add Service'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Service Name"
            variant="outlined"
            fullWidth
            required
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Service Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" type="submit">
              {isEditMode ? 'Update Service' : 'Add Service'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/services')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServiceForm;
