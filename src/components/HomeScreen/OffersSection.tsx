import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';

const offers = [
  {
    title: "Happy Hour",
    description: "Get 50% off on selected items during happy hour.",
  },
  {
    title: "Weekend Special",
    description: "Exclusive discounts on weekends.",
  },
];

const OffersSection: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f7f7f7', padding: '60px 0' }}>
      <Container id="offers" maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Special Offers
        </Typography>
        <Grid container spacing={4}>
          {offers.map((offer, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {offer.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    {offer.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" color="secondary" href="#offers-page" sx={{ marginTop: '20px' }}>
          View All Offers
        </Button>
      </Container>
    </Box>
  );
};

export default OffersSection;
