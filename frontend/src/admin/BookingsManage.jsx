import { useMemo, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Chip, Stack, TextField, MenuItem, InputAdornment, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useData } from '../context/DataContext';
import { formatDate, formatPrice } from '../utils/formatters';

const statusColors = { Confirmed: 'success', Pending: 'warning', Cancelled: 'error' };

export default function BookingsManage() {
  const { bookings, setBookingStatus, removeBooking } = useData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesQuery = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.packageTitle.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = !statusFilter || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this booking?')) await removeBooking(id);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Bookings</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          fullWidth placeholder="Search by traveler or package"
          value={query} onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <TextField select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Traveler</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Travel Date</TableCell>
              <TableCell>Travelers</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>{b.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{b.email}</Typography>
                </TableCell>
                <TableCell>{b.packageTitle}</TableCell>
                <TableCell>{formatDate(b.travelDate)}</TableCell>
                <TableCell>{b.adults} adult(s){b.children > 0 ? `, ${b.children} child(ren)` : ''}</TableCell>
                <TableCell>{formatPrice(b.totalPrice)}</TableCell>
                <TableCell>
                  <TextField
                    select size="small" value={b.status} onChange={(e) => setBookingStatus(b.id, e.target.value)}
                    SelectProps={{ renderValue: (v) => <Chip label={v} size="small" color={statusColors[v] || 'default'} /> }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(b.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No bookings match.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
