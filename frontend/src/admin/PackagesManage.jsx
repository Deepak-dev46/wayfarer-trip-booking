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
  title: '', destinationId: '', location: '', category: 'Adventure', tripType: 'International', duration: 5, price: 1000,
  description: '', shortDescription: '', images: '', rating: 4.5,
};
const emptyTourPlanRow = { day: 1, title: '', detail: '' };

export default function PackagesManage() {
  const { packages, addPackage, editPackage, removePackage } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewPkg, setViewPkg] = useState(null);
  const [editing, setEditing] = useState(null);
  const [includedText, setIncludedText] = useState('');
  const [excludedText, setExcludedText] = useState('');
  const [tourPlan, setTourPlan] = useState([emptyTourPlanRow]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyDefaults });

  const openCreate = () => {
    setEditing(null);
    reset(emptyDefaults);
    setIncludedText('');
    setExcludedText('');
    setTourPlan([emptyTourPlanRow]);
    setDialogOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    reset({
      title: pkg.title, destinationId: pkg.destinationId || '', location: pkg.location, category: pkg.category,
      tripType: pkg.tripType || 'International', duration: pkg.duration, price: pkg.price,
      description: pkg.description, shortDescription: pkg.shortDescription, images: (pkg.images || []).join(', '), rating: pkg.rating,
    });
    setIncludedText((pkg.included || []).join('\n'));
    setExcludedText((pkg.excluded || []).join('\n'));
    setTourPlan((pkg.tourPlan || []).map((item) => ({
      day: item.day || 1,
      title: item.title || '',
      detail: item.detail || '',
    })).concat([{ ...emptyTourPlanRow }]));
    setDialogOpen(true);
  };

  const updateTourPlanRow = (index, key, value) => {
    setTourPlan((prev) => prev.map((row, idx) => idx === index ? { ...row, [key]: value } : row));
  };

  const addTourPlanRow = () => {
    setTourPlan((prev) => [...prev, { ...emptyTourPlanRow, day: prev.length + 1 }]);
  };

  const removeTourPlanRow = (index) => {
    setTourPlan((prev) => prev.filter((_, idx) => idx !== index).map((row, idx) => ({ ...row, day: idx + 1 })));
  };

  const normalizeList = (text) => text.split('\n').map((item) => item.trim()).filter(Boolean);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      duration: Number(data.duration),
      price: Number(data.price),
      rating: Number(data.rating),
      images: data.images.split(',').map((s) => s.trim()).filter(Boolean),
      included: normalizeList(includedText),
      excluded: normalizeList(excludedText),
      tourPlan: tourPlan
        .map((item, idx) => ({
          day: Number(item.day) || idx + 1,
          title: item.title.trim(),
          detail: item.detail.trim(),
        }))
        .filter((item) => item.title || item.detail),
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
              <TableCell>Trip Type</TableCell>
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
                <TableCell><Chip label={p.tripType || 'International'} size="small" color="secondary" /></TableCell>
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
              <TableRow><TableCell colSpan={7} align="center">No packages yet.</TableCell></TableRow>
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
                <TextField select fullWidth label="Trip Type" {...register('tripType', { required: true })} defaultValue={emptyDefaults.tripType}>
                  <MenuItem value="International">International</MenuItem>
                  <MenuItem value="Domestic">Domestic</MenuItem>
                </TextField>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={includedText}
                  onChange={(e) => setIncludedText(e.target.value)}
                  label="Included (one item per line)"
                  placeholder="Accommodation\nDaily breakfast\nAirport transfers"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={excludedText}
                  onChange={(e) => setExcludedText(e.target.value)}
                  label="Excluded (one item per line)"
                  placeholder="International flights\nTravel insurance"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Tour Plan</Typography>
                <Stack spacing={2}>
                  {tourPlan.map((item, index) => (
                    <Paper key={`tour-plan-${index}`} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Day"
                            value={item.day}
                            onChange={(e) => updateTourPlanRow(index, 'day', Number(e.target.value) || 1)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <TextField
                            fullWidth
                            label="Title"
                            value={item.title}
                            onChange={(e) => updateTourPlanRow(index, 'title', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Details"
                            value={item.detail}
                            onChange={(e) => updateTourPlanRow(index, 'detail', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button size="small" color="error" onClick={() => removeTourPlanRow(index)} disabled={tourPlan.length === 1}>
                              Remove
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                  <Button size="small" variant="outlined" onClick={addTourPlanRow}>Add Day</Button>
                </Stack>
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
              <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                <Chip label={viewPkg.tripType || 'International'} size="small" color="secondary" />
                <Chip label={viewPkg.category} size="small" />
                <Chip label={`${viewPkg.duration} days`} size="small" />
                <Chip label={formatPrice(viewPkg.price)} size="small" color="secondary" />
              </Stack>
              <Typography variant="subtitle2" mb={1}>Included</Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 2 }}>
                {(viewPkg.included || []).map((item, i) => (
                  <Typography component="li" key={i} variant="body2">• {item}</Typography>
                ))}
              </Stack>
              <Typography variant="subtitle2" mb={1}>Excluded</Typography>
              <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 2 }}>
                {(viewPkg.excluded || []).map((item, i) => (
                  <Typography component="li" key={i} variant="body2">• {item}</Typography>
                ))}
              </Stack>
              <Typography variant="subtitle2" mb={1}>Tour Plan</Typography>
              <Stack spacing={1}>
                {(viewPkg.tourPlan || []).map((day) => (
                  <Paper key={day.day} elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={700}>Day {day.day}: {day.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{day.detail}</Typography>
                  </Paper>
                ))}
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
