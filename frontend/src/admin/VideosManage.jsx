import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Stack, Chip, Tooltip, FormControlLabel, Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useData } from '../context/DataContext';

const emptyDefaults = {
  title: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  displayOrder: '0',
  active: true,
};

export default function VideosManage() {
  const { videos, addVideo, editVideo, removeVideo } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({ defaultValues: emptyDefaults });

  const openCreate = () => {
    setEditing(null);
    reset(emptyDefaults);
    setDialogOpen(true);
  };

  const openEdit = (video) => {
    setEditing(video);
    reset({ ...video, displayOrder: video.displayOrder ?? '0' });
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = { ...data, displayOrder: Number(data.displayOrder) };
    if (editing) await editVideo(editing.id, payload);
    else await addVideo(payload);
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this video?')) await removeVideo(id);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h4" fontWeight={700}>About Page Videos</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          Add Video
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Add previous-work videos that will appear on the About page for visitors.
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Video</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} hover>
                <TableCell>
                  <Box>
                    <Typography fontWeight={700} variant="body2">{video.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 360 }}>
                      {video.description || 'No description provided.'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{video.displayOrder ?? 0}</TableCell>
                <TableCell>{video.active ? <Chip label="Visible" size="small" color="success" /> : <Chip label="Hidden" size="small" />}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(video)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(video.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {videos.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No videos yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Video' : 'Add Video'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Video Title" {...register('title', { required: true })} error={!!errors.title} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Description" {...register('description')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Video URL (YouTube or direct video URL)" {...register('videoUrl', { required: true })} error={!!errors.videoUrl} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Thumbnail URL (optional)" {...register('thumbnailUrl')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Display Order" inputProps={{ min: 0 }} {...register('displayOrder')} />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="active"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                      label="Show this video on the About page"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">{editing ? 'Save Changes' : 'Create Video'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
