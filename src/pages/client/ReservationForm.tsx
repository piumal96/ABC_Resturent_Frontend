import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook from AuthContext
import { useReservation } from '@/context/ReservationContext'; // Assuming you have a ReservationContext
import { Container, TextField, Button, Typography } from '@mui/material';

const ReservationForm: React.FC = () => {
  const [restaurant, setRestaurant] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Dine-in');
  const [specialRequests, setSpecialRequests] = useState('');
  const [feedback, setFeedback] = useState('');

  const { user, isAuthenticated } = useAuth(); // Get authentication status and user info
  const { createReservation } = useReservation(); // Access createReservation from ReservationContext
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!user) {
        throw new Error('You must be logged in to make a reservation.');
      }

      const reservationData = {
        restaurant,
        service,
        date,
        time,
        type,
        specialRequests,
      };

      await createReservation(reservationData);
      setFeedback('Reservation created successfully!');
    } catch (error) {
      setFeedback('Failed to create reservation. Please try again.');
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '40px 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        Make a Reservation
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Restaurant ID"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Service ID"
          value={service}
          onChange={(e) => setService(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Special Requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
          sx={{ padding: '10px', fontSize: '16px' }}
        >
          Submit Reservation
        </Button>
      </form>
      {feedback && (
        <Typography variant="body1" color="error" sx={{ marginTop: '20px', textAlign: 'center' }}>
          {feedback}
        </Typography>
      )}
    </Container>
  );
};

export default ReservationForm;
