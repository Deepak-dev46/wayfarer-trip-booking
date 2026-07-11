import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { useData } from '../context/DataContext';
import OfferCard from '../components/OfferCard';
import { CardGridSkeleton } from '../components/SkeletonCards';

export default function Offers() {
  const { offers, loading } = useData();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" color="secondary.dark" fontWeight={700} letterSpacing={2}>
        Limited Time
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 1 }}>Current Offers</Typography>
      <Typography color="text.secondary" mb={5} maxWidth={560}>
        Every discount here is live and pulled straight from what our team is running this season. New offers show up on the homepage carousel the moment they're added.
      </Typography>

      {loading ? <CardGridSkeleton count={4} /> : offers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" mb={2}>No active offers right now — check back soon.</Typography>
          <Button variant="contained" href="/packages">Browse All Packages</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {offers.map((offer, i) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <OfferCard offer={offer} index={i} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
