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
  SelectChangeEvent, // Import this type
} from '@mui/material';
import { getReservationsByUserId, deleteReservation } from '@/services/api'; // Import deleteReservation function
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
      try {
        await deleteReservation(selectedReservationId);
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation._id !== selectedReservationId)
        );
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to delete reservation:', err);
      } finally {
        setConfirmDialogOpen(false);
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
                          badgeContent={reservation.status === 'confirmed' ? 'Confirmed' : 'Pending'}
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
        message="Reservation closed successfully"
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
