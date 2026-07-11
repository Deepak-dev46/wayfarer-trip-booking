import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Avatar, Stack, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/formatters';

export default function UsersManage() {
  const { users, removeUser } = useData();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) await removeUser(id);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Users</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>{u.name[0]}</Avatar>
                    <Typography variant="body2" fontWeight={700}>{u.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{formatDate(u.joined)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(u.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No users yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
