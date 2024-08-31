import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeckIcon from '@mui/icons-material/Deck';

interface Facility {
  icon: JSX.Element;
  title: string;
  description: string;
  extendedDescription: string;
  link: string;
}

const facilities: Facility[] = [
  {
    icon: <LocalParkingIcon fontSize="large" />,
    title: 'Parking',
    description: 'Ample parking space available for all our guests.',
    extendedDescription: 'Our parking area is secured and well-lit, providing easy access to the main entrance. Valet parking is also available.',
    link: '#',
  },
  {
    icon: <WifiIcon fontSize="large" />,
    title: 'Free Wi-Fi',
    description: 'Enjoy complimentary Wi-Fi during your visit.',
    extendedDescription: 'Our high-speed Wi-Fi covers all areas of the facility, including outdoor seating areas, so you can stay connected wherever you are.',
    link: '#',
  },
  {
    icon: <RestaurantIcon fontSize="large" />,
    title: 'Private Dining',
    description: 'Exclusive private dining areas for special occasions.',
    extendedDescription: 'Our private dining areas offer a serene and intimate setting, perfect for business meetings, family gatherings, or romantic dinners.',
    link: '#',
  },
  {
    icon: <DeckIcon fontSize="large" />,
    title: 'Outdoor Seating',
    description: 'Beautiful outdoor seating areas with scenic views.',
    extendedDescription: 'Our outdoor seating provides stunning views of the surrounding landscape, perfect for enjoying a meal or drinks in the open air.',
    link: '#',
  },
];

const FacilitiesSection: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const handleClickOpen = (facility: Facility) => {
    setSelectedFacility(facility);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFacility(null);
  };

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
                    onClick={() => handleClickOpen(facility)}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedFacility?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedFacility?.extendedDescription}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilitiesSection;
