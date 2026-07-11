import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Stack, Divider } from '@mui/material';
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
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider' }}>
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
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Demo account: <strong>demo@wayfarer.com</strong> / <strong>demo123</strong>
          </Typography>
          <Typography textAlign="center" sx={{ mt: 3 }}>
            Don't have an account?{' '}
            <Typography component={Link} to="/register" color="secondary.dark" fontWeight={700}>
              Register
            </Typography>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}
