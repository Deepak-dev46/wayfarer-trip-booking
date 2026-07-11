import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Chip, Stack, Tooltip, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/formatters';

export default function ContactsManage() {
  const { contacts, markContactRead, removeContact } = useData();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) await removeContact(id);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Contact Messages</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <List disablePadding>
          {contacts.map((c, i) => (
            <Box key={c.id}>
              {i > 0 && <Divider />}
              <ListItem
                sx={{ py: 2, bgcolor: c.read ? 'transparent' : 'rgba(77,157,224,0.06)' }}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    {!c.read && (
                      <Tooltip title="Mark as read">
                        <IconButton size="small" onClick={() => markContactRead(c.id)}><MarkEmailReadIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </Stack>
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700} variant="body2">{c.subject}</Typography>
                      {!c.read && <Chip label="New" size="small" color="secondary" />}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {c.name} · {c.email} · {c.phone} · {formatDate(c.date)}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{c.message}</Typography>
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))}
          {contacts.length === 0 && (
            <ListItem><ListItemText primary="No messages yet." /></ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
