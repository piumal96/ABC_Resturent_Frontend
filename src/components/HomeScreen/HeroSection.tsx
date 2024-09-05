import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api, { ServiceModel } from '@/services/api';  // Adjust the path to your API file

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceModel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const filterResults = () => {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    };

    if (query) {
      filterResults();
    } else {
      setFilteredServices([]);
    }
  }, [query, services]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await api.fetchServices(query);  // Fetch services from API
      setServices(searchResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: ServiceModel) => {
    setQuery(service.name);
    setShowSuggestions(false);  
  };

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1498654896293-37aacf113fd9)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: '24px', letterSpacing: '1px' }}>
          Discover Fine Dining
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: '50px', fontWeight: '300', opacity: 0.8 }}>
          Find and reserve your table at ABC Restaurant
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <TextField
            placeholder="Search for services..."
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: '20px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ff5722',
                },
                '&:hover fieldset': {
                  borderColor: '#ff3d00',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff5722',
                },
              },
            }}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) {
                handleSearch();
              } else {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => query && setShowSuggestions(true)}
            aria-label="Search services"
          />
          {loading && <CircularProgress color="secondary" sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
          {showSuggestions && filteredServices.length > 0 && (
            <Paper sx={{ position: 'absolute', zIndex: 2, left: 0, right: 0, marginTop: '8px', borderRadius: '0 0 10px 10px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
              <List>
                {filteredServices.map((service) => (
                  <ListItem
                    button
                    onClick={() => handleSelectService(service)}
                    key={service._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#ff5722',
                        color: '#fff',
                      },
                      padding: '12px 20px',
                    }}
                  >
                    <ListItemText primary={service.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
        <Box sx={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#ff5722',
              padding: '10px 30px',
              borderRadius: '50px',
              '&:hover': {
                backgroundColor: '#ff3d00',
              },
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => setShowSuggestions(false)}
            disabled={loading}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#ff5722',
              color: '#ff5722',
              padding: '10px 30px',
              borderRadius: '50px',
              '&:hover': {
                borderColor: '#ff3d00',
                color: '#ff3d00',
              },
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
            onClick={() => navigate('/customer/reservation')}
            disabled={loading}
          >
            Make a Reservation
          </Button>
        </Box>

        {filteredServices.length > 0 && !showSuggestions && (
          <Box mt={6} sx={{ textAlign: 'left', backgroundColor: '#fff', borderRadius: '5px', padding: '20px', color: '#000', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#ff5722' }}>
              Search Results
            </Typography>
            <ul>
              {filteredServices.map((service) => (
                <li key={service._id} style={{ marginBottom: '10px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{service.name}</Typography>
                  <Typography>{service.description}</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#ff5722' }}>Price: Rs {service.price}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HeroSection;
