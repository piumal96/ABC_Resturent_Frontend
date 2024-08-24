import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TextField, Button } from '@mui/material';

const QueryList: React.FC = () => {
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
        label="Filter by Query Type or Date" 
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
              <TableCell>Query ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through queries data and display rows */}
            <TableRow>
              <TableCell>001</TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>2024-08-24</TableCell>
              <TableCell>Reservation Issue</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QueryList;
