import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  Box,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

// Dummy cart data
const dummyCart = {
  items: [
    {
      dish: {
        _id: '1',
        name: 'Spaghetti Carbonara',
        price: 12,
      },
      quantity: 2,
      totalPrice: 24,
    },
    {
      dish: {
        _id: '2',
        name: 'Margherita Pizza',
        price: 10,
      },
      quantity: 1,
      totalPrice: 10,
    },
  ],
  totalPrice: 34,
};

const CartPage: React.FC = () => {
  const [cart, setCart] = useState(dummyCart);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('creditCard');

  const handleRemoveFromCart = (dishId: string) => {
    const updatedCart = {
      ...cart,
      items: cart.items.filter((item) => item.dish._id !== dishId),
      totalPrice: cart.items
        .filter((item) => item.dish._id !== dishId)
        .reduce((total, item) => total + item.totalPrice, 0),
    };
    setCart(updatedCart);
    setSnackbarMessage('Item removed from cart');
    setSnackbarOpen(true);
  };

  const handleUpdateQuantity = (dishId: string, newQuantity: number) => {
    if (newQuantity <= 0) return; // Prevent quantity below 1
    const updatedItems = cart.items.map((item) => {
      if (item.dish._id === dishId && newQuantity > 0) {
        const newTotalPrice = newQuantity * item.dish.price;
        return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
      }
      return item;
    });
    const updatedTotalPrice = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
    setCart({ items: updatedItems, totalPrice: updatedTotalPrice });
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  const handleCheckout = () => {
    // Checkout logic placeholder
    setSnackbarMessage('Checkout successful!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cart && cart.items.length > 0 ? (
        <Grid container spacing={3}>
          {cart.items.map((item) => (
            <Grid item xs={12} md={6} key={item.dish._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{item.dish.name}</Typography>
                  <Typography variant="body2">Price: ${item.dish.price}</Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <IconButton
                      onClick={() => handleUpdateQuantity(item.dish._id, item.quantity - 1)}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      type="number"
                      value={item.quantity}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      onChange={(e) =>
                        handleUpdateQuantity(item.dish._id, parseInt(e.target.value, 10))
                      }
                      sx={{ width: '50px', marginRight: '10px', marginLeft: '10px' }}
                    />
                    <IconButton
                      onClick={() => handleUpdateQuantity(item.dish._id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle1" mt={2}>
                    Total: ${item.totalPrice}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => handleRemoveFromCart(item.dish._id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {/* Summary and Payment Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h5">Total Cart Price: ${cart.totalPrice}</Typography>
              <Divider sx={{ marginY: '20px' }} />
              <FormControl component="fieldset">
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                  aria-label="payment-method"
                  value={selectedPayment}
                  onChange={handlePaymentChange}
                >
                  <FormControlLabel
                    value="creditCard"
                    control={<Radio />}
                    label="Credit Card"
                  />
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                  <FormControlLabel
                    value="bankTransfer"
                    control={<Radio />}
                    label="Bank Transfer"
                  />
                </RadioGroup>
              </FormControl>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button variant="contained" color="primary" onClick={handleCheckout}>
                  Checkout
                </Button>
                <Button variant="outlined" color="secondary">
                  Clear Cart
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Your cart is empty.</Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
