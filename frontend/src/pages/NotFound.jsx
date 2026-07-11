import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export default function NotFound() {
  return (
    <Container sx={{ py: 16, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: 96, color: 'secondary.main', fontWeight: 800 }}>404</Typography>
      <Typography variant="h5" mb={1}>This trail doesn't lead anywhere.</Typography>
      <Typography color="text.secondary" mb={4}>The page you're looking for doesn't exist or has moved.</Typography>
      <Button variant="contained" component={Link} to="/">Back to Home</Button>
    </Container>
  );
}
