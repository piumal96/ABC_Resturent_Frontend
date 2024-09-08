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
  CircularProgress,
  Snackbar,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Alert, // Importing Alert component here
} from "@mui/material";
import Layout from "@/components/Layout/Layout";
import { useOrderController } from "@/controllers/OrderController";

const OrderList: React.FC = () => {
  const {
    orders,
    loading,
    error,
    page,
    rowsPerPage,
    confirmDialogOpen,
    selectedOrder,
    snackbarOpen,
    snackbarMessage,
    handleDetail,
    handleCloseConfirmDialog,
    handleConfirmOrder,
    handleCancelOrder,
    handleConfirmPayment,
    handleChangePage,
    handleChangeRowsPerPage,
    displayedOrders,
    handleSnackbarClose,
  } = useOrderController();

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
          Manage Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary">
            No orders found.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Restaurant</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedOrders.map((order) => (
                    <TableRow key={order._id || "unknown-id"} hover>
                      <TableCell>{order?.customer?.username || "null"}</TableCell>
                      <TableCell>{order?.restaurant?.name || "null"}</TableCell>
                      <TableCell>{order?.orderStatus || "null"}</TableCell>
                      <TableCell>{order?.paymentStatus || "null"}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" onClick={() => handleDetail(order)}>
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
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        {selectedOrder && (
          <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} fullWidth maxWidth="sm">
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Customer:</strong> {selectedOrder?.customer?.username || "null"}
                <br />
                <strong>Restaurant:</strong> {selectedOrder?.restaurant?.name || "null"}
                <br />
                <strong>Status:</strong> {selectedOrder?.orderStatus || "null"}
                <br />
                <strong>Payment Status:</strong> {selectedOrder?.paymentStatus || "null"}
                <br />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {selectedOrder?.orderStatus === "Pending" && (
                <>
                  <Button onClick={handleCancelOrder} color="secondary">
                    Cancel Order
                  </Button>
                  <Button onClick={handleConfirmOrder} color="primary">
                    Confirm Order
                  </Button>
                </>
              )}
              {selectedOrder?.paymentStatus === "Pending" && (
                <Button onClick={handleConfirmPayment} color="primary">
                  Confirm Payment
                </Button>
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

export default OrderList;
