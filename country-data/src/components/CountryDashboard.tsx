import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FilterPanel from './FilterPanel';
import CountryChart from './CountryChart';

interface CountryData {
  country: string;
  gdp_per_capita: number;
  population: number;
  economic_freedom: number;
  political_system: string;
}

interface CountryDashboardProps {
  data: CountryData[];
}

const CountryDashboard: React.FC<CountryDashboardProps> = ({ data }) => {
  // Centralized filter state management
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minGdpFilter, setMinGdpFilter] = useState<number>(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState<number>(Infinity);

  // Political systems for filtering
  const politicalSystems = ['All', 'Monarchies', 'Republics', 'One Party Communism', 'Theocracy', 'No Government'];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3,
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        mb: 3,
        overflow: 'hidden'
      }}
    >
      {/* Header Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, sm: 3, md: 4 }, pb: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>
          Country Data Visualization
        </Typography>
      </Box>

      {/* Filters Section - Full Width */}
      <FilterPanel 
        politicalSystems={politicalSystems}
        selectedSystem={selectedSystem}
        setSelectedSystem={setSelectedSystem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minGdpFilter={minGdpFilter}
        maxGdpFilter={maxGdpFilter}
        setMinGdpFilter={setMinGdpFilter}
        setMaxGdpFilter={setMaxGdpFilter}
      />

      {/* Visualization Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 2, sm: 3, md: 4 } }}>
        <CountryChart 
          data={data}
          selectedSystem={selectedSystem}
          searchTerm={searchTerm}
          minGdpFilter={minGdpFilter}
          maxGdpFilter={maxGdpFilter}
        />
      </Box>
    </Paper>
  );
};

export default CountryDashboard;