// components/ReservationTrackingDialog.tsx
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
  ListItemText,
} from '@mui/material';
import { getReservationsByUserId } from '@/services/api';

interface ReservationTrackingDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ReservationTrackingDialog: React.FC<ReservationTrackingDialogProps> = ({ open, onClose, userId }) => {
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    console.log(`Closing reservation with ID: ${reservationId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          <List>
            {reservations.map((reservation) => (
              <ListItem key={reservation._id}>
                <ListItemText
                  primary={`Reservation for ${reservation.customer.username}`}
                  secondary={`Date: ${new Date(reservation.date).toLocaleDateString()}, Time: ${reservation.time}, Status: ${reservation.status}`}
                />
                <Button variant="contained" color="secondary" onClick={() => handleCloseReservation(reservation._id)}>
                  Close Reservation
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationTrackingDialog;
