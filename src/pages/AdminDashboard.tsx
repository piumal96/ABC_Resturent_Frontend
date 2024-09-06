import React from 'react';
import { Grid, Box } from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Facility icon
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // Reservation icon
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Query management icon
import PaymentIcon from '@mui/icons-material/Payment'; // Payment management icon
import PeopleIcon from '@mui/icons-material/People'; // User management icon
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'; // Gallery management icon
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
              title="Manage Reservations"
              description="View and manage customer reservations."
              icon={EventAvailableIcon} // Reservation management icon
              onClick={() => navigate('/reservations')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Queries"
              description="View and manage customer queries."
              icon={QuestionAnswerIcon} // Query management icon
              onClick={() => navigate('/queries')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Payments"
              description="View and process customer payments."
              icon={PaymentIcon} // Payment management icon
              onClick={() => navigate('/payments')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Users"
              description="View and manage user roles and access levels."
              icon={PeopleIcon} // User management icon
              onClick={() => navigate('/users')}
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
              title="Manage Gallery"
              description="View and manage gallery images."
              icon={PhotoLibraryIcon} // Gallery management icon
              onClick={() => navigate('/gallery')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Menu Items"
              description="Manage system settings and configurations."
              icon={BuildIcon}
              onClick={() => navigate('/dish')}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
