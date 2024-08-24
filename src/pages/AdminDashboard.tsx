import React from 'react';
import { Grid, Box } from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Facility icon
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <DashboardCard
              title="Manage Services"
              description="Add, edit, and remove restaurant services."
              icon={RestaurantMenuIcon}
              onClick={() => navigate('/services')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Offers"
              description="Create and manage promotions and offers."
              icon={LocalOfferIcon}
              onClick={() => navigate('/offers')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Facilities"
              description="Manage facilities at different locations."
              icon={HomeWorkIcon} // Facility management icon
              onClick={() => navigate('/facilities')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="View Reports"
              description="Generate and view business reports."
              icon={ReportIcon}
              onClick={() => navigate('/reports')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="System Settings"
              description="Manage system settings and configurations."
              icon={BuildIcon}
              onClick={() => navigate('/settings')}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
