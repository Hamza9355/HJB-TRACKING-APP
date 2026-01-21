import React from 'react';
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  LocalShipping as VehiclesIcon,
  History as SessionsIcon,
  Videocam as RealTimeIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';

const Sidebar = ({ open }) => {
  const drawerWidth = 260;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Véhicules', path: '/vehicles', icon: <VehiclesIcon /> },
    { name: 'Sessions', path: '/sessions', icon: <SessionsIcon /> },
    { name: 'Temps Réel', path: '/realtime', icon: <RealTimeIcon /> },
    { name: 'Rapports', path: '/reports', icon: <ReportsIcon /> },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 80,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          backgroundImage: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
          color: '#fff',
          marginTop: '64px',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {open && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              HJB Tracking
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Système de Suivi
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          </>
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              justifyContent: open ? 'flex-start' : 'center',
              px: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: '#ff9800', minWidth: open ? 40 : 'auto' }}>
              {item.icon}
            </ListItemIcon>
            {open && <ListItemText primary={item.name} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
