import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeckIcon from '@mui/icons-material/Deck';

const facilities = [
  {
    icon: <LocalParkingIcon fontSize="large" />,
    title: 'Parking',
    description: 'Ample parking space available for all our guests.',
    link: '#',
  },
  {
    icon: <WifiIcon fontSize="large" />,
    title: 'Free Wi-Fi',
    description: 'Enjoy complimentary Wi-Fi during your visit.',
    link: '#',
  },
  {
    icon: <RestaurantIcon fontSize="large" />,
    title: 'Private Dining',
    description: 'Exclusive private dining areas for special occasions.',
    link: '#',
  },
  {
    icon: <DeckIcon fontSize="large" />,
    title: 'Outdoor Seating',
    description: 'Beautiful outdoor seating areas with scenic views.',
    link: '#',
  },
];

const FacilitiesSection: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f7f7f7', padding: '60px 0' }}>
      <Container id="facilities" maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Facilities
        </Typography>
        <Grid container spacing={4}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: '10px', boxShadow: 3, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {facility.icon}
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    {facility.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', marginBottom: '10px' }}>
                    {facility.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={facility.link}
                    sx={{ marginTop: '20px' }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FacilitiesSection;
