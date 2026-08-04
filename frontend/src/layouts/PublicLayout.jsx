import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Fab, Zoom } from '@mui/material';
import FlightIcon from '@mui/icons-material/FlightTakeoff';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import PageTransition from '../components/PageTransition';

export default function PublicLayout() {
  const location = useLocation();
  const hideFab = location.pathname.startsWith('/booking');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <ScrollToTop />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </Box>
      <Footer />

      <Zoom in={!hideFab}>
        <Fab
          component={Link}
          to="/booking"
          color="secondary"
          variant="extended"
          sx={{ position: 'fixed', bottom: 24, right: 24, fontWeight: 700, boxShadow: '0 12px 24px rgba(232,161,92,0.4)' }}
        >
          <FlightIcon sx={{ mr: 1 }} />
          Book Now
        </Fab>
      </Zoom>
    </Box>
  );
}
