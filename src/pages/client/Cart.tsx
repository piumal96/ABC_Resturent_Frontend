import React, { useState, useEffect } from 'react';
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
  Box,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { fetchCart, updateCartItem, removeCartItem, createOrder, fetchRestaurants } from '@/services/api';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string>(''); // Restaurant ID
  const [restaurants, setRestaurants] = useState<any[]>([]); // List of available restaurants
  const [deliveryAddress, setDeliveryAddress] = useState<string>(''); // Delivery address input
  const [totalOrderCost, setTotalOrderCost] = useState<number>(0); // Total order cost
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false); // Payment dialog
  const [cardNumber, setCardNumber] = useState<string>(''); // Card Number
  const [cardExpiry, setCardExpiry] = useState<string>(''); // Card Expiry
  const [cardCvc, setCardCvc] = useState<string>(''); // Card CVC

  // Fetch the cart and restaurants when the component mounts
  useEffect(() => {
    const loadCartAndRestaurants = async () => {
      try {
        const fetchedCart = await fetchCart();
        const fetchedRestaurants = await fetchRestaurants();
        setCart(fetchedCart);
        setRestaurants(fetchedRestaurants);
        calculateTotalOrderCost(fetchedCart);
      } catch (error) {
        console.error('Error loading cart or restaurants:', error);
        setSnackbarMessage('Failed to load data. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    loadCartAndRestaurants();
  }, []);

  // Calculate total order cost
  const calculateTotalOrderCost = (cart: any) => {
    if (cart && cart.items) {
      const totalCost = cart.items.reduce((total: number, item: any) => total + item.totalPrice, 0);
      setTotalOrderCost(totalCost);
    }
  };

  // Update item quantity in the cart
  const handleUpdateQuantity = async (dishId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSnackbarMessage('Quantity must be at least 1');
      setSnackbarOpen(true);
      return;
    }

    try {
      await updateCartItem(dishId, newQuantity);
      const updatedCart = await fetchCart();
      setCart(updatedCart);
      calculateTotalOrderCost(updatedCart);
      setSnackbarMessage('Quantity updated');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbarMessage('Failed to update item quantity.');
      setSnackbarOpen(true);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (dishId: string) => {
    try {
      await removeCartItem(dishId);
      const updatedCart = await fetchCart();
      setCart(updatedCart);
      calculateTotalOrderCost(updatedCart);
      setSnackbarMessage('Item removed');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setSnackbarMessage('Failed to remove item.');
      setSnackbarOpen(true);
    }
  };

  // Handle order creation
  const handlePlaceOrder = async () => {
    if (!restaurantId || !deliveryAddress) {
      setSnackbarMessage('Please select a restaurant and provide a delivery address.');
      setSnackbarOpen(true);
      return;
    }

    // Open the payment dialog when placing order
    setPaymentDialogOpen(true);
  };

  // Handle payment and order confirmation
  const handleConfirmPayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      setSnackbarMessage('Please fill in all card details.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await createOrder(restaurantId, deliveryAddress);
      setSnackbarMessage('Order placed successfully!');
      setSnackbarOpen(true);
      setPaymentDialogOpen(false); // Close payment dialog
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbarMessage('Failed to place order.');
      setSnackbarOpen(true);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <Typography variant="h6" align="center">Your cart is empty.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <Grid container spacing={2}>
        {cart.items.map((item: any, index: number) => (
          <Grid item xs={12} sm={6} key={`${item.dish._id}-${index}`}>
            <Paper
              sx={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>{item.dish.name}</Typography>
                <Typography variant="body2" color="textSecondary">Quantity: {item.quantity}</Typography>
                <Typography variant="body2" color="primary">Total: LKR {item.totalPrice.toFixed(2)}</Typography> {/* Currency changed to LKR */}
              </Box>
              <Box>
                <IconButton onClick={() => handleUpdateQuantity(item.dish._id, item.quantity - 1)}>
                  <Remove />
                </IconButton>
                <IconButton onClick={() => handleUpdateQuantity(item.dish._id, item.quantity + 1)}>
                  <Add />
                </IconButton>
                <IconButton onClick={() => handleRemoveFromCart(item.dish._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Total Price */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" color="primary">
          Total Order Cost: LKR {totalOrderCost.toFixed(2)} {/* Currency changed to LKR */}
        </Typography>
      </Box>

      {/* Restaurant Selection */}
      <Box mb={3}>
        <TextField
          label="Select Restaurant"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          select
          fullWidth
          required
        >
          {restaurants.map((restaurant) => (
            <MenuItem key={restaurant._id} value={restaurant._id}>
              {restaurant.name} - {restaurant.location}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Delivery Address */}
      <Box mb={3}>
        <TextField
          label="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          fullWidth
          required
          placeholder="Enter your delivery address"
        />
      </Box>

      {/* Place Order Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        fullWidth
        sx={{ padding: '12px', fontSize: '16px' }}
      >
        Place Order
      </Button>

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your card details to complete the order.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Card Number"
            type="text"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Card Expiry (MM/YY)"
            type="text"
            fullWidth
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
          />
          <TextField
            margin="dense"
            label="CVC"
            type="text"
            fullWidth
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPayment} color="primary">
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;
