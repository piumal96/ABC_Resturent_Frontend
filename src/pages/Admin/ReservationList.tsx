import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const reservationsData = [
  { id: 1, name: 'John Doe', date: '2024-09-01', time: '19:00', type: 'Dine-In' },
  { id: 2, name: 'Jane Smith', date: '2024-09-02', time: '12:00', type: 'Delivery' },
  { id: 3, name: 'Alice Johnson', date: '2024-09-03', time: '18:30', type: 'Dine-In' },
];

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(reservationsData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const filteredReservations = reservationsData.filter((reservation) =>
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setReservations(filteredReservations);
  };

  const handleDetail = (id: number) => {
    navigate(`/reservations/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Manage Reservations
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.name}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.type}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleDetail(reservation.id)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReservationList;
