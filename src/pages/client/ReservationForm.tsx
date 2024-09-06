import React from 'react';
import { Container, TextField, Button, Typography, MenuItem, Paper, Grid, CircularProgress, Snackbar, IconButton, Box } from '@mui/material';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HomeIcon from '@mui/icons-material/Home';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'; // Make sure this is imported
import { useReservationController } from '@/controllers/Customer/ReservationController'; // Custom controller to handle logic
import PaymentDialog from './PaymentDialog'; // Your payment dialog component

const ReservationForm: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook called inside the component
  
  // Calling the controller to manage business logic
  const {
    restaurant,
    restaurants,
    service,
    services,
    serviceCost,
    date,
    time,
    type,
    specialRequests,
    deliveryAddress,
    contactNumber,
    loading,
    snackbarOpen,
    feedback,
    paymentDialogOpen,
    handleServiceChange,
    handleSubmit,
    handlePayment,
    handleSnackbarClose,
    setRestaurant,
    setDate,
    setTime,
    setType,
    setSpecialRequests,
    setDeliveryAddress,
    setContactNumber,
    setPaymentDialogOpen,
  } = useReservationController(); // Make sure this is a valid hook or function

  return (
    <Container maxWidth="sm" sx={{ padding: '40px 0', backgroundImage: 'url(/path-to-background-image.jpg)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ marginRight: '10px' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
          Make a Reservation
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ padding: '30px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
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
                  startAdornment: type === 'Dine-in' ? (
                    <LocalDiningIcon sx={{ marginRight: '8px', color: '#888' }} />
                  ) : (
                    <RoomServiceIcon sx={{ marginRight: '8px', color: '#888' }} />
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
                    {service.name} - LKR {service.price.toFixed(2)}
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
                    InputProps={{ startAdornment: <HomeIcon sx={{ marginRight: '8px', color: '#888' }} /> }}
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
