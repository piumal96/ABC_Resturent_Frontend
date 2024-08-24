import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReportIcon from '@mui/icons-material/Report';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ width: drawerWidth }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/services">
            <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
            <ListItemText primary="Services" />
          </ListItem>
          <ListItem button component={Link} to="/offers">
            <ListItemIcon><LocalOfferIcon /></ListItemIcon>
            <ListItemText primary="Offers" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/reports">
            <ListItemIcon><ReportIcon /></ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
