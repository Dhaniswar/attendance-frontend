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
  CardActions,
  Button,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Face,
  Schedule,
  Security,
  Analytics,
  ArrowForward,
  CheckCircle,
  Groups,
} from '@mui/icons-material';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import StatisticsCard from '@/components/analytics/StatisticsCard';
import { RootState } from '@/store/store';

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const features = [
    {
      icon: <Face sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Face Recognition',
      description: 'Advanced face detection using MediaPipe with 99% accuracy',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Liveness Detection',
      description: 'Anti-spoofing with eye blink and head movement detection',
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Real-time Tracking',
      description: 'Live attendance monitoring with instant notifications',
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Advanced Analytics',
      description: 'Detailed reports and insights for better decision making',
    },
  ];

  const quickActions = [
    { label: 'Mark Attendance', path: '/attendance', color: 'primary' },
    { label: 'View Reports', path: '/analytics', color: 'secondary' },
    { label: 'Student List', path: '/admin/students', color: 'success' },
    { label: 'Settings', path: '/settings', color: 'info' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Welcome Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Welcome back, {user?.first_name || 'User'}!
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Face Recognition Attendance System
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                Track attendance in real-time with advanced AI-powered face recognition
                and liveness detection.
              </Typography>
              
              <Stack direction="row" spacing={2}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="contained"
                    href={action.path}
                    sx={{
                      bgcolor: 'white',
                      color: `${action.color}.main`,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Face sx={{ fontSize: 120, opacity: 0.2 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Total Students"
              value="1,234"
              change="+12%"
              icon={<Groups />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Today's Attendance"
              value="89%"
              change="+3%"
              icon={<CheckCircle />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Pending Approvals"
              value="12"
              change="-4"
              icon={<Schedule />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Recognition Accuracy"
              value="99.2%"
              change="+0.8%"
              icon={<Face />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Overview
                </Typography>
                <AttendanceChart />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Today's Present
                    </Typography>
                    <Typography variant="h5">856</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Today's Absent
                    </Typography>
                    <Typography variant="h5" color="error">45</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Late Arrivals
                    </Typography>
                    <Typography variant="h5" color="warning">23</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" endIcon={<ArrowForward />}>
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Section */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            {[
              'John Doe marked attendance at 09:15 AM',
              'New student registration: Jane Smith',
              'System updated to v2.1.0',
              'Attendance report generated for November',
            ].map((activity, index) => (
              <Grid item xs={12} key={index}>
                <Alert
                  severity={index === 0 ? 'success' : 'info'}
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant="body2">{activity}</Typography>
                  <Chip
                    label="Just now"
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;