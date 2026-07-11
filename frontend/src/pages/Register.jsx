import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Stack, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const password = watch('password');

  const onSubmit = async ({ name, email, phone, password }) => {
    setError('');
    setSubmitting(true);
    try {
      await signUp({ name, email, phone, password });
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" sx={{ fontSize: 30, mb: 0.5, textAlign: 'center' }}>Create Your Account</Typography>
          <Typography color="text.secondary" mb={4} textAlign="center">Join to book trips and track your itineraries.</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name} helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Email" type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
                  error={!!errors.email} helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Phone"
                  {...register('phone', { required: 'Phone is required' })}
                  error={!!errors.phone} helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Password" type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  error={!!errors.password} helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Confirm Password" type="password"
                  {...register('confirmPassword', { required: 'Please confirm password', validate: (v) => v === password || 'Passwords do not match' })}
                  error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth size="large" variant="contained" color="secondary" disabled={submitting}>
                  {submitting ? 'Creating account…' : 'Create Account'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography textAlign="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Typography component={Link} to="/login" color="secondary.dark" fontWeight={700}>
              Log In
            </Typography>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}
