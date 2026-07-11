import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, Button, Stack, Box, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { formatDate, formatPrice } from '../utils/formatters';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" mb={2}>No booking found.</Typography>
        <Button variant="contained" component={Link} to="/packages">Browse Packages</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} mb={1}>Booking Received!</Typography>
          <Typography color="text.secondary" mb={4}>
            Confirmation #{booking.id?.slice(-8).toUpperCase()} — we'll email you within 24 hours to confirm.
          </Typography>

          <Divider sx={{ mb: 3 }} />
          <Stack spacing={1.5} textAlign="left">
            <Row label="Package" value={booking.packageTitle} />
            <Row label="Traveler" value={booking.name} />
            <Row label="Travel Date" value={formatDate(booking.travelDate)} />
            <Row label="Travelers" value={`${booking.adults} adult(s), ${booking.children} child(ren)`} />
            <Row label="Estimated Total" value={formatPrice(booking.totalPrice)} bold />
            <Row label="Status" value={booking.status} />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/packages')}>Browse More Trips</Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/')}>Back to Home</Button>
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
}

function Row({ label, value, bold }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={bold ? 800 : 600}>{value}</Typography>
    </Stack>
  );
}
