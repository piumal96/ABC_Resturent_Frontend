import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchRestaurants, fetchServices,updatePayment, createReservation } from '@/services/api';
import RestaurantModel from '@/models/RestaurantModel';
import { ServiceModel } from '@/models/ServiceModel';
import ReservationModel from '@/models/ReservationModel';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  IconButton,
} from '@mui/material';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HomeIcon from '@mui/icons-material/Home';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PaymentDialog from './PaymentDialog';  

const ReservationForm: React.FC = () => {
  const [restaurant, setRestaurant] = useState<string>('');
  const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
  const [service, setService] = useState<string>('');
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [serviceCost, setServiceCost] = useState<number>(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Dine-in');
  const [specialRequests, setSpecialRequests] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<ReservationModel | null>(null); // Store the current reservation

  const { user, isAuthenticated } = useAuth();
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

  const handleServiceChange = (serviceId: string) => {
    setService(serviceId);
    const selectedService = services.find((s) => s._id === serviceId);
    if (selectedService) {
      let cost = selectedService.price;
      if (type === 'Delivery') {
        const deliveryFee = 10; // Example delivery fee
        cost += deliveryFee;
      }
      setServiceCost(cost);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to make a reservation.');
      }

      const reservationData: ReservationModel = {
        id: '',
        customer: user.id,
        restaurant,
        service,
        date,
        time,
        type,
        deliveryAddress: type === 'Delivery' ? deliveryAddress : undefined,
        contactNumber: type === 'Delivery' ? contactNumber : undefined,
        specialRequests,
        status: 'Pending',
        createdAt: '',
      };

      const reservation = await createReservation(reservationData);

      if (reservation && type === 'Delivery') {
        setCurrentReservation(reservation);  // Set the current reservation
        setPaymentDialogOpen(true);
      } else {
        setFeedback('Reservation created successfully!');
        setSnackbarOpen(true);
      }

      setLoading(false);
    } catch (error) {
      setFeedback('Failed to create reservation. Please try again.');
      setSnackbarOpen(true);
      setLoading(false);
      console.error('Error creating reservation:', error);
    }
  };

  const handlePayment = async (method: string, cardDetails?: { cardNumber: string; expiryDate: string; cvv: string }) => {
    setPaymentDialogOpen(false);
    try {
      if (!currentReservation || !currentReservation.payment) {
        throw new Error('No payment information found. Please try again.');
      }
  
      const paymentId = currentReservation.payment._id; // Payment ID now exists on currentReservation
      const amount = serviceCost; // Amount to be paid
  
      if (method === 'Card Payment' && cardDetails) {
        console.log('Processing card payment with details:', cardDetails);
      }
  
      // Update the payment data with the correct payment ID
      const paymentResponse = await updatePayment(paymentId, 'Paid');  // Updating the payment status to 'Paid'
  
      console.log('Payment response:', paymentResponse);
  
      if (paymentResponse.success) {
        if (paymentResponse.payment && paymentResponse.payment.status) {
          setFeedback(`Reservation confirmed and payment processed successfully! Payment Status: ${paymentResponse.payment.status}`);
        } else {
          setFeedback('Payment processed, but payment status is missing.');
        }
        setSnackbarOpen(true);
  
        // Optionally, update the reservation status in the UI
        setCurrentReservation((prev) => {
          if (prev) {
            return {
              ...prev,
              status: paymentResponse.payment.status,
            };
          }
          return prev;
        });
      } else {
        setFeedback('Payment processing failed. Please try again.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setFeedback('Failed to process payment. Please try again.');
      setSnackbarOpen(true);
      console.error('Error processing payment:', error);
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '40px 0', backgroundImage: 'url(/path-to-background-image.jpg)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ padding: '30px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', fontFamily: 'Georgia, serif' }}>
          Make a Reservation
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Reservation Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                select
                fullWidth
                required
                sx={{ marginBottom: '20px' }}
                InputProps={{
                  startAdornment: (
                    type === 'Dine-in' ? (
                      <LocalDiningIcon sx={{ marginRight: '8px', color: '#888' }} />
                    ) : (
                      <RoomServiceIcon sx={{ marginRight: '8px', color: '#888' }} />
                    )
                  ),
                }}
              >
                <MenuItem value="Dine-in">Dine-in</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Select Service"
                value={service}
                onChange={(e) => handleServiceChange(e.target.value)}
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
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {type === 'Delivery' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    fullWidth
                    required
                    placeholder="Enter your delivery address"
                    InputProps={{
                      startAdornment: (
                        <HomeIcon sx={{ marginRight: '8px', color: '#888' }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    fullWidth
                    required
                    placeholder="Enter your contact number"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                label="Special Requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter any special requests"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ padding: '12px', fontSize: '16px', borderRadius: '8px', background: 'linear-gradient(to right, #ff7e5f, #feb47b)' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Reservation'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        totalAmount={serviceCost}
        onPayment={handlePayment}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={feedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            X
          </IconButton>
        }
        sx={{ backgroundColor: '#333', color: '#fff' }}
      />
    </Container>
  );
};

export default ReservationForm;
