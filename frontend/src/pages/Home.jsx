import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, TextField, MenuItem, Stack, Paper, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import VerifiedIcon from '@mui/icons-material/VerifiedOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgentOutlined';
import PriceCheckIcon from '@mui/icons-material/PriceCheckOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { useData } from '../context/DataContext';
import PackageCard from '../components/PackageCard';
import DestinationCard from '../components/DestinationCard';
import ReviewCard from '../components/ReviewCard';
import { CardGridSkeleton } from '../components/SkeletonCards';
import { categories, formatDate } from '../utils/formatters';

const stats = [
  { label: 'Happy Travelers', value: '48,000+' },
  { label: 'Destinations', value: '120+' },
  { label: 'Avg. Rating', value: '4.8/5' },
  { label: 'Years Running', value: '14' },
];

const whyUs = [
  { icon: VerifiedIcon, title: 'Vetted Experiences', text: 'Every itinerary is scouted and re-checked by our own travel team before it goes live.' },
  { icon: PriceCheckIcon, title: 'Honest Pricing', text: 'The price you see includes what we say it includes — no surprise resort fees.' },
  { icon: SupportAgentIcon, title: '24/7 Trip Support', text: 'A real person answers if a flight gets cancelled or plans change mid-trip.' },
  { icon: PublicIcon, title: 'Local Guides', text: 'We work with guides who live where you are visiting, not fly-in contractors.' },
];

export default function Home() {
  const { packages, offers, destinations, reviews, loading } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ destination: '', category: '' });

  const featured = packages.filter((p) => p.featured).slice(0, 4);
  const trending = packages.filter((p) => p.trending).slice(0, 4);
  const topReviews = reviews.slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.destination) params.set('q', search.destination);
    if (search.category) params.set('category', search.category);
    navigate(`/packages?${params.toString()}`);
  };
  return (
    <Box>
      {/* HERO */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 560, md: 640 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #0F3057 0%, #1B4A78 55%, #4D9DE0 130%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute', inset: 0, opacity: 0.25,
            backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=60)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Typography variant="overline" sx={{ color: '#F0BC8B', fontWeight: 700, letterSpacing: 3 }}>
                  TRIPA HOLIDAYS
                </Typography>
                <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: 40, md: 62 }, mb: 2, lineHeight: 1.05 }}>
                  Discover<br /> the Difference.
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, mb: 4, maxWidth: 520 }}>
                  Hand-built itineraries across 120+ destinations, priced honestly and backed by real people when things change.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button size="large" variant="contained" color="secondary" onClick={() => navigate('/packages?tripType=International')}>
                    International Booking
                  </Button>
                  <Button size="large" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/packages?tripType=Domestic')}>
                    Domestic Booking
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SEARCH SECTION (overlapping hero) */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -5 }, position: 'relative', zIndex: 2, mb: 8 }}>
        <Paper
          className="glass-panel"
          elevation={0}
          component="form"
          onSubmit={handleSearch}
          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 5, boxShadow: '0 24px 60px rgba(15,48,87,0.18)' }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Where do you want to go?"
                value={search.destination}
                onChange={(e) => setSearch((s) => ({ ...s, destination: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select fullWidth label="Category"
                value={search.category}
                onChange={(e) => setSearch((s) => ({ ...s, category: e.target.value }))}
              >
                <MenuItem value="">Any category</MenuItem>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button type="submit" fullWidth size="large" variant="contained" color="secondary" startIcon={<SearchIcon />}>
                Search Trips
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* OFFERS CAROUSEL */}
      {offers.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 9 }}>
          <SectionHeading eyebrow="Limited Time" title="Current Offers" />
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            style={{ borderRadius: 24, paddingBottom: 40 }}
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id}>
                <Box
                  onClick={() => navigate(offer.packageId ? `/packages/${offer.packageId}` : '/offers')}
                  sx={{
                    cursor: 'pointer', position: 'relative', height: { xs: 280, md: 360 }, borderRadius: 5, overflow: 'hidden',
                    backgroundImage: `url(${offer.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  }}
                >
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,48,87,0.9), rgba(15,48,87,0.1))' }} />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, p: { xs: 3, md: 5 }, maxWidth: 560 }}>
                    <Typography variant="overline" sx={{ color: 'secondary.light', fontWeight: 800 }}>
                      {offer.discount} · Ends {formatDate(offer.endDate)}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#fff', fontSize: { xs: 26, md: 36 }, mb: 1 }}>
                      {offer.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.85)' }} className="line-clamp-2">
                      {offer.description}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      )}

      {/* POPULAR DESTINATIONS */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <SectionHeading eyebrow="Where to next" title="Popular Destinations" />
        <Grid container spacing={2.5}>
          {destinations.slice(0, 8).map((d, i) => (
            <Grid item xs={12} sm={6} md={3} key={d.id}>
              <DestinationCard destination={d} index={i} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FEATURED PACKAGES */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <SectionHeading eyebrow="Curated for you" title="Featured Packages" action={{ label: 'View all packages', to: '/packages' }} />
        {loading ? <CardGridSkeleton count={4} /> : (
          <Grid container spacing={3}>
            {featured.map((p, i) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <PackageCard pkg={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* TRENDING PACKAGES */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <SectionHeading eyebrow="Everyone's booking these" title="Trending Now" />
        {loading ? <CardGridSkeleton count={4} /> : (
          <Grid container spacing={3}>
            {trending.map((p, i) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <PackageCard pkg={p} index={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* WHY CHOOSE US */}
      <Box sx={{ bgcolor: 'primary.main', py: 9 }}>
        <Container maxWidth="lg">
          <SectionHeading eyebrow="The Wayfarer difference" title="Why Travelers Choose Us" light />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {whyUs.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Box sx={{ color: '#fff' }}>
                    <item.icon sx={{ fontSize: 38, color: 'secondary.main', mb: 1.5 }} />
                    <Typography variant="h6" fontWeight={700} mb={1}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{item.text}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* REVIEWS */}
      <Container maxWidth="lg" sx={{ my: 9 }}>
        <SectionHeading eyebrow="Told by travelers" title="What Our Customers Say" />
        <Grid container spacing={3}>
          {topReviews.map((r) => (
            <Grid item xs={12} md={4} key={r.id}>
              <ReviewCard review={r} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* STATS */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Grid container spacing={3}>
          {stats.map((s) => (
            <Grid item xs={6} md={3} key={s.label}>
              <Paper elevation={0} sx={{ textAlign: 'center', py: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h3" color="secondary.dark" fontWeight={800}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* NEWSLETTER BANNER */}
      <Container maxWidth="lg" sx={{ mb: 9 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 }, borderRadius: 5, textAlign: 'center',
            background: 'linear-gradient(120deg, #0F3057, #4D9DE0)',
          }}
        >
          <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>Fare drops, before anyone else.</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
            Join the list for new itineraries and price drops on packages you'll actually want.
          </Typography>
          <Button variant="contained" color="secondary" size="large" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            Subscribe in the footer ↓
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

function SectionHeading({ eyebrow, title, action, light }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={2} sx={{ mb: 4 }}>
      <Box>
        <Typography variant="overline" sx={{ color: light ? 'secondary.main' : 'secondary.dark', fontWeight: 700, letterSpacing: 2 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 34 }, color: light ? '#fff' : 'text.primary' }}>
          {title}
        </Typography>
      </Box>
      {action && (
        <Button component={Link} to={action.to} sx={{ color: light ? '#fff' : 'primary.main', fontWeight: 700 }}>
          {action.label} →
        </Button>
      )}
    </Stack>
  );
}
