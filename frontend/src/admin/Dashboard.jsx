import { Grid, Paper, Typography, Box, Stack } from '@mui/material';
import CardTravelIcon from '@mui/icons-material/CardTravelOutlined';
import EventNoteIcon from '@mui/icons-material/EventNoteOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import MailIcon from '@mui/icons-material/MailOutline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useData } from '../context/DataContext';
import { formatPrice } from '../utils/formatters';

const COLORS = ['#0F3057', '#4D9DE0', '#E8A15C', '#7FB77E', '#C86B85'];

export default function Dashboard() {
  const { packages, offers, bookings, contacts, users } = useData();

  const cards = [
    { label: 'Total Packages', value: packages.length, icon: CardTravelIcon, color: '#0F3057' },
    { label: 'Total Bookings', value: bookings.length, icon: EventNoteIcon, color: '#4D9DE0' },
    { label: 'Total Offers', value: offers.length, icon: LocalOfferIcon, color: '#E8A15C' },
    { label: 'Total Users', value: users.length, icon: PeopleIcon, color: '#7FB77E' },
    { label: 'Total Contacts', value: contacts.length, icon: MailIcon, color: '#C86B85' },
  ];

  const categoryData = Object.entries(
    packages.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const bookingRevenue = bookings.reduce((acc, b) => {
    const key = b.packageTitle?.split(' ').slice(0, 2).join(' ') || 'Trip';
    acc[key] = (acc[key] || 0) + (b.totalPrice || 0);
    return acc;
  }, {});
  const revenueData = Object.entries(bookingRevenue).map(([name, revenue]) => ({ name, revenue }));

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Dashboard Overview</Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={2.4} key={c.label}>
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${c.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon sx={{ color: c.color }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800}>{c.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>Total Booking Revenue</Typography>
            <Typography variant="h4" color="primary.main" fontWeight={800} mb={2}>{formatPrice(totalRevenue)}</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {categoryData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="text.secondary">Packages by category</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Revenue by Package</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatPrice(v)} />
                <Bar dataKey="revenue" fill="#4D9DE0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
