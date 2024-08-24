import React from 'react';
import { Grid, Box } from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../components/Layout/StaffLayout';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StaffLayout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <DashboardCard
              title="Manage Reservations"
              description="View and manage customer reservations."
              icon={EventAvailableIcon}
              onClick={() => navigate('/staff/reservations')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Queries"
              description="View and respond to customer queries."
              icon={QuestionAnswerIcon}
              onClick={() => navigate('/staff/queries')}
            />
          </Grid>
          <Grid item>
            <DashboardCard
              title="Manage Payments"
              description="View and process customer payments."
              icon={PaymentIcon}
              onClick={() => navigate('/staff/payments')}
            />
          </Grid>
        </Grid>
      </Box>
    </StaffLayout>
  );
};

export default StaffDashboard;
