import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderModel } from '@/models/OrderModel'; // Define OrderModel in your models
import { CartModel } from '@/services/api';
const API_URL = 'http://localhost:5001/api/orders';

export const useOrderController = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?searchTerm=${searchTerm}&status=${statusFilter}`);
      setOrders(response.data.orders);
    } catch (error) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (order: OrderModel) => {
    setSelectedOrder(order);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmOrder = async () => {
    if (selectedOrder) {
      try {
        await axios.put(`${API_URL}/status`, { orderId: selectedOrder._id, status: 'Confirmed' });
        setSnackbarMessage('Order confirmed successfully');
        fetchOrders(); // Refresh orders
      } catch (error) {
        setSnackbarMessage('Error confirming order');
      } finally {
        setConfirmDialogOpen(false);
        setSnackbarOpen(true);
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (selectedOrder) {
      try {
        await axios.put(`${API_URL}/status`, { orderId: selectedOrder._id, paymentStatus: 'Paid' });
        setSnackbarMessage('Payment confirmed successfully');
        fetchOrders(); // Refresh orders
      } catch (error) {
        setSnackbarMessage('Error confirming payment');
      } finally {
        setConfirmDialogOpen(false);
        setSnackbarOpen(true);
      }
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      try {
        await axios.put(`${API_URL}/status`, { orderId: selectedOrder._id, status: 'Cancelled' });
        setSnackbarMessage('Order cancelled successfully');
        fetchOrders(); // Refresh orders
      } catch (error) {
        setSnackbarMessage('Error cancelling order');
      } finally {
        setConfirmDialogOpen(false);
        setSnackbarOpen(true);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const displayedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return {
    orders,
    searchTerm,
    statusFilter,
    loading,
    error,
    page,
    rowsPerPage,
    confirmDialogOpen,
    selectedOrder,
    snackbarOpen,
    snackbarMessage,
    setSearchTerm,
    setStatusFilter,
    handleDetail,
    handleCloseConfirmDialog,
    handleConfirmOrder,
    handleCancelOrder,
    handleConfirmPayment,
    handleChangePage,
    handleChangeRowsPerPage,
    displayedOrders,
    handleSnackbarClose,
  };
};
