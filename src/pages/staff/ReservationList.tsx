import React, { useState, useEffect, useMemo } from 'react';
import ReservationDetailModel from '@/models/ReservationDetailModel';
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
  CircularProgress,
  Alert,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { fetchReservations, updateReservation, deleteReservation } from '@/services/api';
import StaffLayout from '@/components/Layout/StaffLayout';

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [displayedReservations, setDisplayedReservations] = useState<ReservationDetailModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetailModel | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const fetchedReservations: ReservationDetailModel[] = await fetchReservations();
        setReservations(fetchedReservations);
        setDisplayedReservations(fetchedReservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reservations. Please try again later.');
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  useEffect(() => {
    const filteredReservations = reservations.filter((reservation) =>
      reservation.customer.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || reservation.status === statusFilter)
    );
    setDisplayedReservations(filteredReservations);
  }, [searchTerm, statusFilter, reservations]);

  const handleDetail = (reservation: ReservationDetailModel) => {
    setSelectedReservation(reservation);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;

    setUpdating(true);
    try {
      const updatedReservation = await updateReservation(selectedReservation._id, {
        status: selectedReservation.status,
      });

      const updatedDetailReservation = new ReservationDetailModel(updatedReservation);

      setReservations(prevReservations =>
        prevReservations.map(res =>
          res._id === updatedDetailReservation._id ? updatedDetailReservation : res
        )
      );

      setUpdating(false);
      handleCloseConfirmDialog();
    } catch (err) {
      console.error('Failed to update reservation:', err);
      setUpdating(false);
    }
  };

  const handleDeleteReservation = async () => {
    if (!selectedReservation) return;

    setUpdating(true);
    try {
      await deleteReservation(selectedReservation._id);

      setReservations(prevReservations =>
        prevReservations.filter(res => res._id !== selectedReservation._id)
      );

      setUpdating(false);
      handleCloseDeleteDialog();
      handleCloseConfirmDialog();
    } catch (err) {
      console.error('Failed to delete reservation:', err);
      setUpdating(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <StaffLayout>
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
            InputProps={{
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
        {displayedReservations.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary">
            No reservations found.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation) => (
                    <TableRow 
                      key={reservation._id} 
                      sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}
                    >
                      <TableCell>{reservation.customer.username}</TableCell>
                      <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>{reservation.type}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() => handleDetail(reservation)}
                          startIcon={<VisibilityIcon />}
                          sx={{ mr: 1 }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            handleOpenDeleteDialog();
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayedReservations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        {/* Confirm Update Dialog */}
        {selectedReservation && (
          <Dialog
            open={confirmDialogOpen}
            onClose={handleCloseConfirmDialog}
          >
            <DialogTitle>Update Reservation Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Customer:</strong> {selectedReservation.customer.username}<br />
                <strong>Date:</strong> {new Date(selectedReservation.date).toLocaleDateString()}<br />
                <strong>Time:</strong> {selectedReservation.time}<br />
                <strong>Type:</strong> {selectedReservation.type}<br />
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedReservation.status}
                        onChange={(e) => setSelectedReservation({
                          ...selectedReservation,
                          status: e.target.value as string
                        })}
                        label="Status"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        value={selectedReservation.paymentStatus}
                        onChange={(e) => setSelectedReservation({
                          ...selectedReservation,
                          paymentStatus: e.target.value as string
                        })}
                        label="Payment Status"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <strong>Special Requests:</strong> {selectedReservation.specialRequests}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} disabled={updating}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateReservation}
                color="primary"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Reservation'}
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Confirm Delete Dialog */}
        {selectedReservation && (
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this reservation for <strong>{selectedReservation.customer.username}</strong> on <strong>{new Date(selectedReservation.date).toLocaleDateString()}</strong> at <strong>{selectedReservation.time}</strong>?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} disabled={updating}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteReservation}
                color="error"
                disabled={updating}
              >
                {updating ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </StaffLayout>
  );
};

export default ReservationList;
