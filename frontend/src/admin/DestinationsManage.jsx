import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Stack, Tooltip, Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useData } from '../context/DataContext';

const emptyDefaults = {
  name: '', country: '', image: '', packageCount: 0, blurb: '',
};

export default function DestinationsManage() {
  const { destinations, addDestination, editDestination, removeDestination } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyDefaults });

  const openCreate = () => {
    setEditing(null);
    reset(emptyDefaults);
    setDialogOpen(true);
  };

  const openEdit = (destination) => {
    setEditing(destination);
    reset({
      name: destination.name,
      country: destination.country || '',
      image: destination.image || '',
      packageCount: destination.packageCount || 0,
      blurb: destination.blurb || '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      packageCount: Number(data.packageCount) || 0,
    };
    if (editing) await editDestination(editing.id, payload);
    else await addDestination(payload);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this destination?')) await removeDestination(id);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Destinations</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          Add Destination
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Packages</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinations.map((destination) => (
              <TableRow key={destination.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar variant="rounded" src={destination.image} sx={{ width: 44, height: 44 }} />
                    <Box>
                      <Typography fontWeight={700} variant="body2">{destination.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{destination.blurb}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{destination.country || '—'}</TableCell>
                <TableCell>{destination.packageCount || 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(destination)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(destination.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {destinations.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No destinations yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Destination' : 'Add Destination'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Destination Name" {...register('name', { required: true })} error={!!errors.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Country" {...register('country')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Package Count" {...register('packageCount')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URL" {...register('image')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Short Description" {...register('blurb')} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">{editing ? 'Save Changes' : 'Create Destination'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
