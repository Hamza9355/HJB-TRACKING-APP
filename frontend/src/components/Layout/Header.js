import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Header = ({ toggleSidebar }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1a237e',
        backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar
            sx={{
              mr: 2,
              bgcolor: '#3f51b5',
              width: 40,
              height: 40,
            }}
          >
            HJB
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            HJB Tracking System
          </Typography>
          <Typography
            variant="caption"
            sx={{
              ml: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.7rem',
            }}
          >
            v1.0.0
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#3949ab',
              cursor: 'pointer',
            }}
          >
            HB
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
