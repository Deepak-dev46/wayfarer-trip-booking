import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, TextField, MenuItem, Slider, Stack, Paper,
  Pagination, InputAdornment, Chip, Drawer, Button, IconButton, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../context/DataContext';
import PackageCard from '../components/PackageCard';
import { CardGridSkeleton } from '../components/SkeletonCards';
import { categories, formatPrice } from '../utils/formatters';

const PAGE_SIZE = 8;
const durations = ['Any', '1-4 days', '5-7 days', '8+ days'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Packages() {
  const { packages, loading } = useData();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [duration, setDuration] = useState('Any');
  const [priceRange, setPriceRange] = useState([1000, 2500]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...packages];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    if (category) result = result.filter((p) => p.category === category);
    if (duration !== 'Any') {
      result = result.filter((p) => {
        if (duration === '1-4 days') return p.duration <= 4;
        if (duration === '5-7 days') return p.duration >= 5 && p.duration <= 7;
        return p.duration >= 8;
      });
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    result = result.filter((p) => p.rating >= minRating);

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => (b.trending === a.trending ? b.reviewCount - a.reviewCount : b.trending ? 1 : -1));

    return result;
  }, [packages, query, category, duration, priceRange, minRating, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query, category, duration, priceRange, minRating, sort]);

  const clearFilters = () => {
    setQuery(''); setCategory(''); setDuration('Any'); setPriceRange([1000, 2500]); setMinRating(0); setSort('popular');
  };

  const FilterPanel = (
    <Stack spacing={3} sx={{ p: { xs: 2.5, md: 0 } }}>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>Category</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip label="All" onClick={() => setCategory('')} color={category === '' ? 'secondary' : 'default'} variant={category === '' ? 'filled' : 'outlined'} />
          {categories.map((c) => (
            <Chip key={c} label={c} onClick={() => setCategory(c)} color={category === c ? 'secondary' : 'default'} variant={category === c ? 'filled' : 'outlined'} />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>Duration</Typography>
        <TextField select fullWidth size="small" value={duration} onChange={(e) => setDuration(e.target.value)}>
          {durations.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </TextField>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Price Range: {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, v) => setPriceRange(v)}
          min={1000} max={2500} step={50}
          valueLabelDisplay="auto"
          color="secondary"
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>Minimum Rating: {minRating.toFixed(1)}+</Typography>
        <Slider value={minRating} onChange={(e, v) => setMinRating(v)} min={0} max={5} step={0.5} valueLabelDisplay="auto" color="secondary" />
      </Box>

      <Button variant="outlined" onClick={clearFilters}>Clear Filters</Button>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, mb: 1 }}>All Packages</Typography>
      <Typography color="text.secondary" mb={4}>
        {filtered.length} trip{filtered.length === 1 ? '' : 's'} found
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by destination or trip name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
        />
        <TextField select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 200, display: { xs: 'none', sm: 'flex' } }}>
          {sortOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
        {isMobile && (
          <IconButton onClick={() => setFiltersOpen(true)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <TuneIcon />
          </IconButton>
        )}
      </Stack>

      <Grid container spacing={4}>
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 90 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Filters</Typography>
              {FilterPanel}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          {loading ? <CardGridSkeleton count={8} /> : (
            <>
              <Grid container spacing={3}>
                {paged.map((p, i) => (
                  <Grid item xs={12} sm={6} md={4} key={p.id}>
                    <PackageCard pkg={p} index={i} />
                  </Grid>
                ))}
              </Grid>
              {paged.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">No trips match those filters.</Typography>
                  <Button onClick={clearFilters} sx={{ mt: 2 }}>Clear filters</Button>
                </Box>
              )}
              {totalPages > 1 && (
                <Stack alignItems="center" sx={{ mt: 5 }}>
                  <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="secondary" />
                </Stack>
              )}
            </>
          )}
        </Grid>
      </Grid>

      <Drawer anchor="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={700}>Filters</Typography>
            <IconButton onClick={() => setFiltersOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          {FilterPanel}
        </Box>
      </Drawer>
    </Container>
  );
}
