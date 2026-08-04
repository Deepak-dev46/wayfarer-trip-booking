import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Stack, Grid, MenuItem, Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

export default function Booking() {
  const { packages, addBooking } = useData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselected = searchParams.get('package') || '';
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      adults: 2,
      children: 0,
      groupType: 'Couple',
      days: 5,
      travelDate: '',
      packageId: preselected,
      specialRequests: '',
    },
  });

  const packageId = watch('packageId');
  const adults = watch('adults');
  const children = watch('children');
  const selectedPkg = packages.find((p) => p.id === packageId);
  const total = selectedPkg ? selectedPkg.price * (Number(adults) || 0) + selectedPkg.price * 0.5 * (Number(children) || 0) : 0;

  const onSubmit = async (data) => {
    setSubmitting(true);
    const pkg = packages.find((p) => p.id === data.packageId);
    const booking = await addBooking({
      ...data,
      packageId: pkg?.id,
      packageTitle: pkg?.title || 'Custom Package',
      adults: Number(data.adults),
      children: Number(data.children),
      days: Number(data.days),
      totalPrice: total,
    });
    setSubmitting(false);
    navigate(`/booking/confirmation`, { state: { booking } });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(5,10,20,0.95) 0%, rgba(15,25,42,0.95) 100%)' : 'linear-gradient(135deg, rgba(15,48,87,0.04) 0%, rgba(77,157,224,0.12) 100%)', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} lg={4}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 4, background: 'linear-gradient(135deg, #0F3057 0%, #1E5A8A 100%)', color: '#fff' }}>
                <Typography variant="overline" sx={{ color: '#F0BC8B', fontWeight: 700, letterSpacing: 2 }}>Reserve Your Spot</Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 32 }, mb: 2, color: '#fff' }}>Book Your Dream Escape</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
                  Share your travel preferences and our team will craft the right plan for your journey.
                </Typography>
                <Box sx={{ mt: 3, p: 2, borderRadius: 3, background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.16)' }}>
                  <Typography variant="subtitle2" fontWeight={700}>Why book with us?</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>Flexible travel planning • transparent pricing • real support on the ground</Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} lg={8}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 4, background: (theme) => theme.palette.mode === 'dark' ? 'rgba(15,25,40,0.92)' : '#fff' }}>
                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 }, mb: 1 }}>Booking Details</Typography>
                <Typography color="text.secondary" mb={3}>
                  Fill in your details below — a coordinator will confirm your booking within 24 hours.
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone" {...register('phone', { required: 'Phone is required' })} error={!!errors.phone} helperText={errors.phone?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="packageId"
                        control={control}
                        rules={{ required: 'Please select a package' }}
                        render={({ field }) => (
                          <TextField {...field} select fullWidth label="Package" error={!!errors.packageId} helperText={errors.packageId?.message}>
                            <MenuItem value="">Select a package</MenuItem>
                            {packages.map((p) => (
                              <MenuItem key={p.id} value={p.id}>{p.title} — {formatPrice(p.price)}</MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField fullWidth type="number" label="Adults" inputProps={{ min: 1 }} {...register('adults', { required: true, min: 1 })} error={!!errors.adults} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField fullWidth type="number" label="Children" inputProps={{ min: 0 }} {...register('children', { min: 0 })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField select fullWidth label="Trip Type" {...register('groupType', { required: 'Please select a trip type' })} error={!!errors.groupType} helperText={errors.groupType?.message}>
                        <MenuItem value="Couple">Couple</MenuItem>
                        <MenuItem value="Bachelor">Bachelor</MenuItem>
                        <MenuItem value="Family">Family</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type="number" label="Number of Days" inputProps={{ min: 1 }} {...register('days', { required: 'Please enter number of days', min: 1 })} error={!!errors.days} helperText={errors.days?.message} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth type="date" label="Travel Date" InputLabelProps={{ shrink: true }}
                        {...register('travelDate', { required: 'Please pick a travel date' })}
                        error={!!errors.travelDate} helperText={errors.travelDate?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth multiline rows={3} label="Special Requests" {...register('specialRequests')} />
                    </Grid>
                  </Grid>

                  {selectedPkg && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Estimated Total</Typography>
                        <Typography variant="h5" fontWeight={800} color="primary.main">{formatPrice(total)}</Typography>
                      </Stack>
                    </Box>
                  )}

                  <Button type="submit" size="large" variant="contained" color="secondary" fullWidth sx={{ mt: 3 }} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Confirm Booking'}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
