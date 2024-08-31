import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Ensure navigation after logout
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ paddingRight: 2, paddingLeft: 2 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onSidebarToggle}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ABC Restaurant Admin Dashboard
        </Typography>

        <IconButton color="inherit" onClick={handleHomeClick} sx={{ marginRight: 2 }}>
          <HomeIcon />
        </IconButton>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 3 }}>
              Welcome, {user.username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              sx={{ marginLeft: 1, fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
