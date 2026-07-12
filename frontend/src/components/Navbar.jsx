import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItemButton, ListItemText,
  useScrollTrigger, Container, Menu, MenuItem, Avatar, Divider, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import ExploreIcon from '@mui/icons-material/Explore';
import { useThemeMode } from '../context/ThemeModeContext';
import { useAuth } from '../context/AuthContext';
import TripaHolidaysIcon from './TripaHolidaysIcon';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Packages', to: '/packages' },
  { label: 'Offers', to: '/offers' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];


export default function Navbar() {
  const trigger = useScrollTrigger({ threshold: 8 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, toggleMode } = useThemeMode();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: trigger ? 'background.paper' : 'transparent',
        color: 'text.primary',
        boxShadow: trigger ? '0 4px 24px rgba(15,48,87,0.08)' : 'none',
        backdropFilter: trigger ? 'blur(10px)' : 'none',
        transition: 'all 0.25s ease',
        borderBottom: trigger ? '1px solid rgba(15,48,87,0.06)' : '1px solid transparent',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.2, justifyContent: 'space-between' }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TripaHolidaysIcon width={70} size={40} />
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Tripa Holidays
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  color: location.pathname === link.to ? 'secondary.main' : 'text.primary',
                  fontWeight: location.pathname === link.to ? 800 : 600,
                  px: 1.5,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* <IconButton onClick={toggleMode} aria-label="Toggle dark mode">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon sx={{ color: '#F0BC8B' }} />}
            </IconButton> */}

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {isAuthenticated ? (
                <>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 15 }}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                    <MenuItem disabled sx={{ opacity: '1 !important' }}>
                      <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/booking" onClick={() => setAnchorEl(null)}>
                      Book a Trip
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" variant="text" sx={{ fontWeight: 700 }}>
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained" color="secondary">
                    Register
                  </Button>
                </>
              )}
              <Button
                component={Link}
                to="/admin/login"
                variant="outlined"
                size="small"
                sx={{ ml: 0.5, borderColor: 'primary.main' }}
              >
                Admin
              </Button>
            </Box>

            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.to} component={Link} to={link.to}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            {isAuthenticated ? (
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            ) : (
              <>
                <ListItemButton component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
            <ListItemButton component={Link} to="/admin/login">
              <ListItemText primary="Admin Login" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
