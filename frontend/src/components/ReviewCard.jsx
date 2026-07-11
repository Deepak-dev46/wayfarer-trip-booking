import { Box, Typography, Avatar, Rating, Stack, Paper } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { formatDate } from '../utils/formatters';

export default function ReviewCard({ review }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}
    >
      <FormatQuoteIcon sx={{ color: 'secondary.main', fontSize: 32, mb: 1, opacity: 0.6 }} />
      <Typography variant="body1" sx={{ flexGrow: 1, mb: 2, fontStyle: 'italic' }}>
        "{review.comment}"
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={review.avatar} alt={review.name} />
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>{review.name}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={review.rating} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">{formatDate(review.date)}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
