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
      totalPrice: total,
    });
    setSubmitting(false);
    navigate(`/booking/confirmation`, { state: { booking } });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="overline" color="secondary.dark" fontWeight={700} letterSpacing={2}>Reserve Your Spot</Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 40 }, mb: 1 }}>Book Your Trip</Typography>
      <Typography color="text.secondary" mb={5}>
        Fill in your details below — a coordinator will confirm your booking within 24 hours.
      </Typography>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
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
    </Container>
  );
}
