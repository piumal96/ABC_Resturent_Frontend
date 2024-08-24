import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const facilitiesData = [
  { id: 1, location: 'Colombo', name: 'Free Wi-Fi', description: 'High-speed internet access available.' },
  { id: 2, location: 'Kandy', name: 'Parking', description: 'Ample parking space available for customers.' },
  { id: 3, location: 'Galle', name: 'Outdoor Seating', description: 'Comfortable outdoor seating available.' },
];

const FacilityList: React.FC = () => {
  const navigate = useNavigate();
  const [facilities,] = useState(facilitiesData);

  const handleEdit = (id: number) => {
    navigate(`/facilities/edit/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Manage Facilities
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Facility Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>{facility.location}</TableCell>
                <TableCell>{facility.name}</TableCell>
                <TableCell>{facility.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(facility.id)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FacilityList;
