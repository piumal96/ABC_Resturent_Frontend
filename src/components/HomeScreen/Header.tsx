// import React from 'react';
// import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/context/AuthContext';

// const AppHeader: React.FC = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleRoleBasedNavigation = () => {
//     // On successful login, navigate based on user role
//     if (user?.role === 'Admin') {
//       navigate('/admin'); // Admin dashboard
//     } else if (user?.role === 'Staff') {
//       navigate('/staff/dashboard'); // Staff dashboard
//     } else {
//       navigate('/customer/reservation'); // Default to customer reservation
//     }
//   };

//   const getButtonLabel = () => {
//     if (user?.role === 'admin') {
//       return 'Admin Dashboard';
//     } else if (user?.role === 'staff') {
//       return 'Staff Dashboard';
//     } else if (user?.role === 'customer') {
//       return 'Track Reservations';
//     } else {
//       return 'Track Reservations'; // Default label
//     }
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: '#4caf50', padding: '0 20px' }}>
//       <Toolbar>
//         <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
//           ABC Restaurant
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Button color="inherit" onClick={() => navigate('/services')} sx={{ margin: '0 10px' }}>Services</Button>
//           <Button color="inherit" onClick={() => navigate('/offers')} sx={{ margin: '0 10px' }}>Offers</Button>
//           <Button color="inherit" onClick={() => navigate('/gallery')} sx={{ margin: '0 10px' }}>Gallery</Button>
//           <Button color="inherit" onClick={() => navigate('/customer/reservation')} sx={{ margin: '0 10px' }}>Reservations</Button>
//           <Button color="inherit" onClick={() => navigate('/contact')} sx={{ margin: '0 10px' }}>Contact</Button>
//         </Box>
//         {isAuthenticated && (
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton sx={{ marginRight: '10px' }}>
//               <Avatar alt={user?.username} src="/path/to/avatar.jpg" />
//             </IconButton>
//             <Typography variant="h6" sx={{ marginRight: '20px', fontWeight: 'normal' }}>
//               Welcome, {user?.username}
//             </Typography>
//             <Button color="inherit" onClick={handleRoleBasedNavigation} sx={{ fontWeight: 'bold', margin: '0 10px' }}>
//               {getButtonLabel()}
//             </Button>
//             <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 'bold', margin: '0 10px' }}>Logout</Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default AppHeader;
