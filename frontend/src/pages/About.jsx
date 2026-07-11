import { Container, Grid, Typography, Box, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const values = [
  { title: 'Scout everything ourselves', text: 'No itinerary goes live until a member of our team has walked it, stayed in it, or eaten there.' },
  { title: 'Say the real price', text: 'The number on the package page is the number you pay, taxes and transfers included.' },
  { title: 'Keep humans on call', text: 'Every traveler gets a direct line to a coordinator, not a ticket queue, for the length of their trip.' },
];

const team = [
  { name: 'Maren Solberg', role: 'Founder & Head of Itineraries', img: 'https://i.pravatar.cc/200?img=45' },
  { name: 'Devon Okafor', role: 'Operations Lead', img: 'https://i.pravatar.cc/200?img=13' },
  { name: 'Yuki Tanaka', role: 'Asia-Pacific Routes', img: 'https://i.pravatar.cc/200?img=27' },
  { name: 'Isabela Cruz', role: 'Traveler Support', img: 'https://i.pravatar.cc/200?img=48' },
];

export default function About() {
  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(120deg, #0F3057, #4D9DE0)', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#F0BC8B', fontWeight: 700, letterSpacing: 3 }}>OUR STORY</Typography>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 32, md: 46 }, mb: 2 }}>
            Fourteen years of getting people to the right place, the right way.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Wayfarer started as three friends splitting a spreadsheet of good trips. It's grown into a team of route
            planners across five continents — but the spreadsheet instinct never left.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {values.map((v, i) => (
            <Grid item xs={12} md={4} key={v.title}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Paper elevation={0} sx={{ p: 3.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight={700} mb={1}>{v.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{v.text}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>Meet the Team</Typography>
        <Grid container spacing={3}>
          {team.map((member) => (
            <Grid item xs={6} md={3} key={member.name}>
              <Stack alignItems="center" textAlign="center" spacing={1.5}>
                <Box component="img" src={member.img} alt={member.name} sx={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid', borderColor: 'secondary.light' }} />
                <Typography fontWeight={700}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">{member.role}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
