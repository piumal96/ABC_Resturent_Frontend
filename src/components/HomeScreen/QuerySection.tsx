import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const QuerySection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '40px 0', backgroundColor: '#f0f0f0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
        Have a Question?
      </Typography>
      <TextField
        label="Your Query"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" fullWidth>Submit Query</Button>
    </Container>
  );
};

export default QuerySection;
