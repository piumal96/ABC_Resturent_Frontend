import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
  Chip,
} from '@mui/material';
import { fetchUserOrders } from '@/services/api'; // Fetch user orders from the backend
import { OrderModel } from '@/models/OrderModel';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook

const UserOrderTracking: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Use the isAuthenticated flag to check login state
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setError('User not logged in.');
        setSnackbarMessage('User not logged in.');
        setSnackbarOpen(true);
        return;
      }

      try {
        const userOrders = await fetchUserOrders(); // API call without userId, session will handle it
        setOrders(userOrders);
      } catch (err: any) {
        setError(err.message || 'Error fetching orders');
        setSnackbarMessage(err.message || 'Error fetching orders');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Chip label="Pending" color="warning" />;
      case 'Confirmed':
        return <Chip label="Confirmed" color="primary" />;
      case 'Delivering':
        return <Chip label="Delivering" color="info" />;
      case 'Completed':
        return <Chip label="Completed" color="success" />;
      case 'Cancelled':
        return <Chip label="Cancelled" color="error" />;
      default:
        return <Chip label="Unknown" color="default" />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" mb={3}>
          My Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary">
            You have no orders.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Restaurant</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Delivery Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.restaurant?.name || 'Unknown'}</TableCell>
                    <TableCell>LKR{order.totalPrice.toFixed(2)}</TableCell> {/* Total Price */}
                    <TableCell>{getStatusChip(order.orderStatus)}</TableCell> {/* Order Status */}
                    <TableCell>{order.paymentStatus}</TableCell> {/* Payment Status */}
                    <TableCell>{order.deliveryAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage || 'Error fetching orders'}
        />
      </Box>
    </Layout>
  );
};

export default UserOrderTracking;
