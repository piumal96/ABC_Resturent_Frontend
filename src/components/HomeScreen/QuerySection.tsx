import React, { useState } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Box, Alert } from '@mui/material';
import { createQuery } from '@/services/api'; // Assuming you have this API function
import QueryModel from '@/models/QueryModel'; // Import the QueryModel

const QuerySection: React.FC = () => {
  const [queryMessage, setQueryMessage] = useState<string>(''); // State to store the query message
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to handle loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State to show success message
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to show error message

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryMessage(event.target.value); // Update the query message state
  };

  const handleSubmit = async () => {
    if (!queryMessage) {
      setErrorMessage("Please enter your query before submitting.");
      return;
    }

    setIsSubmitting(true); // Set loading state
    setErrorMessage(null); // Reset error message

    try {
      // Create a new query object
      const newQuery: Partial<QueryModel> = {
        subject: 'General Inquiry', 
        message: queryMessage,
      //  customer: 'customerId' // Replace this with actual customer ID if available
      };

      // Submit the query using the createQuery function
      const response = await createQuery(newQuery);

      // Handle success (e.g., show a success message, clear the form)
      setSuccessMessage('Your query has been submitted successfully!');
      setQueryMessage(''); // Clear the input
    } catch (error) {
      console.error('Error submitting query:', error);
      setErrorMessage('Failed to submit your query. Please try again later.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <Container maxWidth="md" sx={{ padding: '40px 20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>
        Have a Question?
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Your Query"
        placeholder="Type your question or concern here..."
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={queryMessage}
        onChange={handleInputChange}
        sx={{ marginBottom: '20px', backgroundColor: '#f9f9f9' }}
        disabled={isSubmitting} // Disable input while submitting
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting} // Disable button while submitting
          sx={{ minWidth: '150px', minHeight: '50px' }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Query'}
        </Button>
      </Box>

      {successMessage && (
        <Typography variant="body1" sx={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>
          {successMessage}
        </Typography>
      )}
    </Container>
  );
};

export default QuerySection;
