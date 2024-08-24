import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
