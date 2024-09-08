import React from 'react';
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
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useReservationTrackingController } from '@/controllers/Customer/TrackingControllerDialog';

interface ReservationTrackingDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ReservationTrackingDialog: React.FC<ReservationTrackingDialogProps> = ({ open, onClose, userId }) => {
  const {
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
  } = useReservationTrackingController(userId);

  const getStatusChip = (status: string) => {
    const statusMap: Record<string, JSX.Element> = {
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
        <Tabs value={tabIndex} onChange={(e, newValue) => handleTabChange(newValue)} centered>
          <Tab label="Delivery Orders" />
          <Tab label="Reservations" />
        </Tabs>

        <Box display="flex" flexDirection="column" minHeight="300px" justifyContent="space-between">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : tabIndex === 0 ? (
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
                          <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
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
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="h6">Reservations</Typography>
                <Box display="flex" alignItems="center">
                  <FilterListIcon />
                  <Select value={filter} onChange={(e) => handleFilterChange(e.target.value)} displayEmpty sx={{ ml: 1, minWidth: 120 }}>
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
                              <Badge badgeContent={reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)} color={reservation.status === 'confirmed' ? 'success' : 'warning'} />
                            </>
                          }
                        />
                        <Box display="flex" flexDirection="column" alignItems="flex-end" ml={2}>
                          <Button variant="contained" color="secondary" onClick={() => handleCloseReservation(reservation._id)}>
                            Cancel Reservation
                          </Button>
                        </Box>
                      </ListItem>
                    ))}
                </List>
              )}
            </Box>
          )}
        </Box>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage || 'Error fetching data'} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>

      <ConfirmDialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Close Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to cancel this reservation? This action cannot be undone.</DialogContentText>
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
