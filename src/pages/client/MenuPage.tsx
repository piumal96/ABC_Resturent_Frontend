import React, { useEffect, useState } from 'react';
import { fetchDishes, addToCart, DishModel } from '@/services/api';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

// Menu Page Component
const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<DishModel[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      try {
        const fetchedDishes = await fetchDishes();
        setDishes(fetchedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  const handleAddToCart = async (dish: DishModel) => {
    try {
      const customizations = { 'Spice Level': 50, 'Extra Cheese': 100 };
      const quantity = 2;

      // Validate price before adding to cart
      if (isNaN(dish.price)) {
        setSnackbarMessage('Invalid price for this dish');
        setSnackbarOpen(true);
        return;
      }

      // Add item to cart
      await addToCart(dish._id, customizations, quantity);

      setSnackbarMessage('Dish added to cart');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbarMessage('Failed to add dish to cart');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const goHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Header Section with Back and Home Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Our Menu
        </Typography>
        <IconButton onClick={goHome}>
          <HomeIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            Loading Menu...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {dishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'scale(1.02)' }, // Subtle hover effect
                  maxWidth: '320px', // Limit the maximum width of the card
                  margin: 'auto', // Center the card horizontally
                }}
              >
                <Box
                  component="img"
                  src={dish.imageUrl || 'https://via.placeholder.com/300x200?text=Dish+Image'} // Use dish image from API
                  alt={dish.name}
                  sx={{
                    height: '200px', // Set a consistent height for all images
                    width: '100%',
                    objectFit: 'cover',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, padding: '16px', textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {dish.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '8px' }}>
                    {dish.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Rs {dish.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', padding: '12px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(dish)}
                    fullWidth
                    sx={{
                      padding: '10px',
                      fontSize: '16px',
                      transition: 'background-color 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#3a8dff',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar for adding to cart feedback */}
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

export default MenuPage;
