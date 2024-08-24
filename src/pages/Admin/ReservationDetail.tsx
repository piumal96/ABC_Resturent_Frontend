import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const reservationDetails: { [key: string]: { name: string; date: string; time: string; type: string; details: string } } = {
  '1': { name: 'John Doe', date: '2024-09-01', time: '19:00', type: 'Dine-In', details: 'Table for 2, near the window.' },
  '2': { name: 'Jane Smith', date: '2024-09-02', time: '12:00', type: 'Delivery', details: 'Deliver to 123 Main St.' },
  '3': { name: 'Alice Johnson', date: '2024-09-03', time: '18:30', type: 'Dine-In', details: 'Birthday celebration, need a cake.' },
};

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const reservation = id ? reservationDetails[id] : undefined;

  if (!reservation) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" color="error">
          Reservation not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          Reservation Details
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Name:</strong> {reservation.name}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Date:</strong> {reservation.date}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Time:</strong> {reservation.time}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Type:</strong> {reservation.type}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Details:</strong> {reservation.details}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/reservations')}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReservationDetail;
