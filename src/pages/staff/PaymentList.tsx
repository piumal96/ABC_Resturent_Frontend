import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TextField, Button } from '@mui/material';

const PaymentList: React.FC = () => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    // Implement search functionality based on filter
  };

  return (
    <Paper>
      <TextField 
        label="Filter by Date or Status" 
        value={filter} 
        onChange={handleFilterChange} 
        variant="outlined" 
        style={{ margin: '16px' }} 
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through payments data and display rows */}
            <TableRow>
              <TableCell>001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>2024-08-24</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PaymentList;
