import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

const ReservationDetail: React.FC = () => {
  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Reservation Details</Typography>
      <Typography variant="body1">Reservation ID: 001</Typography>
      <Typography variant="body1">Customer Name: John Doe</Typography>
      <Typography variant="body1">Date: 2024-08-24</Typography>
      <Typography variant="body1">Status: Confirmed</Typography>

      <Button variant="contained" color="secondary" style={{ marginTop: '16px' }}>
        Update Status
      </Button>
    </Paper>
  );
};

export default ReservationDetail;
