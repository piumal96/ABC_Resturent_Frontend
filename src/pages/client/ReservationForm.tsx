import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from '@mui/material';

const ReservationForm: React.FC = () => {
  const [reservationType, setReservationType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const handleSubmit = () => {
    // Here, you would typically send the reservation data to your backend.
    const reservationData = {
      reservationType,
      date,
      time,
      location,
      numberOfGuests,
      customerName,
      phoneNumber,
      email,
      specialRequests,
    };
    console.log(reservationData);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Make a Reservation
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="reservation-type-label">Reservation Type</InputLabel>
        <Select
          labelId="reservation-type-label"
          value={reservationType}
          label="Reservation Type"
          onChange={(e) => setReservationType(e.target.value)}
        >
          <MenuItem value="Dine-In">Dine-In</MenuItem>
          <MenuItem value="Delivery">Delivery</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Date"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <TextField
        label="Time"
        type="time"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <TextField
        label="Location"
        fullWidth
        sx={{ mb: 2 }}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <TextField
        label="Number of Guests"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={numberOfGuests}
        onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10))}
      />

      <TextField
        label="Name"
        fullWidth
        sx={{ mb: 2 }}
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <TextField
        label="Phone Number"
        fullWidth
        sx={{ mb: 2 }}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Special Requests"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Submit Reservation
      </Button>
    </Box>
  );
};

export default ReservationForm;
