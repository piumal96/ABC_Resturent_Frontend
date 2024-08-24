import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, Container, Box, TextField, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomeScreen: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');

  const navigate = useNavigate();

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Header Section */}
      <AppBar position="static" sx={{ backgroundColor: '#4caf50' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ABC Restaurant
          </Typography>
          <Button color="inherit" href="#services">Services</Button>
          <Button color="inherit" href="#offers">Offers</Button>
          <Button color="inherit" href="#gallery">Gallery</Button>
          <Button color="inherit" href="#reservations">Reservations</Button>
          <Button color="inherit" href="#contact">Contact</Button>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          <Button color="inherit" onClick={() => navigate('/register')}>Register</Button> 
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
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
          <Button variant="contained" size="large" sx={{ backgroundColor: '#ff5722' }} href="#reservations">
            Make a Reservation
          </Button>
        </Container>
      </Box>

      {/* Services Section */}
      <Container id="services" maxWidth="lg" sx={{ padding: '60px 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Our Services
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: '200px', borderRadius: '10px' }}>
              <CardContent>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                  alt="Dine-In"
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px' }}>Dine-In</Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>Enjoy our cozy dining environment.</Typography>
                <Button variant="contained" color="primary" href="#reservation-form">
                  Reserve Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: '200px', borderRadius: '10px' }}>
              <CardContent>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                  alt="Delivery"
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px' }}>Delivery</Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>Get our delicious meals delivered to your door.</Typography>
                <Button variant="contained" color="primary" href="#reservation-form">
                  Reserve Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: '200px', borderRadius: '10px' }}>
              <CardContent>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                  src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38"
                  alt="Catering"
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px' }}>Catering</Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>Perfect for your special events and gatherings.</Typography>
                <Button variant="contained" color="primary" href="#reservation-form">
                  Reserve Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Offers Section */}
      <Box sx={{ backgroundColor: '#f7f7f7', padding: '60px 0' }}>
        <Container id="offers" maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
            Special Offers
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Happy Hour</Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    Get 50% off on selected items during happy hour.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Weekend Special</Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    Exclusive discounts on weekends.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Button variant="contained" color="secondary" href="#offers-page" sx={{ marginTop: '20px' }}>
            View All Offers
          </Button>
        </Container>
      </Box>

      {/* Gallery Section */}
      <Container id="gallery" maxWidth="lg" sx={{ padding: '60px 0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Photo Gallery
        </Typography>
        <Grid container spacing={2}>
          {['https://images.unsplash.com/photo-1559339341-e8b89489a4a5',
            'https://images.unsplash.com/photo-1529042410759-befb1204b835',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
            'https://images.unsplash.com/photo-1551218808-94e220e084d2'].map((src, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
                src={src}
                alt={`Gallery Image ${index + 1}`}
                onClick={() => handleOpen(src)}
              />
            </Grid>
          ))}
        </Grid>
        <Modal open={isOpen} onClose={handleClose}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none' }}>
            <img src={selectedImage} alt="Gallery Image" style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }} />
          </Box>
        </Modal>
      </Container>

      {/* Query Section */}
      <Container maxWidth="lg" sx={{ padding: '40px 0', backgroundColor: '#f0f0f0' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Have a Question?
        </Typography>
        <TextField
          label="Your Query"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" fullWidth>Submit Query</Button>
      </Container>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: '#333', color: '#fff', padding: '30px 0', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">&copy; 2024 ABC Restaurant. All rights reserved.</Typography>
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            <a href="#privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</a> | 
            <a href="#terms" style={{ color: '#fff', textDecoration: 'none' }}>Terms of Service</a> | 
            <a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</a>
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default HomeScreen;
