import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Avatar, Stack, Rating, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useData } from '../context/DataContext';
import { categories, formatPrice } from '../utils/formatters';

const emptyDefaults = {
  title: '', destinationId: '', location: '', category: 'Adventure', duration: 5, price: 1000,
  description: '', shortDescription: '', images: '', rating: 4.5,
};

export default function PackagesManage() {
  const { packages, addPackage, editPackage, removePackage } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewPkg, setViewPkg] = useState(null);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyDefaults });

  const openCreate = () => {
    setEditing(null);
    reset(emptyDefaults);
    setDialogOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    reset({
      title: pkg.title, destinationId: pkg.destinationId || '', location: pkg.location, category: pkg.category,
      duration: pkg.duration, price: pkg.price, description: pkg.description, shortDescription: pkg.shortDescription,
      images: (pkg.images || []).join(', '), rating: pkg.rating,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      duration: Number(data.duration),
      price: Number(data.price),
      rating: Number(data.rating),
      images: data.images.split(',').map((s) => s.trim()).filter(Boolean),
      included: editing?.included || ['Accommodation', 'Daily breakfast', 'Airport transfers'],
      excluded: editing?.excluded || ['International flights', 'Travel insurance'],
      tourPlan: editing?.tourPlan || [],
      trending: editing?.trending || false,
      featured: editing?.featured || false,
      reviewCount: editing?.reviewCount || 0,
    };
    if (editing) await editPackage(editing.id, payload);
    else await addPackage(payload);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this package? This cannot be undone.')) {
      await removePackage(id);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Packages</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          Add Package
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Package</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar variant="rounded" src={p.images?.[0]} sx={{ width: 44, height: 44 }} />
                    <Box>
                      <Typography fontWeight={700} variant="body2">{p.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.location}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell><Chip label={p.category} size="small" /></TableCell>
                <TableCell>{p.duration} days</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell><Rating value={p.rating} precision={0.1} size="small" readOnly /></TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => setViewPkg(p)}><VisibilityIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No packages yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Package' : 'Add Package'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" {...register('title', { required: true })} error={!!errors.title} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" {...register('location', { required: true })} error={!!errors.location} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Category" {...register('category', { required: true })} defaultValue={emptyDefaults.category}>
                  {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField fullWidth type="number" label="Duration (days)" {...register('duration', { required: true, min: 1 })} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField fullWidth type="number" label="Price (USD)" {...register('price', { required: true, min: 1 })} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField fullWidth type="number" inputProps={{ step: 0.1, min: 0, max: 5 }} label="Rating" {...register('rating')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Short Description" {...register('shortDescription', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Full Description" {...register('description', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Image URLs (comma-separated)" {...register('images')} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">{editing ? 'Save Changes' : 'Create Package'}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewPkg} onClose={() => setViewPkg(null)} maxWidth="sm" fullWidth>
        {viewPkg && (
          <>
            <DialogTitle>{viewPkg.title}</DialogTitle>
            <DialogContent dividers>
              <Box component="img" src={viewPkg.images?.[0]} sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary" mb={2}>{viewPkg.description}</Typography>
              <Stack direction="row" spacing={2}>
                <Chip label={viewPkg.category} size="small" />
                <Chip label={`${viewPkg.duration} days`} size="small" />
                <Chip label={formatPrice(viewPkg.price)} size="small" color="secondary" />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setViewPkg(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
