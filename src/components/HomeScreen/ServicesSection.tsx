import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, CircularProgress, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { getServices } from '@/services/api'; // Adjust the import path as needed
import { ServiceModel } from '@/models/ServiceModel';

const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getDefaultImage = (title: string) => {
    const defaultImages: { [key: string]: string } = {
      "Dine-In": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "Delivery": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      "Catering": "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
    };

    return defaultImages[title] || "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38";
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2; // Scroll by half of the container's width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container id="services" maxWidth="lg" sx={{ padding: '60px 0', position: 'relative' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
        Our Services
      </Typography>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 0,
            zIndex: 2,
            backgroundColor: '#fff',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <ArrowBackIos />
        </IconButton>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'hidden',
            gap: { xs: 2, md: 4 }, // Adjust gap for different screen sizes
            scrollSnapType: 'x mandatory',
            paddingBottom: '20px',
          }}
        >
          {services.map((service) => (
            <Box
              key={service._id}
              sx={{
                flex: '0 0 auto',
                width: { xs: 'calc(80% - 16px)', md: 'calc(33.333% - 16px)' }, // Responsive width
                scrollSnapAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                minHeight: '400px',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Enhanced hover effect
                },
              }}
            >
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '10px',
                  height: '100%',
                  boxShadow: 'none',
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px 10px 0 0',
                  }}
                  src={getDefaultImage(service.name)}
                  alt={service.name}
                />
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px' }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px', color: '#555' }}>
                    {service.description}
                  </Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center', padding: '16px 0' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    href="#reservation-form"
                    sx={{
                      width: '80%',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#0056b3',
                      },
                    }}
                  >
                    Reserve Now
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 2,
            backgroundColor: '#fff',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ServicesSection;
