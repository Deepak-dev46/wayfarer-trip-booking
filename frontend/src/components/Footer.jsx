import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Stack, Divider } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#fff', pt: 8, pb: 4, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <ExploreIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h5" fontWeight={700}>Wayfarer</Typography>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.75, mb: 2, maxWidth: 300 }}>
              Trips worth telling stories about. Curated journeys, honest pricing, and a team that answers the phone.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Quick Links</Typography>
            <Stack spacing={1}>
              {[['Packages', '/packages'], ['Offers', '/offers'], ['Destinations', '/destinations'], ['About', '/about'], ['Contact', '/contact']].map(([label, to]) => (
                <Typography key={to} component={Link} to={to} variant="body2" sx={{ opacity: 0.75, '&:hover': { opacity: 1 } }}>
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Top Destinations</Typography>
            <Stack spacing={1}>
              {['Santorini', 'Bali', 'Kyoto', 'Marrakech', 'Iceland'].map((d) => (
                <Typography key={d} component={Link} to="/destinations" variant="body2" sx={{ opacity: 0.75, '&:hover': { opacity: 1 } }}>
                  {d}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Stay in the Loop</Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
              Fare drops and new itineraries, once or twice a month.
            </Typography>
            {subscribed ? (
              <Typography variant="body2" color="secondary.main" fontWeight={700}>
                You're subscribed — welcome aboard.
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, input: { color: '#fff' }, flex: 1 }}
                  InputProps={{ sx: { borderRadius: 2, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                />
                <Button type="submit" variant="contained" color="secondary">Join</Button>
              </Box>
            )}
            <Stack spacing={1} mt={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" sx={{ opacity: 0.75 }} />
                <Typography variant="body2" sx={{ opacity: 0.75 }}>hello@wayfarer-trips.example</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" sx={{ opacity: 0.75 }} />
                <Typography variant="body2" sx={{ opacity: 0.75 }}>+1 (555) 019-2837</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceIcon fontSize="small" sx={{ opacity: 0.75 }} />
                <Typography variant="body2" sx={{ opacity: 0.75 }}>148 Harbor Row, Portside, CA</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
        <Typography variant="body2" sx={{ opacity: 0.6, textAlign: 'center' }}>
          © {new Date().getFullYear()} Wayfarer Trips. All rights reserved. This is a demo project using mock data only.
        </Typography>
      </Container>
    </Box>
  );
}
