import React, { useState, useEffect } from 'react';
import ReservationDetailModel from '@/models/ReservationDetailModel';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
  Dialog as ConfirmDialog,
  DialogContentText,
  SelectChangeEvent,
} from '@mui/material';
import { getReservationsByUserId, deleteReservation, updateReservation } from '@/services/api'; // Import both deleteReservation and updateReservation
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';

interface ReservationTrackingDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ReservationTrackingDialog: React.FC<ReservationTrackingDialogProps> = ({ open, onClose, userId }) => {
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Track snackbar message
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const fetchedReservations = await getReservationsByUserId(userId);
        setReservations(fetchedReservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reservations. Please try again later.');
        setLoading(false);
      }
    };

    if (open) {
      loadReservations();
    }
  }, [open, userId]);

  const handleCloseReservation = (reservationId: string) => {
    setConfirmDialogOpen(true);
    setSelectedReservationId(reservationId);
  };

  const handleConfirmCloseReservation = async () => {
    if (selectedReservationId) {
      const reservationToCancel = reservations.find(res => res._id === selectedReservationId);

      if (reservationToCancel?.status === 'Confirmed') {
        // If the status is already Confirmed, show a message to contact the office
        setSnackbarMessage('This reservation is already confirmed. Please contact our office to make changes.');
        setSnackbarOpen(true);
      } else {
        try {
          // First, update the reservation status to "Cancelled"
          const updateData = { status: 'Cancelled' };
          const updatedReservation = await updateReservation(selectedReservationId, updateData);

          // Optionally, delete the reservation after updating its status
          await deleteReservation(selectedReservationId);

          // Update the local state by removing the reservation
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

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredReservations = reservations.filter((reservation) =>
    filter === 'all' ? true : reservation.status === filter
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Track Reservations</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reservations.length === 0 ? (
          <Typography>No reservations found.</Typography>
        ) : (
          <>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Reservations</Typography>
              <Select value={filter} onChange={handleFilterChange} displayEmpty>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </Box>
            <List>
              {filteredReservations.map((reservation) => (
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
                      Close Reservation
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>

      {/* Confirmation Dialog */}
      <ConfirmDialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Close Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to close this reservation? This action cannot be undone.
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

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage} // Use the snackbarMessage state
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Dialog>
  );
};

export default ReservationTrackingDialog;
