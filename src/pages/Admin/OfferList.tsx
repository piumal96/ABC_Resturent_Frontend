import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getOffers, deleteOffer, createOffer } from '@/services/api';
import { OfferModel } from '@/models/OfferModel';

const OfferList: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferModel[]>([]);
  const [open, setOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discountPercentage: 0,
    validFrom: '',
    validTo: '',
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const fetchedOffers = await getOffers(); // Fetch offers from the backend
        setOffers(fetchedOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/offers/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOffer(id); // Delete offer from the backend
      setOffers(offers.filter((offer) => offer._id !== id)); // Remove deleted offer from state
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewOffer({
      title: '',
      description: '',
      discountPercentage: 0,
      validFrom: '',
      validTo: '',
    });
  };

  const handleSave = async () => {
    try {
      const createdOffer = await createOffer(newOffer); // Create a new offer in the backend
      setOffers([...offers, createdOffer.offer]); // Add the new offer to the state
      handleClose();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
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
              <TableRow key={offer._id}>
                <TableCell>{offer.title}</TableCell>
                <TableCell>{offer.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(offer._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(offer._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Offer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newOffer.title}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Discount Percentage"
            type="number"
            value={newOffer.discountPercentage}
            onChange={(e) => setNewOffer({ ...newOffer, discountPercentage: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Valid From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newOffer.validFrom}
            onChange={(e) => setNewOffer({ ...newOffer, validFrom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Valid To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newOffer.validTo}
            onChange={(e) => setNewOffer({ ...newOffer, validTo: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfferList;
