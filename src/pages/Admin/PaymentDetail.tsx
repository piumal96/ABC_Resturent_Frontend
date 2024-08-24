import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';

const paymentDetails = {
  1: { customer: 'John Doe', amount: 150.00, date: '2024-08-01', status: 'Completed', method: 'Credit Card', reference: 'INV123456' },
  2: { customer: 'Jane Smith', amount: 75.50, date: '2024-08-02', status: 'Pending', method: 'PayPal', reference: 'INV123457' },
  3: { customer: 'Alice Johnson', amount: 200.00, date: '2024-08-03', status: 'Failed', method: 'Bank Transfer', reference: 'INV123458' },
};

const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Safely cast id to a numeric type
  const numericId = id as unknown as 1 | 2 | 3;

  const payment = paymentDetails[numericId];

  if (!payment) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Payment not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/payments')}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Payment Details
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Customer:</strong> {payment.customer}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Amount:</strong> ${payment.amount.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Date:</strong> {payment.date}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Status:</strong> {payment.status}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Payment Method:</strong> {payment.method}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Reference Number:</strong> {payment.reference}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/payments')}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentDetail;
