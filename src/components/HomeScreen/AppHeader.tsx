import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AppHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4caf50' }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          ABC Restaurant
        </Typography>
        <Button color="inherit" href="#services">Services</Button>
        <Button color="inherit" href="#offers">Offers</Button>
        <Button color="inherit" href="#gallery">Gallery</Button>
        <Button color="inherit" onClick={() => navigate('/customer/reservation')}>Reservations</Button>
        <Button color="inherit" href="#contact">Contact</Button>
        {isAuthenticated ? (
          <>
            <Typography variant="h6" sx={{ marginRight: '20px' }}>
              Welcome, {user?.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
