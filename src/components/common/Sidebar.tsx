import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Person,
  Face,
  Analytics,
  History,
  Settings,
  Logout,
  Groups,
} from '@mui/icons-material';
import { RootState } from '@/store/store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width = 240 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const getActiveStyle = (path: string) => {
    return location.pathname === path
      ? { backgroundColor: 'primary.main', color: 'white' }
      : {};
  };

  const getIconColor = (path: string) => {
    return location.pathname === path ? 'white' : 'inherit';
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Attendance', icon: <Face />, path: '/attendance' },
  ];

  if (user?.role === 'admin' || user?.role === 'teacher') {
    menuItems.push(
      { text: 'Admin Dashboard', icon: <Dashboard />, path: '/admin' },
      { text: 'Student Management', icon: <Groups />, path: '/admin/students' },
      { text: 'Analytics', icon: <Analytics />, path: '/analytics' }
    );
  } else if (user?.role === 'student') {
    menuItems.push(
      { text: 'My Attendance', icon: <History />, path: '/student' }
    );
  }

  const bottomMenuItems = [
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width,
        },
      }}
    >
      {/* User Profile Section */}
      <Box
        sx={{
          padding: 2,
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {user ? getInitials(user.first_name || user.email) : 'U'}
        </Avatar>
        
        <Typography variant="h6" noWrap>
          {user ? `${user.first_name} ${user.last_name}` : 'Guest'}
        </Typography>
        
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {user?.role?.toUpperCase() || 'USER'}
        </Typography>
        
        {user?.student_id && (
          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5 }}>
            ID: {user.student_id}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Main Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={getActiveStyle(item.path)}
            >
              <ListItemIcon sx={{ color: getIconColor(item.path) }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Menu Items */}
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={getActiveStyle(item.path)}
            >
              <ListItemIcon sx={{ color: getIconColor(item.path) }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/logout')}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;