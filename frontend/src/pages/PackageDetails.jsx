import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Chip, Stack, Button, Rating, Divider, Paper,
  List, ListItem, ListItemIcon, ListItemText, CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/HighlightOffOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleIcon from '@mui/icons-material/ScheduleOutlined';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

import { useData } from '../context/DataContext';
import { mockApi } from '../services/mockApi';
import ReviewCard from '../components/ReviewCard';
import { formatPrice } from '../utils/formatters';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packages, reviews, loading } = useData();
  const [pkg, setPkg] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setFetching(true);
      const found = packages.find((p) => p.id === id) || (await mockApi.getPackageById(id));
      if (mounted) {
        setPkg(found);
        setFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, packages]);

  const relatedReviews = reviews.filter((r) => r.packageId === id);

  if (fetching || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 16 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!pkg) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" mb={2}>Package not found</Typography>
        <Button variant="contained" onClick={() => navigate('/packages')}>Back to Packages</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Image gallery */}
      <Box sx={{ borderRadius: 5, overflow: 'hidden', mb: 4 }}>
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} style={{ height: 440 }}>
          {(pkg.images || []).map((img, i) => (
            <SwiperSlide key={i}>
              <Box component="img" src={img} alt={`${pkg.title} ${i + 1}`} sx={{ width: '100%', height: 440, objectFit: 'cover' }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Stack direction="row" spacing={1} mb={1.5}>
              <Chip label={pkg.category} color="secondary" size="small" />
              {pkg.trending && <Chip label="Trending" size="small" variant="outlined" />}
            </Stack>
            <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 42 }, mb: 1 }}>{pkg.title}</Typography>
            <Stack direction="row" spacing={3} sx={{ color: 'text.secondary', mb: 2 }} flexWrap="wrap">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PlaceIcon fontSize="small" /> <Typography variant="body2">{pkg.location}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ScheduleIcon fontSize="small" /> <Typography variant="body2">{pkg.duration} days</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Rating value={pkg.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2">{pkg.rating} ({pkg.reviewCount} reviews)</Typography>
              </Stack>
            </Stack>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              {pkg.description}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={700} mb={1.5}>Included</Typography>
                <List dense>
                  {pkg.included?.map((item, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 30 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={700} mb={1.5}>Excluded</Typography>
                <List dense>
                  {pkg.excluded?.map((item, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 30 }}><CancelIcon color="error" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight={700} mb={2}>Tour Plan</Typography>
            <Stack spacing={2} sx={{ mb: 5 }}>
              {pkg.tourPlan?.map((day) => (
                <Paper key={day.day} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
                  <Box sx={{ minWidth: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    D{day.day}
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>{day.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{day.detail}</Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>

            {relatedReviews.length > 0 && (
              <>
                <Typography variant="h6" fontWeight={700} mb={2}>Traveler Reviews</Typography>
                <Grid container spacing={2}>
                  {relatedReviews.map((r) => (
                    <Grid item xs={12} sm={6} key={r.id}>
                      <ReviewCard review={r} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 100 }}>
            <Typography variant="caption" color="text.secondary">Starting from</Typography>
            <Typography variant="h3" color="primary.main" fontWeight={800} mb={2}>{formatPrice(pkg.price)}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Row label="Duration" value={`${pkg.duration} days`} />
              <Row label="Category" value={pkg.category} />
              <Row label="Rating" value={`${pkg.rating} / 5`} />
            </Stack>
            <Button
              fullWidth size="large" variant="contained" color="secondary"
              component={Link} to={`/booking?package=${pkg.id}`}
            >
              Book This Trip
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value}</Typography>
    </Stack>
  );
}
