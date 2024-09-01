import React, { useState, useEffect } from 'react';
import { fetchReservationReport, fetchQueryReport, fetchUserActivityReport } from '@/services/api';
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
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
import { Pagination } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Layout from '@/components/Layout/Layout';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const ReportDashboard: React.FC = () => {
  const [reservationData, setReservationData] = useState<any[]>([]);
  const [queryData, setQueryData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const reservationResponse = await fetchReservationReport();
        const queryResponse = await fetchQueryReport();
        const userResponse = await fetchUserActivityReport();

        setReservationData(reservationResponse.reservations);
        setQueryData(queryResponse.queries);
        setUserData(userResponse.users);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const reservationsSheet = XLSX.utils.json_to_sheet(reservationData);
    XLSX.utils.book_append_sheet(wb, reservationsSheet, 'Reservations');

    const queriesSheet = XLSX.utils.json_to_sheet(queryData);
    XLSX.utils.book_append_sheet(wb, queriesSheet, 'Queries');

    const usersSheet = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    };

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'report.xlsx');
  };

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
                  <TableRow key={reservation._id}>
                    <TableCell>{reservation.customer.email}</TableCell>
                    <TableCell>{reservation.restaurant.name}</TableCell>
                    <TableCell>{reservation.service.name}</TableCell>
                    <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>{reservation.paymentStatus}</TableCell>
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
                  <TableRow key={query._id}>
                    <TableCell>{query.customer.email}</TableCell>
                    <TableCell>{query.subject}</TableCell>
                    <TableCell>{query.message}</TableCell>
                    <TableCell>{query.status}</TableCell>
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
                  <TableRow key={user._id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
