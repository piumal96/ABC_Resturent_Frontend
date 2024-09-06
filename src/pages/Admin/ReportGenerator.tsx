// src/pages/Admin/ReportDashboard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Pagination,
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import InfoIcon from '@mui/icons-material/Info';
import { useReportController } from '@/controllers/Admin/ReportController';
import Layout from '@/components/Layout/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartTooltip, Legend);

const ReportDashboard: React.FC = () => {
  const { reservationData, queryData, userData, loading, exportToExcel } = useReportController();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    labels: ['Reservations', 'Queries', 'User Activity'],
    datasets: [
      {
        label: 'Data Overview',
        data: [reservationData.length, queryData.length, userData.length],
        backgroundColor: ['rgba(75,192,192,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)'],
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Reservations', 'Queries', 'Users'],
    datasets: [
      {
        data: [reservationData.length, queryData.length, userData.length],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Summary Metrics */}
        <Typography variant="h4" gutterBottom>
          Admin Report Dashboard
          <Tooltip title="Overview of all key metrics">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ '&:hover': { boxShadow: 6 }, textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6">Total Reservations</Typography>
                <Typography variant="h4">{reservationData.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ '&:hover': { boxShadow: 6 }, textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6">Total Queries</Typography>
                <Typography variant="h4">{queryData.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ '&:hover': { boxShadow: 6 }, textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6">Active Users</Typography>
                <Typography variant="h4">{userData.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Overview */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Data Visualization
            <Tooltip title="Visual representation of key metrics">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Export to Excel Button */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </Box>

        {/* Detailed Tables */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reservations
            <Tooltip title="Detailed list of all reservations">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Restaurant</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservationData.map((reservation) => (
                  <TableRow key={reservation?._id}>
                    <TableCell>{reservation?.customer?.email || 'null'}</TableCell>
                    <TableCell>{reservation?.restaurant?.name || 'null'}</TableCell>
                    <TableCell>{reservation?.service?.name || 'null'}</TableCell>
                    <TableCell>{reservation?.date ? new Date(reservation.date).toLocaleDateString() : 'null'}</TableCell>
                    <TableCell>{reservation?.status || 'null'}</TableCell>
                    <TableCell>{reservation?.paymentStatus || 'null'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Queries
            <Tooltip title="Detailed list of all customer queries">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryData.map((query) => (
                  <TableRow key={query?._id}>
                    <TableCell>{query?.customer?.email || 'null'}</TableCell>
                    <TableCell>{query?.subject || 'null'}</TableCell>
                    <TableCell>{query?.message || 'null'}</TableCell>
                    <TableCell>{query?.status || 'null'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            User Activity
            <Tooltip title="Detailed list of user activities">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user?._id}>
                    <TableCell>{user?.email || 'null'}</TableCell>
                    <TableCell>{user?.role || 'null'}</TableCell>
                    <TableCell>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'null'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Pagination count={10} variant="outlined" shape="rounded" />
        </Grid>
      </Box>
    </Layout>
  );
};

export default ReportDashboard;
