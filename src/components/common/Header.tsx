import React, { useState } from 'react';
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

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);

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
          {/* Logo and Brand */}
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

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={onMenuClick}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            
            {user && (
              <>
                <Button
                  component={RouterLink}
                  to="/attendance"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Attendance
                </Button>
                
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Admin
                  </Button>
                )}
                
                <Button
                  component={RouterLink}
                  to="/analytics"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Analytics
                </Button>
              </>
            )}
          </Box>

          {/* User actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton onClick={handleOpenNotifications} color="inherit">
                    <Badge badgeContent={3} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElNotifications}
                  open={Boolean(anchorElNotifications)}
                  onClose={handleCloseNotifications}
                >
                  <MenuItem onClick={handleCloseNotifications}>
                    <Typography variant="body2">New student registered</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNotifications}>
                    <Typography variant="body2">Attendance marked successfully</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNotifications}>
                    <Typography variant="body2">System update available</Typography>
                  </MenuItem>
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
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleDashboard}>
                    <Dashboard sx={{ mr: 1 }} />
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleProfile}>
                    <Person sx={{ mr: 1 }} />
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  variant="contained"
                  size="small"
                >
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