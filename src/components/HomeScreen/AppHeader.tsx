import React, { useState, useEffect } from 'react';
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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Tooltip,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReservationTrackingDialog from '@/components/ReservationTrackingDialog';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Cart Icon

const AppHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart items

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Mock: Replace with API call to get the number of items in the user's cart
    const fetchCartItems = async () => {
      const cartItems = 3; // Replace with actual logic
      setCartItemCount(cartItems);
    };

    fetchCartItems();
  }, []);

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

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerItems = (
    <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
      <List>
        <ListItem button onClick={() => scrollToSection('services')}>
          <ListItemText primary="Services" />
        </ListItem>
        <ListItem button onClick={() => scrollToSection('offers')}>
          <ListItemText primary="Offers" />
        </ListItem>
        <ListItem button onClick={() => scrollToSection('gallery')}>
          <ListItemText primary="Gallery" />
        </ListItem>
        <ListItem button onClick={() => scrollToSection('contact')}>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4caf50', padding: '0 20px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ABC Restaurant
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(true)}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                  {drawerItems}
                </Drawer>
              </>
            ) : (
              <>
                <Tooltip title="View our Services">
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection('services')}
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Services
                  </Button>
                </Tooltip>
                <Tooltip title="View our Services">
                  <Button
                    color="inherit"
                    onClick={() => navigate('/menu')} 
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Menu
                  </Button>
                </Tooltip>
                <Tooltip title="View our Services">
                  <Button
                    color="inherit"
                    onClick={() => navigate('/track')} 
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Order
                  </Button>
                </Tooltip>
                <Tooltip title="Check our Offers">
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection('offers')}
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Offers
                  </Button>
                </Tooltip>
                <Tooltip title="Explore our Gallery">
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection('gallery')}
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Gallery
                  </Button>
                </Tooltip>
                <Tooltip title="Get in Touch">
                  <Button
                    color="inherit"
                    onClick={() => scrollToSection('contact')}
                    sx={{ '&:hover': { backgroundColor: '#357a38' } }}
                  >
                    Contact
                  </Button>
                </Tooltip>
              </>
            )}

            {/* Cart Button */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')} 
              sx={{ '&:hover': { backgroundColor: '#357a38' } }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { backgroundColor: '#357a38' }
                  }}
                  aria-label="user-menu"
                >
                  <Avatar alt={user?.username} src="https://i.pravatar.cc/300" sx={{ width: 36, height: 36 }} />
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
                  Welcome, <span style={{ fontWeight: 'normal', color: '#ffffff' }}>{user?.username}</span>
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
