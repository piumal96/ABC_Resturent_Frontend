import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const queryDetails: { [key: string]: { customer: string; subject: string; status: string; message: string } } = {
  '1': { customer: 'John Doe', subject: 'Reservation Issue', status: 'Open', message: 'I had trouble making a reservation.' },
  '2': { customer: 'Jane Smith', subject: 'Payment Problem', status: 'In Progress', message: 'I was charged twice for my order.' },
  '3': { customer: 'Alice Johnson', subject: 'Feedback', status: 'Resolved', message: 'Great service! Just wanted to say thanks.' },
};

const QueryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ensure the query exists before attempting to access it
  const query = id ? queryDetails[id] : undefined;

  if (!query) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" color="error">
          Query not found.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/queries')}>
          Back to List
        </Button>
      </Box>
    );
  }

  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    console.log(`Responding to query ${id} with: ${response}`);
    // Handle the response submission (e.g., send to a backend)
    navigate('/queries');
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          Query Details
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Customer:</strong> {query.customer}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Subject:</strong> {query.subject}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Status:</strong> {query.status}
        </Typography>
        <Typography variant="body1" mb={2}>
          <strong>Message:</strong> {query.message}
        </Typography>
        <TextField
          label="Your Response"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Send Response
          </Button>
          <Button variant="outlined" onClick={() => navigate('/queries')}>
            Back to List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default QueryDetail;
