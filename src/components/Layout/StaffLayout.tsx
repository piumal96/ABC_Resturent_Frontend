import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const StaffLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth(); // Assuming you have user and logout methods in your AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  const handleHomeNavigation = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5', padding: '0 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Home button and Dashboard title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Home">
              <IconButton edge="start" color="inherit" onClick={handleHomeNavigation} sx={{ marginRight: 2 }}>
                <HomeIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Staff Dashboard
            </Typography>
          </Box>

          {/* Right side: Username and Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 2, fontWeight: 'bold', color: '#ffffff' }}>
              {user?.username || 'User'} {/* Dynamically display the username */}
            </Typography>
            <Tooltip title="Profile">
              <IconButton color="inherit">
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Log Out">
              <IconButton edge="end" color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
                <LogoutIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          padding: {
            xs: 2, // 16px padding on extra-small screens
            sm: 3, // 24px padding on small screens
            md: 4, // 32px padding on medium screens
            lg: 5, // 40px padding on large screens
          },
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)', // Ensure the content area takes up the remaining height
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default StaffLayout;
