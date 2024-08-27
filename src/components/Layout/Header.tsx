import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook

const Header: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth(); // Get the user and logout function from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onSidebarToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ABC Restaurant Admin Dashboard
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Welcome, {user.username} {/* Display the user's name */}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
