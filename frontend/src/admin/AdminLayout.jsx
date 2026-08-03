import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar,
  Typography, IconButton, Avatar, Divider, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import InventoryIcon from '@mui/icons-material/CardTravelOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import EventNoteIcon from '@mui/icons-material/EventNoteOutlined';
import MailIcon from '@mui/icons-material/MailOutline';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import ExploreIcon from '@mui/icons-material/Explore';
import VideoLibraryIcon from '@mui/icons-material/VideoLibraryOutlined';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
  { label: 'Packages', to: '/admin/packages', icon: InventoryIcon },
  { label: 'Offers', to: '/admin/offers', icon: LocalOfferIcon },
  { label: 'Videos', to: '/admin/videos', icon: VideoLibraryIcon },
  { label: 'Bookings', to: '/admin/bookings', icon: EventNoteIcon },
  { label: 'Contact Messages', to: '/admin/contacts', icon: MailIcon },
  { label: 'Users', to: '/admin/users', icon: PeopleIcon },
  { label: 'Profile', to: '/admin/profile', icon: PersonIcon },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2.5 }}>
        <ExploreIcon sx={{ color: 'secondary.main' }} />
        <Typography variant="h6" fontWeight={800}>Wayfarer Admin</Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              sx={{
                borderRadius: 2, mb: 0.5,
                '&.Mui-selected': { bgcolor: 'secondary.main', color: 'secondary.contrastText', '& .MuiListItemIcon-root': { color: 'secondary.contrastText' } },
                '&.Mui-selected:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}><Icon /></ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: 14 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <ListItemButton onClick={handleLogout} sx={{ m: 1.5, borderRadius: 2 }}>
        <ListItemIcon sx={{ minWidth: 38 }}><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700}>
            {navItems.find((n) => n.to === location.pathname)?.label || 'Admin'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>{user?.name || 'Admin'}</Typography>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{(user?.name || 'A')[0]}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', borderRight: '1px solid', borderColor: 'divider' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, p: { xs: 2, md: 4 }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
