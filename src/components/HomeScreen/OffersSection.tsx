import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { getOffers } from '@/services/api'; // Adjust the import path as necessary
import { OfferModel } from '@/models/OfferModel';

const OffersSection: React.FC = () => {
  const [offers, setOffers] = useState<OfferModel[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const fetchedOffers = await getOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f7f7f7', padding: '60px 0' }}>
      <Container id="offers" maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Special Offers
        </Typography>
        <Grid container spacing={4}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer._id}>
              <Card sx={{ borderRadius: '10px', boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {offer.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', marginBottom: '10px' }}>
                    {offer.description}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>
                    Valid from: {new Date(offer.validFrom).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>
                    Valid to: {new Date(offer.validTo).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {offers.length > 0 && (
          <Button variant="contained" color="secondary" href="#offers-page" sx={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
            View All Offers
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default OffersSection;
