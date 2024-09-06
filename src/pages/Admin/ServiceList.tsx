// src/components/ServiceList.tsx
import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useServiceController } from "@/controllers/Admin/ServiceController";
import Layout from "@/components/Layout/Layout";

const ServiceList: React.FC = () => {
  const {
    services,
    open,
    loading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    editingService,
    newService,
    errors,
    setNewService,
    handleAdd,
    handleEdit,
    handleDelete,
    handleClose,
    handleSave,
    handleSnackbarClose,
  } = useServiceController();

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">Manage Services</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Add Service
          </Button>
        </Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
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
          <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
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
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default ServiceList;
