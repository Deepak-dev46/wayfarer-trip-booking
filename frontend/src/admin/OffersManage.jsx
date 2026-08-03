import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Avatar, Stack, Chip, Tooltip, FormControlLabel, Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/formatters';

const emptyDefaults = {
  title: '', description: '', discount: '', bannerImage: '', startDate: '', endDate: '', packageId: '', popupEnabled: false,
};

export default function OffersManage() {
  const { offers, packages, addOffer, editOffer, removeOffer } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({ defaultValues: emptyDefaults });

  const openCreate = () => {
    setEditing(null);
    reset(emptyDefaults);
    setDialogOpen(true);
  };

  const openEdit = (offer) => {
    setEditing(offer);
    reset(offer);
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    if (editing) await editOffer(editing.id, data);
    else await addOffer(data);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this offer?')) await removeOffer(id);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h4" fontWeight={700}>Offers</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          Add Offer
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={3}>
        New offers appear instantly in the Home page carousel and on the public Offers page.
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Offer</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Popup</TableCell>
              <TableCell>Linked Package</TableCell>
              <TableCell>Valid</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar variant="rounded" src={o.bannerImage} sx={{ width: 44, height: 44 }} />
                    <Box>
                      <Typography fontWeight={700} variant="body2">{o.title}</Typography>
                      <Typography variant="caption" color="text.secondary" className="line-clamp-2" sx={{ maxWidth: 260, display: 'block' }}>
                        {o.description}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell><Chip label={o.discount} size="small" color="secondary" /></TableCell>
                <TableCell>{o.popupEnabled ? <Chip label="Home popup" size="small" color="success" /> : <Typography variant="caption" color="text.secondary">Off</Typography>}</TableCell>
                <TableCell>{packages.find((p) => p.id === o.packageId)?.title || '—'}</TableCell>
                <TableCell>
                  <Typography variant="caption">{formatDate(o.startDate)} – {formatDate(o.endDate)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(o)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(o.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {offers.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">No offers yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Offer Title" {...register('title', { required: true })} error={!!errors.title} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Offer Description" {...register('description', { required: true })} error={!!errors.description} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Discount (e.g. 15% OFF)" {...register('discount', { required: true })} error={!!errors.discount} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Linked Package" {...register('packageId')} defaultValue="">
                  <MenuItem value="">None</MenuItem>
                  {packages.map((p) => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} {...register('startDate', { required: true })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} {...register('endDate', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Banner Image URL" {...register('bannerImage', { required: true })} error={!!errors.bannerImage} />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="popupEnabled"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                      label="Show this offer as a celebratory popup on the home page"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">{editing ? 'Save Changes' : 'Create Offer'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
