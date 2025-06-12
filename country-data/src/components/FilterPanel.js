import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Paper,
  Grid,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon, 
  AccountBalance as PoliticalIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const FilterPanel = ({
  searchTerm,
  setSearchTerm,
  selectedSystem,
  setSelectedSystem,
  politicalSystems,
  minGdpFilter,
  maxGdpFilter,
  setMinGdpFilter,
  setMaxGdpFilter,
  maxGdp,
  isMobile
}) => {
  // Create GDP range options for consistent dropdown styling
  const gdpRanges = [
    { value: [0, Infinity], label: 'All GDP Ranges' },
    { value: [0, 10000], label: '$0 - $10,000' },
    { value: [10000, 30000], label: '$10,000 - $30,000' },
    { value: [30000, 50000], label: '$30,000 - $50,000' },
    { value: [50000, 80000], label: '$50,000 - $80,000' },
    { value: [80000, Infinity], label: '$80,000+' }
  ];

  const currentGdpRange = gdpRanges.find(range => 
    range.value[0] === minGdpFilter && range.value[1] === maxGdpFilter
  ) || gdpRanges[0];

  const handleGdpRangeChange = (event) => {
    const selectedRange = gdpRanges.find(range => range.label === event.target.value);
    if (selectedRange) {
      setMinGdpFilter(selectedRange.value[0]);
      setMaxGdpFilter(selectedRange.value[1]);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      borderRadius: 2,
      color: '#f8fafc',
      height: '56px', // Consistent height for all inputs
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(56, 189, 248, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#38bdf8',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#94a3b8',
      '&.Mui-focused': {
        color: '#38bdf8',
      },
    },
    '& .MuiOutlinedInput-input::placeholder': {
      color: '#64748b',
    },
  };

  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '& .MuiMenuItem-root': {
          color: '#cbd5e1',
          '&:hover': {
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(56, 189, 248, 0.3)',
            },
          },
        },
      },
    },
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, md: 2.5 }, 
        borderRadius: 2,
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: { xs: 2, md: 3 },
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 700, 
          color: '#f8fafc', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        🔧 Interactive Filters & Controls
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        {/* Search Countries */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Search Countries"
            variant="outlined"
            size="medium"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., United States, Germany..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Grid>
        
        {/* Political System */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="medium">
            <InputLabel 
              sx={{ 
                color: '#94a3b8',
                '&.Mui-focused': {
                  color: '#38bdf8',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PoliticalIcon fontSize="small" />
                Political System
              </Box>
            </InputLabel>
            <Select
              value={selectedSystem}
              label="Political System"
              onChange={(e) => setSelectedSystem(e.target.value)}
              sx={{
                ...inputStyles['& .MuiOutlinedInput-root'],
                '& .MuiSvgIcon-root': {
                  color: '#94a3b8',
                },
              }}
              MenuProps={selectMenuProps}
            >
              {politicalSystems.map(system => (
                <MenuItem key={system} value={system}>
                  {system}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* GDP Per Capita Range */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="medium">
            <InputLabel 
              sx={{ 
                color: '#94a3b8',
                '&.Mui-focused': {
                  color: '#38bdf8',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon fontSize="small" />
                GDP Per Capita Range
              </Box>
            </InputLabel>
            <Select
              value={currentGdpRange.label}
              label="GDP Per Capita Range"
              onChange={handleGdpRangeChange}
              sx={{
                ...inputStyles['& .MuiOutlinedInput-root'],
                '& .MuiSvgIcon-root': {
                  color: '#94a3b8',
                },
              }}
              MenuProps={selectMenuProps}
            >
              {gdpRanges.map(range => (
                <MenuItem key={range.label} value={range.label}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterPanel; 