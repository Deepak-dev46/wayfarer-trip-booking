import { Box, Typography, Avatar, Rating, Stack, Paper, IconButton, Tooltip } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { formatDate } from '../utils/formatters';

export default function ReviewCard({ review, isOwner, onEdit, onDelete }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}
    >
      <FormatQuoteIcon sx={{ color: 'secondary.main', fontSize: 32, mb: 1, opacity: 0.6 }} />
      <Typography variant="body1" sx={{ flexGrow: 1, mb: 2, fontStyle: 'italic' }}>
        "{review.comment}"
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
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
        {isOwner && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit review">
              <IconButton size="small" onClick={() => onEdit?.(review)}><EditIcon fontSize="small" /></IconButton>
            </Tooltip>
            <Tooltip title="Delete review">
              <IconButton size="small" color="error" onClick={() => onDelete?.(review.id)}><DeleteIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
