import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Select,
  MenuItem,
  IconButton,
  Dialog as ConfirmDialog,
  DialogContentText,
  SelectChangeEvent,
} from '@mui/material';
import { fetchUserOrders, getReservationsByUserId, updateReservation, deleteReservation } from '@/services/api';
import { OrderModel } from '@/models/OrderModel';
import ReservationDetailModel from '@/models/ReservationDetailModel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

interface ReservationTrackingDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ReservationTrackingDialog: React.FC<ReservationTrackingDialogProps> = ({ open, onClose, userId }) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0); // Tab index to switch between orders and reservations
  const [filter, setFilter] = useState<string>('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userOrders, userReservations] = await Promise.all([
          fetchUserOrders(), // Fetch delivery orders
          getReservationsByUserId(userId), // Fetch reservations
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string);
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

  // Define the type of status to prevent the dynamic key error
  type StatusType = 'Pending' | 'Confirmed' | 'Delivering' | 'Completed' | 'Cancelled';

  const getStatusChip = (status: StatusType) => {
    const statusMap: Record<StatusType, JSX.Element> = {
      Pending: <Chip label="Pending" color="warning" />,
      Confirmed: <Chip label="Confirmed" color="primary" />,
      Delivering: <Chip label="Delivering" color="info" />,
      Completed: <Chip label="Completed" color="success" />,
      Cancelled: <Chip label="Cancelled" color="error" />,
    };
    return statusMap[status];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Track Orders & Reservations
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* Improved Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Delivery Orders" />
          <Tab label="Reservations" />
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : tabIndex === 0 ? (
          // Order Tracking Tab
          <Box>
            {orders.length === 0 ? (
              <Typography variant="body1" align="center" color="textSecondary" mt={2}>
                You have no orders.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
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
                        <TableCell>{order.restaurant?.name || 'Unknown'}</TableCell>
                        <TableCell>LKR {order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{getStatusChip(order.orderStatus as StatusType)}</TableCell>
                        <TableCell>{order.paymentStatus}</TableCell>
                        <TableCell>{order.deliveryAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ) : (
          // Reservation Tracking Tab with Cancel Functionality
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="h6">Reservations</Typography>
              <Box display="flex" alignItems="center">
                <FilterListIcon />
                <Select
                  value={filter}
                  onChange={handleFilterChange}
                  displayEmpty
                  sx={{ ml: 1, minWidth: 120 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </Box>
            </Box>
            {reservations.length === 0 ? (
              <Typography variant="body1" align="center" color="textSecondary" mt={2}>
                You have no reservations.
              </Typography>
            ) : (
              <List>
                {reservations
                  .filter((reservation) => filter === 'all' || reservation.status === filter)
                  .map((reservation) => (
                    <ListItem key={reservation._id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <AccountCircleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Reservation for ${reservation.customer?.username || 'Customer Name'}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              Date: {new Date(reservation.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="textPrimary">
                              Time: {new Date(reservation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <br />
                            <Badge
                              badgeContent={reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              color={reservation.status === 'confirmed' ? 'success' : 'warning'}
                            />
                          </>
                        }
                      />
                      <Box display="flex" flexDirection="column" alignItems="flex-end" ml={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCloseReservation(reservation._id)}
                        >
                          Cancel Reservation
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            )}
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage || 'Error fetching data'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>

      {/* Confirmation Dialog */}
      <ConfirmDialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Close Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmCloseReservation} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </Dialog>
  );
};

export default ReservationTrackingDialog;
