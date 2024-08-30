// components/AppHeader.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReservationTrackingDialog from '@/components/ReservationTrackingDialog';

const AppHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleRoleBasedNavigation = () => {
    switch (user?.role) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'Staff':
        navigate('/staff/dashboard');
        break;
      case 'Customer':
        setDialogOpen(true);
        break;
      default:
        navigate('/login');
    }
  };

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4caf50', padding: '0 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
            ABC Restaurant
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => scrollToSection('services')}
              sx={{ '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Services
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('offers')}
              sx={{ '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Offers
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('gallery')}
              sx={{ '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Gallery
            </Button>
            {/* <Button
              color="inherit"
              onClick={() => scrollToSection('reservations')}
              sx={{ '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Reservations
            </Button> */}
            <Button
              color="inherit"
              onClick={() => scrollToSection('contact')}
              sx={{ '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Contact
            </Button>
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={handleMenuClick}
                  sx={{ padding: 0, display: 'flex', alignItems: 'center', '&:hover': { backgroundColor: '#388e3c' } }}
                  aria-label="user-menu"
                >
                  <Avatar alt={user?.username} src="/path/to/avatar.jpg" sx={{ width: 36, height: 36 }} />
                  <ArrowDropDownIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    mt: '40px',
                    PaperProps: {
                      elevation: 3,
                      sx: {
                        overflow: 'visible',
                        mt: 1.5,
                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
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
                    },
                    MenuListProps: {
                      'aria-labelledby': 'basic-button',
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleRoleBasedNavigation(); handleMenuClose(); }}>
                    {getButtonLabel()}
                  </MenuItem>
                  <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                </Menu>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                  Welcome, <span style={{ fontWeight: 'normal', color: '#ffffff' }}>{user?.role}</span>
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Reservation Tracking Dialog */}
      {user && <ReservationTrackingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} userId={user.id} />}
    </>
  );
};

export default AppHeader;
