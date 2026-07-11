import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Stack } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setError('');
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.role !== 'admin') {
        setError('These credentials are for a traveler account, not an admin account.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(120deg, #0F3057, #1B4A78)' }}>
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 4 }}>
            <Stack alignItems="center" mb={2}>
              <AdminPanelSettingsIcon sx={{ fontSize: 44, color: 'primary.main' }} />
            </Stack>
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}>Admin Login</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
              Wayfarer management dashboard
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  fullWidth label="Email" {...register('email', { required: 'Email is required' })}
                  error={!!errors.email} helperText={errors.email?.message}
                />
                <TextField
                  fullWidth label="Password" type="password" {...register('password', { required: 'Password is required' })}
                  error={!!errors.password} helperText={errors.password?.message}
                />
                <Button type="submit" size="large" variant="contained" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
              Demo: admin@trip.com / admin123
            </Typography>
            <Typography textAlign="center" mt={2}>
              <Typography component={Link} to="/" variant="body2" color="text.secondary">← Back to site</Typography>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
