import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const navigate = useNavigate();

  const handleGenerateReport = () => {
    if (reportType) {
      navigate(`/reports/${reportType}`);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Generate Reports
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            label="Report Type"
          >
            <MenuItem value="reservations">Reservations Report</MenuItem>
            <MenuItem value="payments">Payments Report</MenuItem>
            <MenuItem value="queries">Queries Report</MenuItem>
            <MenuItem value="user-activity">User Activity Report</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateReport}
          disabled={!reportType}
        >
          Generate Report
        </Button>
      </Paper>
    </Box>
  );
};

export default ReportGenerator;
