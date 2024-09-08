import { useState, useEffect } from 'react';
import { fetchUserOrders, getReservationsByUserId, updateReservation, deleteReservation } from '@/services/api';
import { OrderModel } from '@/models/OrderModel';
import ReservationDetailModel from '@/models/ReservationDetailModel';

export const useReservationTrackingController = (userId: string) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userOrders, userReservations] = await Promise.all([
          fetchUserOrders(),
          getReservationsByUserId(userId),
        ]);
        setOrders(userOrders);
        setReservations(userReservations);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        setSnackbarMessage(err.message || 'Error fetching data');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleTabChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleCloseReservation = (reservationId: string) => {
    setConfirmDialogOpen(true);
    setSelectedReservationId(reservationId);
  };

  const handleConfirmCloseReservation = async () => {
    if (selectedReservationId) {
      const reservationToCancel = reservations.find(res => res._id === selectedReservationId);
      if (reservationToCancel?.status === 'Confirmed') {
        setSnackbarMessage('This reservation is already confirmed. Please contact our office to make changes.');
        setSnackbarOpen(true);
      } else {
        try {
          const updateData = { status: 'Cancelled' };
          await updateReservation(selectedReservationId, updateData);
          await deleteReservation(selectedReservationId);

          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation._id !== selectedReservationId)
          );

          setSnackbarMessage('Reservation closed and deleted successfully');
          setSnackbarOpen(true);
        } catch (err) {
          console.error('Failed to update or delete reservation:', err);
        } finally {
          setConfirmDialogOpen(false);
        }
      }
    }
  };

  return {
    orders,
    reservations,
    loading,
    error,
    tabIndex,
    filter,
    snackbarOpen,
    snackbarMessage,
    confirmDialogOpen,
    handleTabChange,
    handleFilterChange,
    handleCloseReservation,
    handleConfirmCloseReservation,
    setSnackbarOpen,
    setConfirmDialogOpen,
  };
};
