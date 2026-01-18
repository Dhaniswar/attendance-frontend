import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Analytics,
  Download,
  CalendarMonth,
  FilterList,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import HeatMap from '@/components/analytics/HeatMap';
import StatisticsCard from '@/components/analytics/StatisticsCard';

const AnalyticsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [classFilter, setClassFilter] = useState('all');

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleClassFilterChange = (event: SelectChangeEvent) => {
    setClassFilter(event.target.value);
  };

  // Mock data
  const classAttendance = [
    { className: 'Computer Science A', total: 45, present: 42, percentage: 93 },
    { className: 'Computer Science B', total: 40, present: 38, percentage: 95 },
    { className: 'Information Technology', total: 35, present: 30, percentage: 86 },
    { className: 'Software Engineering', total: 50, present: 48, percentage: 96 },
  ];

  const topStudents = [
    { name: 'John Doe', studentId: 'S001', attendance: '100%', daysPresent: 20 },
    { name: 'Jane Smith', studentId: 'S002', attendance: '98%', daysPresent: 19 },
    { name: 'Bob Johnson', studentId: 'S003', attendance: '95%', daysPresent: 18 },
    { name: 'Alice Brown', studentId: 'S004', attendance: '92%', daysPresent: 17 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Detailed insights and reports for attendance management
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
                startAdornment={<CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={classFilter}
                label="Class"
                onChange={handleClassFilterChange}
                startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="all">All Classes</MenuItem>
                <MenuItem value="cs">Computer Science</MenuItem>
                <MenuItem value="it">Information Technology</MenuItem>
                <MenuItem value="se">Software Engineering</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {/* Export functionality */}}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Overall Attendance"
              value="94.5%"
              change="+2.3%"
              icon={<TrendingUp />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Absent Rate"
              value="5.5%"
              change="-1.2%"
              icon={<TrendingDown />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Late Arrivals"
              value="8.2%"
              change="-0.5%"
              icon={<FilterList />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Recognition Rate"
              value="99.2%"
              change="+0.8%"
              icon={<Analytics />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Main Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Attendance Trend
                  </Typography>
                  <Chip label="Last 30 days" size="small" />
                </Box>
                <AttendanceChart />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Heat Map
                </Typography>
                <HeatMap />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Class-wise Attendance */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Class-wise Attendance
                  </Typography>
                  <Button size="small" startIcon={<Download />}>
                    Export
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell>Class Name</TableCell>
                        <TableCell align="right">Total Students</TableCell>
                        <TableCell align="right">Present Today</TableCell>
                        <TableCell align="right">Attendance %</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classAttendance.map((classItem, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{classItem.className}</TableCell>
                          <TableCell align="right">{classItem.total}</TableCell>
                          <TableCell align="right">{classItem.present}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${classItem.percentage}%`}
                              color={classItem.percentage > 90 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {classItem.percentage > 90 ? (
                              <Chip label="Excellent" color="success" size="small" />
                            ) : classItem.percentage > 80 ? (
                              <Chip label="Good" color="info" size="small" />
                            ) : (
                              <Chip label="Needs Attention" color="warning" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performing Students
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Attendance</TableCell>
                        <TableCell align="right">Days Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topStudents.map((student, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={student.attendance}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{student.daysPresent}</TableCell>
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

export default AnalyticsPage;