import React, { useState, useEffect, useMemo } from 'react';
import ReservationDetailModel from '@/models/ReservationDetailModel';
import Layout from '@/components/Layout/Layout';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { fetchReservations, updateReservation } from '@/services/api';
import StaffLayout from '@/components/Layout/StaffLayout';

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // State for status filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetailModel | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const fetchedReservations: ReservationDetailModel[] = await fetchReservations();
        setReservations(fetchedReservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reservations. Please try again later.');
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleSearch = () => {
    const filteredReservations = reservations.filter((reservation) =>
      reservation.customer.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || reservation.status === statusFilter)
    );
    setReservations(filteredReservations);
  };

  const handleDetail = (reservation: ReservationDetailModel) => {
    setSelectedReservation(reservation);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;

    setUpdating(true);
    try {
        const updatedReservation = await updateReservation(selectedReservation._id, {
            status: selectedReservation.status,
           // paymentStatus: selectedReservation.paymentStatus,
        });

        // Convert the updatedReservation (which might be of type ReservationModel) to ReservationDetailModel
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


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  const displayedReservations = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return reservations.slice(startIndex, startIndex + rowsPerPage);
  }, [reservations, page, rowsPerPage]);

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
            sx={{ mr: 2 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              // onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={handleSearch}>
            Search
          </Button>
        </Box>
        {reservations.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary">
            No reservations found.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
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
                  {displayedReservations.map((reservation) => (
                    <TableRow key={reservation._id}>
                      <TableCell>{reservation.customer.username}</TableCell>
                      <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>{reservation.type}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() => handleDetail(reservation)}
                        >
                          View Details
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
              count={reservations.length}
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
      </Box>
    </StaffLayout>
  );
};

export default ReservationList;
