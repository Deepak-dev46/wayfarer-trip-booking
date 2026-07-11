import { Link } from 'react-router-dom';
import { Card, CardMedia, Box, Typography, Chip, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatters';

export default function OfferCard({ offer, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      style={{ height: '100%' }}
    >
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', height: '100%' }}>
        <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={offer.bannerImage}
            alt={offer.title}
            sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.06)' } }}
          />
          <Chip
            label={offer.discount}
            color="secondary"
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 800 }}
          />
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>{offer.title}</Typography>
          <Typography variant="body2" color="text.secondary" className="line-clamp-2" mb={1.5}>
            {offer.description}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Valid {formatDate(offer.startDate)} – {formatDate(offer.endDate)}
            </Typography>
            <Button
              component={Link}
              to={offer.packageId ? `/packages/${offer.packageId}` : '/packages'}
              size="small"
              variant="contained"
            >
              View Deal
            </Button>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  );
}
