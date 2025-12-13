import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Face,
  Schedule,
  CheckCircle,
  Error,
  Download,
  CalendarMonth,
  Person,
} from '@mui/icons-material';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import { RootState } from '@/store/store';

const StudentPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Mock data
  const attendanceRecords = [
    { date: '2024-01-15', day: 'Monday', timeIn: '09:15 AM', timeOut: '04:30 PM', status: 'Present' },
    { date: '2024-01-14', day: 'Sunday', timeIn: 'Absent', timeOut: 'Absent', status: 'Absent' },
    { date: '2024-01-13', day: 'Saturday', timeIn: '09:30 AM', timeOut: '04:45 PM', status: 'Late' },
    { date: '2024-01-12', day: 'Friday', timeIn: '09:10 AM', timeOut: '04:20 PM', status: 'Present' },
    { date: '2024-01-11', day: 'Thursday', timeIn: '09:05 AM', timeOut: '04:25 PM', status: 'Present' },
  ];

  const stats = {
    totalDays: 20,
    presentDays: 18,
    absentDays: 2,
    lateDays: 3,
    attendancePercentage: 90,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Profile Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </Avatar>
                
                <Box>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    {user?.student_id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      label="Active Student"
                      color="success"
                      size="small"
                      sx={{ color: 'white' }}
                    />
                    <Chip
                      label={`Attendance: ${stats.attendancePercentage}%`}
                      color="info"
                      size="small"
                      sx={{ color: 'white' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Face />}
                href="/attendance"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Mark Today's Attendance
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Present Days
                    </Typography>
                    <Typography variant="h4">{stats.presentDays}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                    <Error />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Absent Days
                    </Typography>
                    <Typography variant="h4">{stats.absentDays}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <Schedule />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Late Days
                    </Typography>
                    <Typography variant="h4">{stats.lateDays}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Attendance %
                    </Typography>
                    <Typography variant="h4">{stats.attendancePercentage}%</Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.attendancePercentage}
                  sx={{ mt: 2 }}
                  color="info"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Chart and Table */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Monthly Attendance Overview
                  </Typography>
                  <Button startIcon={<CalendarMonth />} size="small">
                    This Month
                  </Button>
                </Box>
                <AttendanceChart />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Recent Attendance
                  </Typography>
                  <Button startIcon={<Download />} size="small">
                    Export
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell>Time In</TableCell>
                        <TableCell>Time Out</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceRecords.map((record, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.day}</TableCell>
                          <TableCell>{record.timeIn}</TableCell>
                          <TableCell>{record.timeOut}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={record.status}
                              color={
                                record.status === 'Present' ? 'success' :
                                record.status === 'Late' ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentPage;