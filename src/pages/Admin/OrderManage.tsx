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
  Alert,
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
                    <TableCell>Delivery Address</TableCell>
                    <TableCell>Total Price</TableCell>
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
                      <TableCell>{order?.deliveryAddress || "null"}</TableCell>
                      <TableCell>{order?.totalPrice?.toFixed(2) || "0.00"}</TableCell>
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
         <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} fullWidth maxWidth="md">
         <DialogTitle>Order Details</DialogTitle>
         <DialogContent>
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 1 }}>Customer Details</Typography>
             <Typography variant="body1"><strong>Name:</strong> {selectedOrder?.customer?.username || "Unknown"}</Typography>
             <Typography variant="body1"><strong>Delivery Address:</strong> {selectedOrder?.deliveryAddress || "No address provided"}</Typography>
           </Box>
       
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 1 }}>Order Information</Typography>
             <Typography variant="body1"><strong>Restaurant:</strong> {selectedOrder?.restaurant?.name || "Unknown"}</Typography>
             <Typography variant="body1">
               <strong>Order Status:</strong> 
               <span style={{ color: selectedOrder?.orderStatus === "Pending" ? "orange" : selectedOrder?.orderStatus === "Confirmed" ? "green" : "red" }}>
                 {selectedOrder?.orderStatus || "Unknown"}
               </span>
             </Typography>
           </Box>
       
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 1 }}>Payment Information</Typography>
             <Typography variant="body1">
               <strong>Payment Status:</strong> 
               <span style={{ color: selectedOrder?.paymentStatus === "Paid" ? "green" : "red" }}>
                 {selectedOrder?.paymentStatus || "Unknown"}
               </span>
             </Typography>
             <Typography variant="body1"><strong>Total Price for Order:</strong> Rs {selectedOrder?.totalPrice.toFixed(2) || "0.00"}</Typography>
           </Box>
       
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 1 }}>Items Ordered</Typography>
             {selectedOrder.items.length > 0 ? (
               <TableContainer component={Paper}>
                 <Table size="small">
                   <TableHead>
                     <TableRow>
                       <TableCell>Dish Name</TableCell>
                       <TableCell>Description</TableCell>
                       <TableCell>Quantity</TableCell>
                       <TableCell>Price</TableCell>
                       <TableCell>Customizations</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {selectedOrder.items.map((item) => (
                       <TableRow key={item._id}>
                         <TableCell>{item.dish.name}</TableCell>
                         <TableCell>{item.dish.description}</TableCell>
                         <TableCell>{item.quantity}</TableCell>
                         <TableCell>Rs {item.totalPrice.toFixed(2)}</TableCell>
                         <TableCell>
                           {item.dish.customizations.length > 0 ? (
                             <ul>
                               {item.dish.customizations.map((customization, index) => (
                                 <li key={index}>{customization.name}: {customization.options.join(", ")}</li>
                               ))}
                             </ul>
                           ) : "None"}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>
             ) : (
               <Typography variant="body2" color="textSecondary">No items in this order.</Typography>
             )}
           </Box>
         </DialogContent>
         <DialogActions>
           {selectedOrder?.orderStatus === "Pending" && (
             <>
               <Button onClick={handleCancelOrder} color="secondary">Cancel Order</Button>
               <Button onClick={handleConfirmOrder} color="primary">Confirm Order</Button>
             </>
           )}
           {selectedOrder?.paymentStatus === "Pending" && (
             <Button onClick={handleConfirmPayment} color="primary">Confirm Payment</Button>
           )}
           <Button onClick={handleCloseConfirmDialog}>Close</Button>
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
