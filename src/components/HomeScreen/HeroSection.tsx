import React from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1498654896293-37aacf113fd9)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Welcome to ABC Restaurant
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: '40px' }}>
          Experience the finest dining in Sri Lanka
        </Typography>
        <TextField
          placeholder="Search services..."
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '5px' }}
        />
        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: '#ff5722' }}
          onClick={() => navigate('/customer/reservation')}
        >
          Make a Reservation
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
