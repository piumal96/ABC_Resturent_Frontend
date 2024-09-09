import React from "react";
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
import Layout from "@/components/Layout/Layout";
import { useReservationController } from "@/controllers/Admin/ReservationController";

const ReservationList: React.FC = () => {
  const {
    reservations,
    searchTerm,
    statusFilter,
    loading,
    error,
    page,
    rowsPerPage,
    confirmDialogOpen,
    selectedReservation,
    snackbarOpen,
    snackbarMessage,
    setSearchTerm,
    setStatusFilter,
    handleSearch,
    handleDetail,
    handleCloseConfirmDialog,
    handleConfirmReservation,
    handleCancelReservation,
    handleChangePage,
    handleChangeRowsPerPage,
    displayedReservations,
    handleSnackbarClose,
  } = useReservationController();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Search by Customer Name"
            placeholder="Enter customer name..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, flex: isMobile ? "1 1 100%" : "auto" }}
          />
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: isMobile ? "100%" : 150, mr: 2, flex: isMobile ? "1 1 100%" : "auto" }}
          >
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              displayEmpty
              onChange={(e) => setStatusFilter(e.target.value)}
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
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReservations.map((reservation) => (
                    <TableRow key={reservation._id || "unknown-id"} hover>
                      <TableCell>{reservation?.customer?.username || "null"}</TableCell>
                      <TableCell>{reservation?.date ? new Date(reservation.date).toLocaleDateString() : "null"}</TableCell>
                      <TableCell>{reservation?.time || "null"}</TableCell>
                      <TableCell>{reservation?.type || "null"}</TableCell>
                      <TableCell>{reservation?.status || "null"}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" onClick={() => handleDetail(reservation)}>
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

        {selectedReservation && (
          <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} fullWidth maxWidth="sm">
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Customer:</strong> {selectedReservation?.customer?.username || "null"}
                <br />
                <strong>Date:</strong> {selectedReservation?.date ? new Date(selectedReservation.date).toLocaleDateString() : "null"}
                <br />
                <strong>Time:</strong> {selectedReservation?.time || "null"}
                <br />
                <strong>Type:</strong> {selectedReservation?.type || "null"}
                <br />
                <strong>Status:</strong> {selectedReservation?.status || "null"}
                <br />
                <strong>Special Requests:</strong> {selectedReservation?.specialRequests || "null"}
                <br />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {selectedReservation?.status === "Pending" && (
                <>
                  <Button onClick={handleCancelReservation} color="secondary">
                    Cancel Reservation
                  </Button>
                  <Button onClick={handleConfirmReservation} color="primary">
                    Confirm Reservation
                  </Button>
                </>
              )}
              <Button onClick={handleCloseConfirmDialog}>Close Details</Button>
            </DialogActions>
          </Dialog>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage || "Operation completed"}
        />
      </Box>
    </Layout>
  );
};

export default ReservationList;
