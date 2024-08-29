import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#333', color: '#fff', padding: '30px 0', textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography variant="body2">&copy; 2024 ABC Restaurant. All rights reserved.</Typography>
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          <a href="#privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</a> | 
          <a href="#terms" style={{ color: '#fff', textDecoration: 'none' }}>Terms of Service</a> | 
          <a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
