import React, { ReactNode, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode; // Define the type of children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header onSidebarToggle={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Offset for the AppBar
        }}
      >
        {children} {/* Render children here */}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
