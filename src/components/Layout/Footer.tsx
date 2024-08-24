import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 ABC Restaurant. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
