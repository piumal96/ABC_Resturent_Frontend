import React, { useState, useEffect, useMemo } from "react";
import ReservationDetailModel from "@/models/ReservationDetailModel";
import Layout from "@/components/Layout/Layout";
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
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { fetchReservations, updateReservation } from "@/services/api";

const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reservations, setReservations] = useState<ReservationDetailModel[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetailModel | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const fetchedReservations: ReservationDetailModel[] =
          await fetchReservations();
        setReservations(fetchedReservations);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reservations. Please try again later.");
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleSearch = () => {
    const filteredReservations = reservations.filter(
      (reservation) =>
        reservation.customer.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (statusFilter === "" || reservation.status === statusFilter)
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

  const handleConfirmReservation = async () => {
    if (!selectedReservation) return;

    try {
      const updatedReservation = await updateReservation(
        selectedReservation._id,
        { status: "Confirmed" }
      );

      // Convert the ReservationModel to ReservationDetailModel
      const updatedReservationDetail = new ReservationDetailModel(
        updatedReservation
      );

      setReservations((prev) =>
        prev.map((res) =>
          res._id === updatedReservationDetail._id
            ? updatedReservationDetail
            : res
        )
      );
      setSnackbarMessage(`Confirmed reservation with ID: ${selectedReservation._id}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to confirm reservation", error);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      const updatedReservation = await updateReservation(
        selectedReservation._id,
        { status: "Cancelled" }
      );

      // Convert the ReservationModel to ReservationDetailModel
      const updatedReservationDetail = new ReservationDetailModel(
        updatedReservation
      );

      setReservations((prev) =>
        prev.map((res) =>
          res._id === updatedReservationDetail._id
            ? updatedReservationDetail
            : res
        )
      );
      setSnackbarMessage(`Cancelled reservation with ID: ${selectedReservation._id}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to cancel reservation", error);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedReservation) return;

    try {
      const updatedReservation = await updateReservation(
        selectedReservation._id,
        { paymentStatus: "Completed" }
      );

      // Convert the ReservationModel to ReservationDetailModel
      const updatedReservationDetail = new ReservationDetailModel(
        updatedReservation
      );

      setReservations((prev) =>
        prev.map((res) =>
          res._id === updatedReservationDetail._id
            ? updatedReservationDetail
            : res
        )
      );
      setSnackbarMessage(`Confirmed payment for reservation with ID: ${selectedReservation._id}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to confirm payment", error);
    } finally {
      handleCloseConfirmDialog();
    }
  };



  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setStatusFilter(event.target.value as string);
  };

  const displayedReservations = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return reservations.slice(startIndex, startIndex + rowsPerPage);
  }, [reservations, page, rowsPerPage]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" mb={3}>
          Manage Reservations
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            label="Search by Customer Name"
            placeholder="Enter customer name..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
            fullWidth={isMobile}
          />
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: isMobile ? "100%" : 150, mr: 2 }}
            fullWidth={isMobile}
          >
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              // onChange={handleStatusFilterChange}
              label="Status"
              displayEmpty
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
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
                    <TableCell>Payment Status</TableCell>{" "}
                    {/* New column header */}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReservations.map((reservation) => (
                    <TableRow key={reservation._id} hover>
                      <TableCell>{reservation.customer.username}</TableCell>
                      <TableCell>
                        {new Date(reservation.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>{reservation.type}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>{reservation.paymentStatus}</TableCell>{" "}
                      {/* New column data */}
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

        {/* Confirm Navigation Dialog */}
        {selectedReservation && (
          <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} fullWidth maxWidth="sm">
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Customer:</strong> {selectedReservation.customer.username}
                <br />
                <strong>Date:</strong> {new Date(selectedReservation.date).toLocaleDateString()}
                <br />
                <strong>Time:</strong> {selectedReservation.time}
                <br />
                <strong>Type:</strong> {selectedReservation.type}
                <br />
                <strong>Status:</strong> {selectedReservation.status}
                <br />
                <strong>Payment Status:</strong> {selectedReservation.paymentStatus}
                <br />
                <strong>Special Requests:</strong> {selectedReservation.specialRequests}
                <br />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {selectedReservation.status === "Pending" && (
                <>
                  <Button onClick={handleCancelReservation} color="secondary">
                    Cancel Reservation
                  </Button>
                  <Button onClick={handleConfirmReservation} color="primary">
                    Confirm Reservation
                  </Button>
                </>
              )}
              {selectedReservation.paymentStatus === "Pending" && (
                <Button onClick={handleConfirmPayment} color="primary">
                  Confirm Payment
                </Button>
              )}
              <Button onClick={handleCloseConfirmDialog}>Close Details</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Layout>
  );
};

export default ReservationList;
