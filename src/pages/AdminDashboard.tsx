import React from 'react';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'; // Correct styled import
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReportIcon from '@mui/icons-material/Report';
import BuildIcon from '@mui/icons-material/Build';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const DashboardCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  backgroundColor: '#fff',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'inline-block',
}));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Reduced Horizontal Padding (p: 2) */}
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4 }}>
          Restaurant Admin Panel
        </Typography>

        {/* Reduced Grid spacing (Spacing: 3 instead of 4) */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/services')}>
              <CardContent>
                <IconContainer>
                  <RestaurantMenuIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Services</Typography>
                <Typography variant="body2" color="textSecondary">
                  Add, edit, and remove restaurant services.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/offers')}>
              <CardContent>
                <IconContainer>
                  <LocalOfferIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Offers</Typography>
                <Typography variant="body2" color="textSecondary">
                  Create and manage promotions and offers.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/facilities')}>
              <CardContent>
                <IconContainer>
                  <HomeWorkIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Facilities</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage facilities at different locations.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/reservations')}>
              <CardContent>
                <IconContainer>
                  <EventAvailableIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Reservations</Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage customer reservations.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/queries')}>
              <CardContent>
                <IconContainer>
                  <QuestionAnswerIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Queries</Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage customer queries.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/users')}>
              <CardContent>
                <IconContainer>
                  <PeopleIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Users</Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage user roles and access levels.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/reports')}>
              <CardContent>
                <IconContainer>
                  <ReportIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">View Reports</Typography>
                <Typography variant="body2" color="textSecondary">
                  Generate and view business reports.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/gallery')}>
              <CardContent>
                <IconContainer>
                  <PhotoLibraryIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Manage Gallery</Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage gallery images.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/dish')}>
              <CardContent>
                <IconContainer>
                  <BuildIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Menu Items</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage system settings and configurations.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/ordermanage')}>
              <CardContent>
                <IconContainer>
                  <PaymentIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6">Order Management</Typography>
                <Typography variant="body2" color="textSecondary">
                  View and process customer orders.
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
