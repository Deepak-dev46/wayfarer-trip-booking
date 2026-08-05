import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Stack, Divider, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/');
    } catch (e) {
      setError(e.message || 'Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, rgba(5,10,20,0.95) 0%, rgba(15,25,42,0.95) 100%)' : 'linear-gradient(135deg, rgba(15,48,87,0.06) 0%, rgba(77,157,224,0.12) 100%)', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, height: '100%', border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #0F3057 0%, #1E5A8A 100%)', color: '#fff' }}>
                <Typography variant="overline" sx={{ color: '#F0BC8B', fontWeight: 700, letterSpacing: 2 }}>Your next getaway</Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 }, mb: 2, color: '#fff' }}>Plan smarter, travel better.</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
                  Sign in to explore hand-picked packages, secure your booking, and stay connected with your travel coordinator.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 4, background: (theme) => theme.palette.mode === 'dark' ? 'rgba(15,25,40,0.92)' : '#fff' }}>
                <Typography variant="h3" sx={{ fontSize: 30, mb: 0.5, textAlign: 'center' }}>Welcome Back</Typography>
                <Typography color="text.secondary" mb={4} textAlign="center">Log in to book and manage your trips.</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth label="Email" type="email"
                      {...register('email', { required: 'Email is required' })}
                      error={!!errors.email} helperText={errors.email?.message}
                    />
                    <TextField
                      fullWidth label="Password" type="password"
                      {...register('password', { required: 'Password is required' })}
                      error={!!errors.password} helperText={errors.password?.message}
                    />
                    <Button type="submit" size="large" variant="contained" color="secondary" disabled={submitting}>
                      {submitting ? 'Logging in…' : 'Log In'}
                    </Button>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }}>or</Divider>
                <Typography textAlign="center" sx={{ mt: 3 }}>
                  Don't have an account?{' '}
                  <Typography component={Link} to="/register" color="secondary.dark" fontWeight={700}>
                    Register
                  </Typography>
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
