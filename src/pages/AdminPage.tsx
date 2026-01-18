/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
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
import AddStudentForm from '@/components/admin/AddStudentForm';
import { studentApi } from '@/api/studentApi';
import { attendanceApi } from '@/api/attendanceApi';
import { Attendance, User } from '@/types';

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
  const [students, setStudents] = useState<User[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddStudent, setOpenAddStudent] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        // Fetch students
        const studentsResponse = await studentApi.getStudents();
        setStudents(studentsResponse.results);

        // Fetch today's attendance
        const attendanceResponse = await attendanceApi.getTodayAttendance();
        // Map student_details into student object for table display
        const mappedAttendance: Attendance[] = attendanceResponse.map((log: any) => ({
          ...log,
          student: log.student_details, // now student is User object
        }));
        setAttendanceLogs(mappedAttendance);
      } catch (error) {
        console.error('Failed to fetch students or attendance', error);
      }
    };

    fetchStudentsAndAttendance();
  }, []);

  // Filtered students based on search
  const filteredStudents = students.filter(
    (s) =>
      s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.student_id || '').includes(searchQuery)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Header */}
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
            <Button variant="outlined" startIcon={<Download />}>Export Data</Button>
            <Button variant="contained" startIcon={<PersonAdd />}>Add Student</Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard title="Total Students" value={students.length.toString()} change="+12%" icon={<Group />} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard title="Today's Attendance" value={attendanceLogs.length.toString()} change="+3%" icon={<Visibility />} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard title="Active Sessions" value="45" change="+8" icon={<PersonAdd />} color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatisticsCard title="Recognition Rate" value="99.2%" change="+0.8%" icon={<FilterList />} color="info" />
          </Grid>
        </Grid>

        {/* Tabs */}
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
                InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                sx={{ width: 300 }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Attendance Today</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const todayAttendance = attendanceLogs.find((log) => log.student.student_id === student.student_id);
                    return (
                      <TableRow key={student.id} hover>
                        <TableCell>{student.student_id || '-'}</TableCell>
                        <TableCell>{student.first_name} {student.last_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Chip label={student.is_active ? 'Active' : 'Inactive'} color={student.is_active ? 'success' : 'error'} size="small" />
                        </TableCell>
                        <TableCell>
                          {todayAttendance ? (
                            <Chip label={todayAttendance.status_display} color="success" size="small" />
                          ) : (
                            <Chip label="Absent" color="error" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                          <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Attendance Logs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Today's Attendance</Typography>
              <Button variant="outlined" startIcon={<Download />}>Export Logs</Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Time In</TableCell>
                    <TableCell>Time Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.student.full_name}</TableCell>
                      <TableCell>{log.time_in}</TableCell>
                      <TableCell>{log.time_out || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status_display}
                          color={
                            log.status_display === 'present' ? 'success' :
                            log.status_display === 'late' ? 'warning' :
                            'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{log.location || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>

      {/* Add Student Modal */}
      <AddStudentForm open={openAddStudent} onClose={() => setOpenAddStudent(false)} />
    </Box>
  );
};

export default AdminPage;
