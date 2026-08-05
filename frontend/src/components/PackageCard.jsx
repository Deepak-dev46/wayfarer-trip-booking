import { Link } from 'react-router-dom';
import { Card, CardMedia, Box, Typography, Chip, Button, Stack, Rating } from '@mui/material';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleIcon from '@mui/icons-material/ScheduleOutlined';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatters';

export default function PackageCard({ pkg, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      style={{ height: '100%' }}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(15,48,87,0.14)' },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 210 }}>
          <Box
            component={Link}
            to={`/packages/${pkg.id}`}
            sx={{ display: 'block', height: '100%', overflow: 'hidden' }}
          >
            <CardMedia
              component="img"
              image={pkg.images?.[0]}
              alt={pkg.title}
              sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.08)' } }}
            />
          </Box>
          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
            <Chip
              label={pkg.tripType || 'International'}
              size="small"
              color="secondary"
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={pkg.category}
              size="small"
              sx={{ bgcolor: 'rgba(128, 123, 123, 0.9)', fontWeight: 700 }}
            />
          </Stack>
          {pkg.trending && (
            <Chip
              label="Trending"
              size="small"
              color="secondary"
              sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
            />
          )}
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mb: 0.5 }}>
            <PlaceIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{pkg.location}</Typography>
          </Stack>

          <Typography
            component={Link}
            to={`/packages/${pkg.id}`}
            variant="h6"
            sx={{ fontWeight: 700, mb: 0.5, '&:hover': { color: 'secondary.main' } }}
          >
            {pkg.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" className="line-clamp-2" sx={{ mb: 1.5 }}>
            {pkg.shortDescription}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Rating value={pkg.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {pkg.rating} ({pkg.reviewCount})
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mb: 2 }}>
            <ScheduleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{pkg.duration} days</Typography>
          </Stack>

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">from</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                {formatPrice(pkg.price)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button component={Link} to={`/packages/${pkg.id}`} size="small" variant="outlined">
                Details
              </Button>
              <Button component={Link} to={`/booking?package=${pkg.id}`} size="small" variant="contained" color="secondary">
                Book
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}
