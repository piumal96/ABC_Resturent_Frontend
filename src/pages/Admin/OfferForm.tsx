import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const OfferForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the form submission to your backend
    if (isEditMode) {
      console.log('Editing Offer:', { id, offerName, offerDescription });
    } else {
      console.log('Adding Offer:', { offerName, offerDescription });
    }
    navigate('/offers');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          {isEditMode ? 'Edit Offer' : 'Add Offer'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Offer Name"
            variant="outlined"
            fullWidth
            required
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Offer Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            value={offerDescription}
            onChange={(e) => setOfferDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" type="submit">
              {isEditMode ? 'Update Offer' : 'Add Offer'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/offers')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OfferForm;
