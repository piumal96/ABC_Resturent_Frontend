import { useState, useEffect } from 'react';
import api from '@/services/api'; // Import API functions
import { OrderModel } from '@/models/OrderModel';

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

  // Fetch orders based on search term and status filter
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.fetchOrders(searchTerm, statusFilter); // API call from api.ts
      setOrders(response.orders);
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
        await api.updateOrderStatus(selectedOrder._id, 'Confirmed');
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
        await api.updatePaymentStatus(selectedOrder._id, 'Paid');
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
        await api.updateOrderStatus(selectedOrder._id, 'Cancelled');
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
