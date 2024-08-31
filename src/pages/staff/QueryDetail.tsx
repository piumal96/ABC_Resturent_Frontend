import React from 'react';
import { Paper, Typography, Button, TextField } from '@mui/material';

const QueryDetail: React.FC = () => {
  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Query Details</Typography>
      <Typography variant="body1">Query ID: 001</Typography>
      <Typography variant="body1">Customer Name: Jane Smith</Typography>
      <Typography variant="body1">Date: 2024-08-24</Typography>
      <Typography variant="body1">Type: Reservation Issue</Typography>
      <Typography variant="body1">Details: The reservation was not confirmed.</Typography>

      <TextField
        label="Response"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        style={{ marginTop: '16px' }}
      />

      <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>
        Send Response
      </Button>
    </Paper>
  );
};

export default QueryDetail;
