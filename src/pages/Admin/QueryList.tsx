// src/pages/QueryList.tsx
import React from 'react';
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
  Menu,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Layout from '@/components/Layout/Layout';
import { useQueryController } from '@/controllers/Admin/QueryController';

const QueryList: React.FC = () => {
  const {
    filter,
    filteredQueries,
    replyMessage,
    expandedQueryId,
    anchorEl,
    queryToDelete,
    setQueryToDelete, // Ensure this is used from the controller
    handleFilterChange,
    handleSearch,
    handleRowClick,
    handleReplyChange,
    handleSendReply,
    handleDeleteConfirmation,
    handleConfirmDelete,
    handleMenuOpen,
    handleMenuClose,
    getStatusColor,
  } = useQueryController();

  return (
    <Layout>
      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Filter by Subject or Date"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              variant="outlined"
              placeholder="e.g., Inquiry about reservation, 2024-08-30"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              startIcon={<SearchIcon />}
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
                filteredQueries.map(query => (
                  <React.Fragment key={query._id}>
                    <TableRow onClick={() => handleRowClick(query._id)} style={{ cursor: 'pointer' }}>
                      <TableCell>{query._id}</TableCell>
                      <TableCell>{query.customer?.email ?? 'N/A'}</TableCell>
                      <TableCell>{query.subject ?? 'N/A'}</TableCell>
                      <TableCell>
                        <Badge badgeContent={query.status} color={getStatusColor(query.status)} />
                      </TableCell>
                      <TableCell>{query.createdAt ? query.createdAt.toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Tooltip title="More">
                          <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, query); }}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => handleRowClick(query._id)}>
                            <ReplyIcon color="primary" style={{ marginRight: 8 }} />
                            Reply
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteConfirmation(query)}>
                            <DeleteIcon color="error" style={{ marginRight: 8 }} />
                            Delete
                          </MenuItem>
                        </Menu>
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
                                onClick={handleSendReply}
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
      </Paper>
    </Layout>
  );
};

export default QueryList;
