import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Button,
  Container,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Person,
  Notifications,
  Face,
} from '@mui/icons-material';
import { logout } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { notificationApi } from '@/api/notificationApi';
import { Notification } from '@/types';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] =
    useState<null | HTMLElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications when user logs in


  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications(1, 5, true);
      setNotifications(response.results);
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

    useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
      handleCloseNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    handleCloseUserMenu();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  };

  const handleDashboard = () => {
    if (user?.role === 'admin' || user?.role === 'teacher') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
    handleCloseUserMenu();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Face sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              FRAS
            </Typography>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={onMenuClick} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button component={RouterLink} to="/" sx={{ my: 2, color: 'white' }}>
              Home
            </Button>

            {user && (
              <>
                <Button component={RouterLink} to="/attendance" sx={{ my: 2, color: 'white' }}>
                  Attendance
                </Button>

                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Button component={RouterLink} to="/admin" sx={{ my: 2, color: 'white' }}>
                    Admin
                  </Button>
                )}

                <Button component={RouterLink} to="/analytics" sx={{ my: 2, color: 'white' }}>
                  Analytics
                </Button>
              </>
            )}
          </Box>

          {/* Right side */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton onClick={handleOpenNotifications} color="inherit">
                    <Badge badgeContent={unreadCount} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorElNotifications}
                  open={Boolean(anchorElNotifications)}
                  onClose={handleCloseNotifications}
                  sx={{ mt: 1 }}
                >
                  {notifications.length === 0 ? (
                    <MenuItem>
                      <Typography variant="body2" color="text.secondary">
                        No new notifications
                      </Typography>
                    </MenuItem>
                  ) : (
                    notifications.map((notification) => (
                      <MenuItem
                        key={notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{
                          borderLeft: '3px solid',
                          borderColor:
                            notification.type === 'alert'
                              ? 'error.main'
                              : notification.type === 'system'
                              ? 'warning.main'
                              : notification.type === 'info'
                              ? 'info.main'
                              : 'success.main',
                          alignItems: 'flex-start',
                          whiteSpace: 'normal',
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2">
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                  
                {notifications.length > 0 && [
                  <Divider key="divider" />,
                  <MenuItem key="mark-all" onClick={handleMarkAllAsRead}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ width: '100%', textAlign: 'center' }}
                    >
                      Mark all as read
                    </Typography>
                  </MenuItem>,
                ]}
                </Menu>

                {/* User menu */}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user.first_name || user.email ? (
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {getInitials(user.first_name || user.email)}
                      </Avatar>
                    ) : (
                      <AccountCircle sx={{ fontSize: 32 }} />
                    )}
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleDashboard}>
                    <Dashboard sx={{ mr: 1 }} />
                    <Typography>Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleProfile}>
                    <Person sx={{ mr: 1 }} />
                    <Typography>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    <Typography>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit" variant="outlined" size="small">
                  Login
                </Button>
                <Button component={RouterLink} to="/register" color="inherit" variant="contained" size="small">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
