import { Container, Grid, Typography } from '@mui/material';
import { useData } from '../context/DataContext';
import DestinationCard from '../components/DestinationCard';
import { CardGridSkeleton } from '../components/SkeletonCards';

export default function Destinations() {
  const { destinations, loading } = useData();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" color="secondary.dark" fontWeight={700} letterSpacing={2}>
        Where to next
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 1 }}>All Destinations</Typography>
      <Typography color="text.secondary" mb={5} maxWidth={560}>
        Eight regions, each with its own packages and pace. Tap any destination to browse the trips we run there.
      </Typography>

      {loading ? <CardGridSkeleton count={8} /> : (
        <Grid container spacing={2.5}>
          {destinations.map((d, i) => (
            <Grid item xs={12} sm={6} md={3} key={d.id}>
              <DestinationCard destination={d} index={i} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
