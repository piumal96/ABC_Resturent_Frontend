import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

const PaymentDetail: React.FC = () => {
  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Payment Details</Typography>
      <Typography variant="body1">Payment ID: 001</Typography>
      <Typography variant="body1">Customer Name: John Doe</Typography>
      <Typography variant="body1">Date: 2024-08-24</Typography>
      <Typography variant="body1">Amount: $50</Typography>
      <Typography variant="body1">Status: Completed</Typography>

      <Button variant="contained" color="secondary" style={{ marginTop: '16px' }}>
        Refund Payment
      </Button>
    </Paper>
  );
};

export default PaymentDetail;
