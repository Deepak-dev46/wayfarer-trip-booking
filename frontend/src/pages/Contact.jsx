import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Grid, Typography, Paper, TextField, Button, Stack, Box, Alert } from '@mui/material';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

export default function Contact() {
  const { addContact } = useData();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    await addContact(data);
    setSubmitting(false);
    setSubmitted(true);
    reset();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" color="secondary.dark" fontWeight={700} letterSpacing={2}>Get in Touch</Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 1 }}>Contact Us</Typography>
      <Typography color="text.secondary" mb={5} maxWidth={560}>
        Questions about a package, a group booking, or something you can't find on the site — send it over.
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <InfoRow icon={PlaceIcon} title="Office" text="148 Harbor Row, Portside, CA 94016" />
            <InfoRow icon={PhoneIcon} title="Phone" text="+1 (555) 019-2837" />
            <InfoRow icon={EmailIcon} title="Email" text="hello@wayfarer-trips.example" />
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
              alt="Office"
              sx={{ width: '100%', borderRadius: 4, height: 220, objectFit: 'cover' }}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitted(false)}>
                  Thanks — your message has been sent. We usually reply within one business day.
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Name" {...register('name', { required: 'Name is required' })}
                      error={!!errors.name} helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Email" type="email"
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
                      error={!!errors.email} helperText={errors.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Phone" {...register('phone', { required: 'Phone is required' })}
                      error={!!errors.phone} helperText={errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth label="Subject" {...register('subject', { required: 'Subject is required' })}
                      error={!!errors.subject} helperText={errors.subject?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth label="Message" multiline rows={5}
                      {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please add a bit more detail' } })}
                      error={!!errors.message} helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" size="large" variant="contained" color="secondary" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}

function InfoRow({ icon: Icon, title, text }) {
  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon sx={{ color: '#fff', fontSize: 20 }} />
      </Box>
      <Box>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{text}</Typography>
      </Box>
    </Stack>
  );
}
