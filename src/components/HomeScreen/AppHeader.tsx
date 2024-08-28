import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AppHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle user logout and navigate to the login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigate based on the user's role
  const handleRoleBasedNavigation = () => {
    switch (user?.role) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'Staff':
        navigate('/staff/dashboard');
        break;
      case 'Customer':
        navigate('/customer/reservations');
        break;
      default:
        navigate('/login');
    }
  };

  // Determine the appropriate label for the dashboard button
  const getButtonLabel = () => {
    switch (user?.role) {
      case 'Admin':
        return 'Admin Dashboard';
      case 'Staff':
        return 'Staff Dashboard';
      case 'Customer':
        return 'Track Reservations';
      default:
        return 'Dashboard';
    }
  };

  // Open the menu when the avatar is clicked
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4caf50', padding: '0 20px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Branding or logo */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          ABC Restaurant
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {['Services', 'Offers', 'Gallery', 'Reservations', 'Contact'].map((item, index) => (
            <Button
              key={index}
              color="inherit"
              onClick={() => navigate(`/${item.toLowerCase()}`)}
              sx={{
                '&:hover': {
                  backgroundColor: '#388e3c',
                },
              }}
            >
              {item}
            </Button>
          ))}
          
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Avatar and Dropdown Menu */}
              <IconButton 
                onClick={handleMenuClick} 
                sx={{ 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: '#388e3c',
                  },
                }}
                aria-label="user-menu"
              >
                <Avatar alt={user?.username} src="/path/to/avatar.jpg" sx={{ width: 36, height: 36 }} />
                <ArrowDropDownIcon />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '40px' }}  // Reduced the gap slightly for a tighter appearance
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => { handleRoleBasedNavigation(); handleMenuClose(); }}>
                  {getButtonLabel()}
                </MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
              </Menu>

              {/* Welcome Text with Role */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                Welcome, <span style={{ fontWeight: 'normal', color: '#ffffff' }}>{user?.role}</span>
              </Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
