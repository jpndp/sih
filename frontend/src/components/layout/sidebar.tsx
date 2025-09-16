import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Description as DocumentIcon,
  Assessment as ComplianceIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Documents', icon: <DocumentIcon />, path: '/documents' },
  { text: 'Compliance', icon: <ComplianceIcon />, path: '/compliance' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: 'linear-gradient(180deg, rgba(255,153,51,0.1) 0%, rgba(255,255,255,1) 50%, rgba(19,136,8,0.1) 100%)',
          borderRight: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            border: '3px solid white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {user?.name?.[0] || '?'}
        </Avatar>
        <Typography variant="h6" gutterBottom>
          {user?.name || 'Guest'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'No Role'}
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, rgba(255,153,51,0.1), rgba(19,136,8,0.1))',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, rgba(255,153,51,0.2), rgba(19,136,8,0.2))',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
