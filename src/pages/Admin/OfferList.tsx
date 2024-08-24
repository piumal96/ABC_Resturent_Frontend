import React, { useState } from 'react';
import {
  Box,
  Button,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const offersData = [
  { id: 1, name: '20% Off on All Orders', description: 'Valid through December 2024.' },
  { id: 2, name: 'Buy One Get One Free', description: 'Available on select items.' },
  { id: 3, name: 'Free Dessert with Dinner', description: 'Only valid for dine-in.' },
];

const OfferList: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState(offersData);

  const handleEdit = (id: number) => {
    navigate(`/offers/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setOffers(offers.filter(offer => offer.id !== id));
  };

  const handleAdd = () => {
    navigate('/offers/add');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Offers and Promotions</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Offer
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Offer Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>{offer.name}</TableCell>
                <TableCell>{offer.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(offer.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(offer.id)}>
                    <DeleteIcon />
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

export default OfferList;
