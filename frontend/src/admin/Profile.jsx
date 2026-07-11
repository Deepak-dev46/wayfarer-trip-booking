import { Box, Typography, Paper, Avatar, Stack, TextField, Button, Grid, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Profile</Typography>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar sx={{ width: 84, height: 84, bgcolor: 'primary.main', fontSize: 32 }}>
            {(user?.name || 'A')[0]}
          </Avatar>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700}>{user?.name || 'Admin'}</Typography>
            <Typography variant="body2" color="text.secondary">Wayfarer Administrator</Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" defaultValue={user?.name || 'Admin'} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" defaultValue={user?.email || 'admin@trip.com'} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Role" defaultValue="Administrator" disabled />
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          Profile editing is disabled in this demo — admin details are fixed mock data.
        </Typography>
      </Paper>
    </Box>
  );
}
