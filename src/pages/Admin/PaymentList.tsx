import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const paymentsData = [
  { id: 1, customer: 'John Doe', amount: 150.00, date: '2024-08-01', status: 'Completed' },
  { id: 2, customer: 'Jane Smith', amount: 75.50, date: '2024-08-02', status: 'Pending' },
  { id: 3, customer: 'Alice Johnson', amount: 200.00, date: '2024-08-03', status: 'Failed' },
];

const PaymentList: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState(paymentsData);

  const handleDetail = (id: number) => {
    navigate(`/payments/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Payment History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleDetail(payment.id)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentList;
