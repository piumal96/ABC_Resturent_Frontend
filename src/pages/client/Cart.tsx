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
import { Add, Remove, Delete, ArrowBack, Home, ShoppingCart } from '@mui/icons-material';
import { fetchCart, updateCartItem, removeCartItem, createOrder, fetchRestaurants } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string>(''); 
  const [restaurants, setRestaurants] = useState<any[]>([]); 
  const [deliveryAddress, setDeliveryAddress] = useState<string>(''); 
  const [totalOrderCost, setTotalOrderCost] = useState<number>(0); 
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false); 
  const [cardNumber, setCardNumber] = useState<string>(''); 
  const [cardExpiry, setCardExpiry] = useState<string>(''); 
  const [cardCvc, setCardCvc] = useState<string>(''); 

  const navigate = useNavigate();

  useEffect(() => {
    loadCartAndRestaurants();
  }, []);

  // Fetch cart and restaurant data
  const loadCartAndRestaurants = async () => {
    setLoading(true);
    try {
      const fetchedCart = await fetchCart();
      const fetchedRestaurants = await fetchRestaurants();
      setCart(fetchedCart || null);
      setRestaurants(fetchedRestaurants || []);
      calculateTotalOrderCost(fetchedCart);
    } catch (error) {
      console.error('Error loading cart or restaurants:', error);
      setSnackbarMessage('Failed to load data. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total order cost
  const calculateTotalOrderCost = (cart: any) => {
    if (cart?.items) {
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
      await loadCartAndRestaurants();
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
      await loadCartAndRestaurants();
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
      setPaymentDialogOpen(false);
      await loadCartAndRestaurants();
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

  // UI for when the cart is empty or null
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '20px' }}>
        <ShoppingCart fontSize="large" color="primary" sx={{ fontSize: '80px', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {cart === null ? 'Cart is null' : 'Your cart is empty.'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {cart === null ? 'Failed to load cart data.' : "Looks like you haven't added anything to your cart yet."}
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderColor: '#ff5722',
              color: '#ff5722',
              '&:hover': { backgroundColor: '#ffccbc', borderColor: '#ff5722' },
            }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#ff5722',
              color: '#ff5722',
              '&:hover': { backgroundColor: '#ffccbc', borderColor: '#ff5722' },
            }}
          >
            Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            borderColor: '#ff5722',
            color: '#ff5722',
            '&:hover': { backgroundColor: '#ffccbc', borderColor: '#ff5722' },
          }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{
            borderColor: '#ff5722',
            color: '#ff5722',
            '&:hover': { backgroundColor: '#ffccbc', borderColor: '#ff5722' },
          }}
        >
          Home
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <Grid container spacing={2}>
        {cart?.items?.map((item: any, index: number) => (
          item?.dish ? (  // Check if the dish is not null
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
                  <Typography variant="body2" color="primary">Total: LKR {item.totalPrice.toFixed(2)}</Typography>
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
          ) : null // If item or item.dish is null, render nothing
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" color="primary">
          Total Order Cost: LKR {totalOrderCost.toFixed(2)}
        </Typography>
      </Box>

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

      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        fullWidth
        sx={{ padding: '12px', fontSize: '16px' }}
      >
        Place Order
      </Button>

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
