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
  InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Search as SearchIcon, 
  AccountBalance as PoliticalIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSystem: string;
  setSelectedSystem: (value: string) => void;
  politicalSystems: string[];
  minGdpFilter: number;
  maxGdpFilter: number;
  setMinGdpFilter: (value: number) => void;
  setMaxGdpFilter: (value: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSystem,
  setSelectedSystem,
  politicalSystems,
  minGdpFilter,
  maxGdpFilter,
  setMinGdpFilter,
  setMaxGdpFilter
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

  const handleGdpRangeChange = (event: { target: { value: string } }) => {
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
      minHeight: '56px', // Consistent height for all inputs
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
      fontWeight: 600,
      fontSize: '0.95rem',
      '&.Mui-focused': {
        color: '#38bdf8',
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '0.95rem',
      fontWeight: 500,
      padding: '12px 14px',
      '&::placeholder': {
        color: '#64748b',
        opacity: 1,
      }
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
    <Box
      sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 }, 
        borderRadius: 2,
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: { xs: 2, md: 3 },
        width: '100%',
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
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontSize: '1.15rem',
          letterSpacing: 0.2,
          background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          borderBottom: '2px solid rgba(56, 189, 248, 0.15)',
          pb: 1,
          mb: 3
        }}
      >
        🔧 Interactive Filters & Controls
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: { xs: 2, md: 2 },
        width: '100%',
        alignItems: 'stretch'
      }}>
        {/* Search Countries - 50% width desktop, full width mobile */}
        <Box sx={{ 
          flex: { xs: '1 1 auto', md: '0 0 50%' },
          maxWidth: { xs: '100%', md: '50%' },
          minWidth: 0
        }}>
          <TextField
            label="Search Countries"
            variant="outlined"
            size="medium"
            fullWidth
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
        </Box>
        
        {/* Dropdowns Container - 50% width desktop, full width mobile */}
        <Box sx={{ 
          flex: { xs: '1 1 auto', md: '0 0 50%' },
          maxWidth: { xs: '100%', md: '50%' },
          display: 'flex',
          gap: { xs: 2, md: 1.5 },
          minWidth: 0
        }}>
          {/* Political System - 50% of the dropdown container */}
          <Box sx={{ 
            flex: '1 1 50%', 
            maxWidth: '50%',
            minWidth: 0 
          }}>
            <FormControl fullWidth size="medium">
              <InputLabel 
                sx={{ 
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    color: '#38bdf8',
                  },
                }}
              >
                Political System
              </InputLabel>
              <Select
                value={selectedSystem}
                label="Political System"
                onChange={(e) => setSelectedSystem(e.target.value as string)}
                sx={inputStyles}
                MenuProps={selectMenuProps}
              >
                {politicalSystems.map(system => (
                  <MenuItem key={system} value={system}>
                    {system}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* GDP Range - 50% of the dropdown container */}
          <Box sx={{ 
            flex: '1 1 50%',
            maxWidth: '50%', 
            minWidth: 0 
          }}>
            <FormControl fullWidth size="medium">
              <InputLabel 
                sx={{ 
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    color: '#38bdf8',
                  },
                }}
              >
                GDP Range
              </InputLabel>
              <Select
                value={currentGdpRange.label}
                label="GDP Range"
                onChange={handleGdpRangeChange}
                sx={inputStyles}
                MenuProps={selectMenuProps}
              >
                {gdpRanges.map(range => (
                  <MenuItem key={range.label} value={range.label}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterPanel; 