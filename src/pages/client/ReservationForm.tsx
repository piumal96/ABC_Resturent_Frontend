import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useReservation } from '@/context/ReservationContext';
import { fetchRestaurants, fetchServices } from '@/services/api';
import RestaurantModel from '@/models/RestaurantModel';
import ServiceModel from '@/models/ServiceModel';
import ReservationModel from '@/models/ReservationModel';  // Import ReservationModel
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ReservationForm: React.FC = () => {
  const [restaurant, setRestaurant] = useState<string>('');
  const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
  const [service, setService] = useState<string>('');
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Dine-in');
  const [specialRequests, setSpecialRequests] = useState('');
  const [feedback, setFeedback] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false); // State for managing the dialog

  const { user, isAuthenticated } = useAuth();
  const { createReservation } = useReservation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    const loadRestaurantsAndServices = async () => {
      try {
        const fetchedRestaurants = await fetchRestaurants();
        setRestaurants(fetchedRestaurants);

        const fetchedServices = await fetchServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    loadRestaurantsAndServices();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!user) {
        throw new Error('You must be logged in to make a reservation.');
      }

      const reservationData: ReservationModel = {
        id: '',  // Default value; backend might generate this
        customer: user.id,  // Assuming customer is the logged-in user
        restaurant,
        service,
        date,
        time,
        type,
        specialRequests,
        status: 'Pending',  // Default status; backend might override this
        createdAt: '',  // Default value; backend might generate this
      };

      await createReservation(reservationData);
      setFeedback('Reservation created successfully!');
      setDialogOpen(true); // Open the dialog after successful reservation
    } catch (error) {
      setFeedback('Failed to create reservation. Please try again.');
      console.error('Error creating reservation:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/'); // Navigate to home after dialog closes
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '40px 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        Make a Reservation
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Select Restaurant"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          select
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        >
          {restaurants.map((restaurant) => (
            <MenuItem key={restaurant._id} value={restaurant._id}>
              {restaurant.name} - {restaurant.location}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Select Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          select
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        >
          {services.map((service) => (
            <MenuItem key={service._id} value={service._id}>
              {service.name} - ${service.price.toFixed(2)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Special Requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
          sx={{ padding: '10px', fontSize: '16px' }}
        >
          Submit Reservation
        </Button>
      </form>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Reservation Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your reservation has been successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* {feedback && (
        <Typography variant="body1" color="error" sx={{ marginTop: '20px', textAlign: 'center' }}>
          {feedback}
        </Typography>
      )} */}
    </Container>
  );
};

export default ReservationForm;
