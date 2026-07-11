import { Grid, Skeleton, Box } from '@mui/material';

export function PackageCardSkeleton() {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 5, overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={210} animation="wave" />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="40%" />
        <Skeleton width="80%" height={28} />
        <Skeleton width="100%" />
        <Skeleton width="60%" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton width="30%" height={32} />
          <Skeleton width="35%" height={32} />
        </Box>
      </Box>
    </Box>
  );
}

export function CardGridSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <PackageCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
