import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon, 
  AccountBalance as PoliticalIcon,
  AttachMoney as MoneyIcon
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
      
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Search Countries"
            variant="outlined"
            size="small"
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
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 2,
                color: '#f8fafc',
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
            }}
          />
        </Grid>
        
        {/* Political System */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
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
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 2,
                color: '#f8fafc',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(56, 189, 248, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#38bdf8',
                  borderWidth: 2,
                },
                '& .MuiSvgIcon-root': {
                  color: '#94a3b8',
                },
              }}
              MenuProps={{
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
              }}
            >
              {politicalSystems.map(system => (
                <MenuItem key={system} value={system}>
                  {system}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* GDP Range Slider */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', 
            borderRadius: 2,
            border: '1px solid rgba(56, 189, 248, 0.2)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon sx={{ color: '#f59e0b', mr: 1, fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
                GDP Per Capita Range
              </Typography>
            </Box>
            
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1 }}>
              ${minGdpFilter.toLocaleString()} - ${(maxGdpFilter === Infinity ? maxGdp : maxGdpFilter).toLocaleString()}
            </Typography>
            
            <Slider
              value={[
                minGdpFilter, 
                maxGdpFilter === Infinity ? maxGdp : maxGdpFilter
              ]}
              min={0}
              max={maxGdp}
              step={5000}
              onChange={(e, newValue) => {
                setMinGdpFilter(newValue[0]);
                setMaxGdpFilter(newValue[1]);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              sx={{
                color: '#f59e0b',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#f59e0b',
                  border: '2px solid #ffffff',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 6px rgba(245, 158, 11, 0.2)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 3,
                  backgroundColor: '#f59e0b',
                },
                '& .MuiSlider-rail': {
                  height: 3,
                  opacity: 0.3,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'rgba(245, 158, 11, 0.9)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterPanel; 