import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';

const services = [
  {
    title: "Dine-In",
    description: "Enjoy our cozy dining environment.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  },
  {
    title: "Delivery",
    description: "Get our delicious meals delivered to your door.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
  {
    title: "Catering",
    description: "Perfect for your special events and gatherings.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <Container id="services" maxWidth="lg" sx={{ padding: '60px 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
        Our Services
      </Typography>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                  src={service.image}
                  alt={service.title}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>
                  {service.description}
                </Typography>
                <Button variant="contained" color="primary" href="#reservation-form">
                  Reserve Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ServicesSection;
