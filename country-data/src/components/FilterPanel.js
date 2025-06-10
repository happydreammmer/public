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
  Chip,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Search as SearchIcon, 
  AccountBalance as PoliticalIcon,
  AttachMoney as MoneyIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon
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
  const activeFiltersCount = 
    (searchTerm ? 1 : 0) + 
    (selectedSystem !== 'All' ? 1 : 0) + 
    (minGdpFilter > 0 || maxGdpFilter < maxGdp ? 1 : 0);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Mobile Accordion for Filters */}
      {isMobile ? (
        <Accordion 
          defaultExpanded={false}
          sx={{ 
            borderRadius: 2, 
            '&:before': { display: 'none' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              borderRadius: '8px 8px 0 0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters & Controls
              </Typography>
              {activeFiltersCount > 0 && (
                <Chip 
                  label={activeFiltersCount} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1, minWidth: 24, height: 24 }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 2 }}>
            <FilterContent 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSystem={selectedSystem}
              setSelectedSystem={setSelectedSystem}
              politicalSystems={politicalSystems}
              minGdpFilter={minGdpFilter}
              maxGdpFilter={maxGdpFilter}
              setMinGdpFilter={setMinGdpFilter}
              setMaxGdpFilter={setMaxGdpFilter}
              maxGdp={maxGdp}
              isMobile={isMobile}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        /* Desktop Layout */
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(25, 118, 210, 0.08) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.1)'
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Interactive Filters & Controls
              </Typography>
              {activeFiltersCount > 0 && (
                <Chip 
                  label={`${activeFiltersCount} active`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            <FilterContent 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSystem={selectedSystem}
              setSelectedSystem={setSelectedSystem}
              politicalSystems={politicalSystems}
              minGdpFilter={minGdpFilter}
              maxGdpFilter={maxGdpFilter}
              setMinGdpFilter={setMinGdpFilter}
              setMaxGdpFilter={setMaxGdpFilter}
              maxGdp={maxGdp}
              isMobile={isMobile}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

const FilterContent = ({
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
    <Grid container spacing={3}>
      {/* Search and Political System Row */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Search Countries"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., United States, Germany, Japan..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              }
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth size="small">
          <InputLabel id="political-system-label">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PoliticalIcon fontSize="small" />
              Political System
            </Box>
          </InputLabel>
          <Select
            labelId="political-system-label"
            value={selectedSystem}
            label="Political System"
            onChange={(e) => setSelectedSystem(e.target.value)}
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              }
            }}
          >
            {politicalSystems.map(system => (
              <MenuItem key={system} value={system}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {system}
                  {system !== 'All' && (
                    <Chip 
                      size="small" 
                      label="Filter" 
                      color="primary" 
                      variant="outlined"
                      sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* GDP Range Slider */}
      <Grid item xs={12}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(25, 118, 210, 0.04)', 
          borderRadius: 2,
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MoneyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              GDP Per Capita Range
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ${minGdpFilter.toLocaleString()} - ${(maxGdpFilter === Infinity ? maxGdp : maxGdpFilter).toLocaleString()} USD
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
              mt: 1,
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                height: 4,
              },
              '& .MuiSlider-rail': {
                height: 4,
                opacity: 0.3,
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default FilterPanel; 