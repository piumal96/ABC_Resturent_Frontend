import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TextField,
  Button,
  Grid,
  Typography,
  Badge,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Collapse,
  TextareaAutosize,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Layout from '@/components/Layout/Layout';
import { useQueryController } from '@/controllers/Admin/QueryController';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import SyncIcon from '@mui/icons-material/Sync';

const QueryList: React.FC = () => {
  const {
    filter,
    filteredQueries,
    replyMessage,
    expandedQueryId,
    queryToDelete,
    setQueryToDelete,
    handleFilterChange,
    handleSearch,
    handleRowClick,
    handleReplyChange,
    handleSendReply,
    handleDeleteConfirmation,
    handleConfirmDelete,
    getStatusColor,
  } = useQueryController();

  // UI state for snackbars and real-time status updates
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Helper function to get status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <HourglassEmptyIcon color="warning" />;
      case 'Resolved':
        return <DoneIcon color="success" />;
      case 'In Progress':
        return <SyncIcon color="info" />;
      default:
        return null;
    }
  };

  // Real-time status update for reply
  const handleRealTimeReply = async () => {
    try {
      await handleSendReply(); // Call the reply API function
      setSnackbarMessage('Reply sent successfully, and status updated!');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to send reply.');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  return (
    <Layout>
      <Paper style={{ padding: '24px', marginTop: '24px', borderRadius: '12px' }}>
        <Grid container spacing={2} alignItems="center" style={{ marginBottom: '16px' }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Filter by Subject or Date"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              variant="outlined"
              placeholder="e.g., Inquiry about reservation, 2024-08-30"
              style={{ borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              startIcon={<SearchIcon />}
              style={{ borderRadius: '8px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <TableContainer style={{ marginTop: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Query ID</TableCell>
                <TableCell>Customer Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <React.Fragment key={query._id}>
                    <TableRow
                      onClick={() => handleRowClick(query._id)}
                      style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                    >
                      <TableCell>{query._id}</TableCell>
                      <TableCell>{query.customer?.email ?? 'N/A'}</TableCell>
                      <TableCell>{query.subject ?? 'N/A'}</TableCell>
                      <TableCell>
                        <Badge badgeContent={query.status} color={getStatusColor(query.status)}>
                          {getStatusIcon(query.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{query.createdAt ? query.createdAt.toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Tooltip title="Reply">
                          <IconButton color="primary" onClick={() => handleRowClick(query._id)}>
                            <ReplyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteConfirmation(query)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedQueryId === query._id} timeout="auto" unmountOnExit>
                          <div style={{ margin: 16 }}>
                            <Typography variant="subtitle1">Message:</Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {query.message ?? 'No message available.'}
                            </Typography>
                            <div style={{ marginTop: 16 }}>
                              <TextareaAutosize
                                minRows={3}
                                placeholder="Write your reply here..."
                                style={{ width: '100%' }}
                                value={replyMessage}
                                onChange={(e) => handleReplyChange(e.target.value)}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SendIcon />}
                                onClick={handleRealTimeReply} // Trigger real-time reply with status update
                                style={{ marginTop: 8 }}
                                disabled={!replyMessage.trim()} // Disable if reply is empty
                              >
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body1" align="center">
                      No queries found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={Boolean(queryToDelete)}
          onClose={() => setQueryToDelete(null)} // Use setQueryToDelete to close the dialog
          aria-labelledby="confirm-delete-dialog-title"
          aria-describedby="confirm-delete-dialog-description"
        >
          <DialogTitle id="confirm-delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography id="confirm-delete-dialog-description">
              Are you sure you want to delete this query? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQueryToDelete(null)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary" variant="contained">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert onClose={() => setShowSnackbar(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Layout>
  );
};

export default QueryList;
