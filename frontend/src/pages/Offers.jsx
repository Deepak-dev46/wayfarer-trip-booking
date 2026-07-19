import { useMemo, useState } from 'react';
import { Container, Grid, Typography, Box, Button, Stack, Chip } from '@mui/material';
import { useData } from '../context/DataContext';
import OfferCard from '../components/OfferCard';
import { CardGridSkeleton } from '../components/SkeletonCards';

export default function Offers() {
  const { offers, packages, loading } = useData();
  const [tripType, setTripType] = useState('');

  const visibleOffers = useMemo(() => {
    return offers.filter((offer) => {
      if (!tripType) return true;
      const linkedPackage = packages.find((pkg) => pkg.id === offer.packageId);
      return (linkedPackage?.tripType || 'International') === tripType;
    });
  }, [offers, packages, tripType]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" color="secondary.dark" fontWeight={700} letterSpacing={2}>
        Limited Time
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, mb: 1 }}>International & Domestic Offers</Typography>
      <Typography color="text.secondary" mb={3} maxWidth={560}>
        Every discount here is live and pulled straight from what our team is running this season. New offers show up on the homepage carousel the moment they're added.
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
        <Chip label="All" onClick={() => setTripType('')} color={tripType === '' ? 'secondary' : 'default'} variant={tripType === '' ? 'filled' : 'outlined'} />
        <Chip label="International" onClick={() => setTripType('International')} color={tripType === 'International' ? 'secondary' : 'default'} variant={tripType === 'International' ? 'filled' : 'outlined'} />
        <Chip label="Domestic" onClick={() => setTripType('Domestic')} color={tripType === 'Domestic' ? 'secondary' : 'default'} variant={tripType === 'Domestic' ? 'filled' : 'outlined'} />
      </Stack>

      {loading ? <CardGridSkeleton count={4} /> : visibleOffers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" mb={2}>No active offers right now — check back soon.</Typography>
          <Button variant="contained" href="/packages">Browse All Packages</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {visibleOffers.map((offer, i) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <OfferCard offer={offer} index={i} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
