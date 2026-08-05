import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Chip, Stack, Button, Rating, Divider, Paper,
  List, ListItem, ListItemIcon, ListItemText, CircularProgress, TextField,
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
import { useAuth } from '../context/AuthContext';
import { packageApi } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { formatPrice } from '../utils/formatters';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packages, reviews, loading, addReview, editReview, removeReview } = useData();
  const { isAuthenticated, user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: '', comment: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setFetching(true);
      const found = packages.find((p) => String(p.id) === String(id));
      const pkgResult = found
        ? found
        : await packageApi.getPackageById(id).then((res) => res.data).catch(() => null);
      if (mounted) {
        setPkg(pkgResult);
        setFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, packages]);

  const relatedReviews = reviews.filter((r) => String(r.packageId) === String(id));

  useEffect(() => {
    if (user?.name && !reviewForm.name) {
      setReviewForm((prev) => ({ ...prev, name: user.name }));
    }
  }, [user, reviewForm.name]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!pkg || !reviewForm.name.trim() || !reviewForm.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const payload = {
        packageId: pkg.id,
        name: reviewForm.name.trim(),
        comment: reviewForm.comment.trim(),
        rating: Number(reviewForm.rating),
        avatar: '',
      };

      if (editingReview) {
        await editReview(editingReview.id, payload);
      } else {
        await addReview(payload);
      }

      setReviewForm({ name: user?.name || '', comment: '', rating: 5 });
      setEditingReview(null);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({ name: review.name || user?.name || '', comment: review.comment || '', rating: review.rating || 5 });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    await removeReview(reviewId);
  };

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
              <Chip label={pkg.tripType || 'International'} color="secondary" size="small" />
              <Chip label={pkg.category} size="small" />
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

            {isAuthenticated ? (
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={1.5}>{editingReview ? 'Edit Your Review' : 'Leave a Review'}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>Share your experience to help future travelers choose this trip.</Typography>
                <Box component="form" onSubmit={handleReviewSubmit} sx={{ display: 'grid', gap: 2 }}>
                  <TextField label="Your name" value={reviewForm.name} onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  <TextField label="Your review" multiline rows={3} value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))} required />
                  <TextField
                    select
                    label="Rating"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    SelectProps={{ native: true }}
                  >
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
                  </TextField>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button type="submit" variant="contained" color="secondary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                    {editingReview && (
                      <Button variant="outlined" onClick={() => { setEditingReview(null); setReviewForm({ name: user?.name || '', comment: '', rating: 5 }); }}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={1}>Login to review</Typography>
                <Typography variant="body2" color="text.secondary">Please sign in to share your experience for this trip.</Typography>
              </Paper>
            )}

            {relatedReviews.length > 0 && (
              <>
                <Typography variant="h6" fontWeight={700} mb={2}>Traveler Reviews</Typography>
                <Grid container spacing={2}>
                  {relatedReviews.map((r) => (
                    <Grid item xs={12} sm={6} key={r.id}>
                      <ReviewCard review={r} isOwner={isAuthenticated && String(r.userId) === String(user?.id)} onEdit={handleEditReview} onDelete={handleDeleteReview} />
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
              <Row label="Trip Type" value={pkg.tripType || 'International'} />
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
