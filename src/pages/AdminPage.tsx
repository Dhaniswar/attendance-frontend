import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Add,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  Group,
} from '@mui/icons-material';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import StatisticsCard from '@/components/analytics/StatisticsCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data
  const students = [
    { id: 1, name: 'John Doe', studentId: 'S001', email: 'john@example.com', status: 'Active', attendance: '95%' },
    { id: 2, name: 'Jane Smith', studentId: 'S002', email: 'jane@example.com', status: 'Active', attendance: '89%' },
    { id: 3, name: 'Bob Johnson', studentId: 'S003', email: 'bob@example.com', status: 'Inactive', attendance: '76%' },
    { id: 4, name: 'Alice Brown', studentId: 'S004', email: 'alice@example.com', status: 'Active', attendance: '92%' },
  ];

  const attendanceLogs = [
    { id: 1, student: 'John Doe', time: '09:15 AM', date: '2024-01-15', status: 'Present', method: 'Face Recognition' },
    { id: 2, student: 'Jane Smith', time: '09:30 AM', date: '2024-01-15', status: 'Late', method: 'Face Recognition' },
    { id: 3, student: 'Bob Johnson', time: 'Absent', date: '2024-01-15', status: 'Absent', method: '-' },
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
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage students, attendance, and system settings
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => {/* Export functionality */}}
            >
              Export Data
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {/* Add student functionality */}}
            >
              Add Student
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Total Students"
              value="1,234"
              change="+12%"
              icon={<Group />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Today's Attendance"
              value="89%"
              change="+3%"
              icon={<Visibility />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Active Sessions"
              value="45"
              change="+8"
              icon={<PersonAdd />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard
              title="Recognition Rate"
              value="99.2%"
              change="+0.8%"
              icon={<FilterList />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Students" />
              <Tab label="Attendance Logs" />
              <Tab label="Face Database" />
              <Tab label="System Settings" />
            </Tabs>
          </Box>

          {/* Students Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                placeholder="Search students..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<FilterList />} variant="outlined">
                  Filter
                </Button>
                <Button startIcon={<Download />} variant="outlined">
                  Export
                </Button>
                <Button startIcon={<Add />} variant="contained">
                  Add Student
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={student.status === 'Active' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.attendance}
                          color={parseInt(student.attendance) > 85 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="info">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Attendance Logs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Recent Attendance Logs
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {/* Export functionality */}}
              >
                Export Logs
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.student}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={
                            log.status === 'Present' ? 'success' :
                            log.status === 'Late' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{log.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminPage;