import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';

export default function DestinationCard({ destination, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
    >
      <Card
        component={Link}
        to="/packages"
        elevation={0}
        sx={{ position: 'relative', height: 260, overflow: 'hidden', display: 'block', border: '1px solid', borderColor: 'divider' }}
      >
        <CardMedia
          component="img"
          image={destination.image}
          alt={destination.name}
          sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', '&:hover': { transform: 'scale(1.1)' } }}
        />
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,48,87,0.85) 0%, rgba(15,48,87,0.05) 55%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{destination.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {destination.packageCount} package{destination.packageCount === 1 ? '' : 's'} available
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
}
