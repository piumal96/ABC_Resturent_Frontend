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
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getServices, createService, updateService, deleteService } from '@/services/api';
import { ServiceModel } from '@/models/ServiceModel';
import Layout from '@/components/Layout/Layout';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [editingService, setEditingService] = useState<ServiceModel | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setSnackbarMessage('Error fetching services');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: '', description: '', price: '' };

    if (newService.name.trim() === '') {
      newErrors.name = 'Service name is required';
      valid = false;
    }
    if (newService.description.trim() === '') {
      newErrors.description = 'Description is required';
      valid = false;
    }
    if (newService.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleEdit = (service: ServiceModel) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setErrors({ name: '', description: '', price: '' });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteService(id);
      setServices(services.filter(service => service._id !== id));
      setSnackbarMessage('Service deleted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error deleting service:', error);
      setSnackbarMessage('Error deleting service');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setNewService({ name: '', description: '', price: 0 });
    setErrors({ name: '', description: '', price: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editingService) {
        // Update existing service
        const updatedService = await updateService(editingService._id, newService);
        setServices(services.map(service => service._id === updatedService._id ? updatedService : service));
        setSnackbarMessage('Service updated successfully');
        setSnackbarSeverity('success');
      } else {
        // Create new service
        const createdService = await createService(newService);
        setServices([...services, createdService.service]);
        setSnackbarMessage('Service created successfully');
        setSnackbarSeverity('success');
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      setSnackbarMessage('Error saving service');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Services</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Service
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && services.length === 0 && (
        <Typography variant="h6" align="center">
          No services available. Add a new service to get started.
        </Typography>
      )}
      {!loading && services.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(service)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(service._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
            error={!!errors.price}
            helperText={errors.price}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </Layout>
  );
};

export default ServiceList;
