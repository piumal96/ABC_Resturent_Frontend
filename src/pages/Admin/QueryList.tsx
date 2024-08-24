import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const queriesData = [
  { id: 1, customer: 'John Doe', subject: 'Reservation Issue', status: 'Open' },
  { id: 2, customer: 'Jane Smith', subject: 'Payment Problem', status: 'In Progress' },
  { id: 3, customer: 'Alice Johnson', subject: 'Feedback', status: 'Resolved' },
];

const QueryList: React.FC = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState(queriesData);
  const [filterStatus, setFilterStatus] = useState('');

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const status = event.target.value;
    setFilterStatus(status);
    if (status) {
      setQueries(queriesData.filter((query) => query.status === status));
    } else {
      setQueries(queriesData);
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/queries/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Manage Customer Queries
      </Typography>
      <FormControl variant="outlined" sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          label="Status"
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{query.customer}</TableCell>
                <TableCell>{query.subject}</TableCell>
                <TableCell>{query.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleDetail(query.id)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QueryList;
