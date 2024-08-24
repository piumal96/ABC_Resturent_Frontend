import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const StaffLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const username = 'Sapumal Kumara'; // This would typically be dynamic based on logged-in user data

  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing tokens, redirecting to login page, etc.
    console.log('User logged out');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Staff Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {username}
            </Typography>
            <Tooltip title="Log Out">
              <IconButton edge="end" color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          padding: {
            xs: 1, // 8px padding on extra-small screens
            sm: 2, // 16px padding on small screens
            md: 3, // 24px padding on medium screens
            lg: 4, // 32px padding on large screens
          },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default StaffLayout;
