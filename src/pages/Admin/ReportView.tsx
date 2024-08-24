import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ReportView: React.FC = () => {
  const { reportType } = useParams<{ reportType: string }>();
  const navigate = useNavigate();

  const getReportContent = () => {
    switch (reportType) {
      case 'reservations':
        return 'This is the Reservations Report.';
      case 'payments':
        return 'This is the Payments Report.';
      case 'queries':
        return 'This is the Queries Report.';
      case 'user-activity':
        return 'This is the User Activity Report.';
      default:
        return 'Unknown report type.';
    }
  };

  if (!reportType) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Report type is missing or invalid.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/reports')}>
          Back to Report Generator
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 800 }}>
        <Typography variant="h4" gutterBottom>
          {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {getReportContent()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/reports')}>
            Back to Report Generator
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportView;
