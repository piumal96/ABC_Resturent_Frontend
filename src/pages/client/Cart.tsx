import React, { useEffect, useState } from 'react';
import { fetchCart, addToCart, updateCartItem, removeCartItem, CartModel } from '@/services/api';
import { Card, CardContent, Typography, IconButton, Grid, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartModel | null>(null); // Cart state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Fetch the cart when the component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const fetchedCart = await fetchCart();
        setCart(fetchedCart); // Set cart data
      } catch (error) {
        console.error('Error fetching cart:', error);
        setErrorMessage('Failed to load cart. Please try again.'); // Handle fetch error
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    loadCart();
  }, []);

  // Add an item to the cart
  const handleAddToCart = async (dishId: string, customizations: Record<string, number>, quantity: number) => {
    try {
      await addToCart(dishId, customizations, quantity);
      const updatedCart = await fetchCart(); // Refetch updated cart
      setCart(updatedCart); // Update cart state
      setSnackbarMessage('Item added to cart');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setErrorMessage('Failed to add item to cart.');
      setSnackbarOpen(true);
    }
  };

  // Update item quantity in the cart
  const handleUpdateQuantity = async (dishId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      console.warn('Quantity must be at least 1');
      return;
    }

    try {
      await updateCartItem(dishId, newQuantity);
      const updatedCart = await fetchCart(); // Refetch updated cart
      setCart(updatedCart); // Update cart state
      setSnackbarMessage('Quantity updated');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setErrorMessage('Failed to update item quantity.');
      setSnackbarOpen(true);
    }
  };

  // Remove an item from the cart
  const handleRemoveFromCart = async (dishId: string) => {
    try {
      await removeCartItem(dishId);
      const updatedCart = await fetchCart(); // Refetch updated cart
      setCart(updatedCart); // Update cart state
      setSnackbarMessage('Item removed from cart');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setErrorMessage('Failed to remove item from cart.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ marginLeft: 2 }}>
          Loading cart...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (errorMessage) return <p>{errorMessage}</p>;

  // Empty cart state
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <Grid container spacing={2}>
        {cart.items.map((item, index) => (
          <Grid item xs={12} md={6} key={`${item.dish._id}-${index}`}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px', alignItems: 'center' }}>
              <CardContent>
                <Typography variant="h6">{item.dish.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="primary">
                  Total: ${(item.totalPrice).toFixed(2)}
                </Typography>
              </CardContent>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateQuantity(item.dish._id, item.quantity - 1)}
                >
                  <Remove />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateQuantity(item.dish._id, item.quantity + 1)}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveFromCart(item.dish._id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" color="primary">
          Total Price: ${cart.totalPrice.toFixed(2)}
        </Typography>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
