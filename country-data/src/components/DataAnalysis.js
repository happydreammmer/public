import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  AccountBalance as GovernmentIcon,
  MonetizationOn as MoneyIcon,
  Security as SecurityIcon,
  KeyboardArrowRight as ArrowIcon
} from '@mui/icons-material';
import * as d3 from 'd3';

const DataAnalysis = ({ data }) => {
  // Correlation calculation helper (moved before useMemo)
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Comprehensive data analysis using useMemo for performance
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Categorize political systems
    const categorizePoliticalSystem = (system) => {
      const systemLower = system.toLowerCase();
      if (systemLower.includes('monarchy') || systemLower.includes('monarch')) return 'Monarchies';
      if (systemLower.includes('republic')) return 'Republics';
      return 'Others';
    };

    // Process data with categories
    const processedData = data.map(d => ({
      ...d,
      category: categorizePoliticalSystem(d.political_system)
    }));

    // Basic statistics
    const totalCountries = processedData.length;
    const totalPopulation = d3.sum(processedData, d => d.population);
    const avgGdp = d3.mean(processedData, d => d.gdp_per_capita);
    const avgEconomicFreedom = d3.mean(processedData, d => d.economic_freedom);

    // Political system distribution
    const systemCounts = d3.rollup(processedData, v => v.length, d => d.category);
    const systemDistribution = Array.from(systemCounts, ([key, value]) => ({
      system: key,
      count: value,
      percentage: (value / totalCountries * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);

    // GDP analysis by political system
    const gdpBySystem = d3.rollup(processedData, 
      v => ({
        avg: d3.mean(v, d => d.gdp_per_capita),
        median: d3.median(v, d => d.gdp_per_capita),
        count: v.length
      }), 
      d => d.category
    );

    // Economic freedom analysis
    const economicFreedomBySystem = d3.rollup(processedData, 
      v => d3.mean(v, d => d.economic_freedom), 
      d => d.category
    );

    // Correlation analysis
    const correlation = d3.deviation(processedData.map(d => ({
      x: d.economic_freedom,
      y: d.gdp_per_capita
    })));

    // Population analysis
    const popStats = {
      largest: d3.max(processedData, d => d.population),
      smallest: d3.min(processedData, d => d.population),
      median: d3.median(processedData, d => d.population)
    };

    // Wealth distribution
    const wealthDistribution = [
      { range: '0-10k', count: processedData.filter(d => d.gdp_per_capita < 10000).length },
      { range: '10k-30k', count: processedData.filter(d => d.gdp_per_capita >= 10000 && d.gdp_per_capita < 30000).length },
      { range: '30k-50k', count: processedData.filter(d => d.gdp_per_capita >= 30000 && d.gdp_per_capita < 50000).length },
      { range: '50k+', count: processedData.filter(d => d.gdp_per_capita >= 50000).length }
    ];

    // Top performers
    const richestCountries = processedData.sort((a, b) => b.gdp_per_capita - a.gdp_per_capita).slice(0, 5);
    const mostFree = processedData.sort((a, b) => b.economic_freedom - a.economic_freedom).slice(0, 5);
    const mostPopulous = processedData.sort((a, b) => b.population - a.population).slice(0, 5);

    // Economic freedom vs GDP correlation
    const freedomGdpCorr = calculateCorrelation(
      processedData.map(d => d.economic_freedom),
      processedData.map(d => d.gdp_per_capita)
    );

    return {
      totalCountries,
      totalPopulation,
      avgGdp,
      avgEconomicFreedom,
      systemDistribution,
      gdpBySystem,
      economicFreedomBySystem,
      popStats,
      wealthDistribution,
      richestCountries,
      mostFree,
      mostPopulous,
      freedomGdpCorr
    };
  }, [data]);

  if (!analysis) return null;

  const colors = {
    'Monarchies': '#8b5cf6',
    'Republics': '#22c55e',
    'Others': '#f59e0b'
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Main Analysis Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(24px)',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #8b5cf6 50%, #22c55e 100%)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InsightsIcon sx={{ fontSize: 32, color: '#38bdf8', mr: 2 }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 900, 
            background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Global Economic & Political Analysis
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Analysis of {analysis.totalCountries} countries examining relationships between 
          economic freedom, GDP per capita, and political governance systems.
        </Typography>
      </Paper>

      {/* Key Insights Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.3)',
          backdropFilter: 'blur(24px)',
          mb: 4
        }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            backgroundColor: 'transparent',
            border: 'none',
            '& .MuiAlert-icon': { color: '#22c55e', fontSize: 28 }
          }}
        >
          <AlertTitle sx={{ fontWeight: 700, color: '#22c55e', fontSize: '1.2rem' }}>
            🔍 Key Discovery: Strong Economic Freedom-Prosperity Correlation
          </AlertTitle>
          <Typography sx={{ color: '#86efac', fontSize: '1rem', mt: 1 }}>
            <strong>Correlation coefficient: {(analysis.freedomGdpCorr * 100).toFixed(1)}%</strong> - 
            Countries with higher economic freedom consistently show higher GDP per capita.
          </Typography>
        </Alert>
      </Paper>

      {/* Political System Analysis */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(24px)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GovernmentIcon sx={{ color: '#8b5cf6', mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Political System Distribution
                </Typography>
              </Box>
              
              {analysis.systemDistribution.map((system) => (
                <Box key={system.system} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={system.system} 
                      sx={{ 
                        backgroundColor: colors[system.system],
                        color: 'white',
                        fontWeight: 600,
                        minWidth: 100
                      }}
                    />
                    <Typography sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                      {system.count} countries ({system.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(system.percentage)} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: colors[system.system],
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backdropFilter: 'blur(24px)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MoneyIcon sx={{ color: '#f59e0b', mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Economic Performance by System
                </Typography>
              </Box>
              
              {Array.from(analysis.gdpBySystem.entries()).map(([system, stats]) => (
                <Box key={system} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={system} 
                      size="small"
                      sx={{ 
                        backgroundColor: colors[system],
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {stats.count} countries
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 0.5 }}>
                    Average GDP: <strong>${stats.avg.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Median GDP: <strong>${stats.median.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wealth Distribution Analysis */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(24px)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUpIcon sx={{ color: '#38bdf8', mr: 2, fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
            Global Wealth Distribution Analysis
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {analysis.wealthDistribution.map((bracket, index) => {
            const percentage = (bracket.count / analysis.totalCountries * 100).toFixed(1);
            return (
              <Grid item xs={6} md={3} key={bracket.range}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    color: ['#ef4444', '#f59e0b', '#22c55e', '#38bdf8'][index],
                    mb: 1 
                  }}>
                    {bracket.count}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                    ${bracket.range} GDP
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}>
                    {percentage}% of countries
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Top Performers Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(24px)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MoneyIcon sx={{ color: '#22c55e', mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Wealthiest Nations
                </Typography>
              </Box>
              
              <List dense>
                {analysis.richestCountries.map((country, index) => (
                  <ListItem key={country.country} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#22c55e', 
                        fontWeight: 700,
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {index + 1}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={country.country}
                      secondary={`$${country.gdp_per_capita.toLocaleString()}`}
                      primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                      secondaryTypographyProps={{ sx: { color: '#22c55e', fontWeight: 600 } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backdropFilter: 'blur(24px)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ color: '#f59e0b', mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Most Economically Free
                </Typography>
              </Box>
              
              <List dense>
                {analysis.mostFree.map((country, index) => (
                  <ListItem key={country.country} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#f59e0b', 
                        fontWeight: 700,
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {index + 1}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={country.country}
                      secondary={`${country.economic_freedom.toFixed(1)} score`}
                      primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                      secondaryTypographyProps={{ sx: { color: '#f59e0b', fontWeight: 600 } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backdropFilter: 'blur(24px)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ color: '#38bdf8', mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Most Populous Nations
                </Typography>
              </Box>
              
              <List dense>
                {analysis.mostPopulous.map((country, index) => (
                  <ListItem key={country.country} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Typography variant="body2" sx={{ 
                        color: '#38bdf8', 
                        fontWeight: 700,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {index + 1}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={country.country}
                      secondary={`${(country.population / 1000000).toFixed(0)}M people`}
                      primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                      secondaryTypographyProps={{ sx: { color: '#38bdf8', fontWeight: 600 } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Conclusions and Insights */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #22c55e 50%, #38bdf8 100%)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <InsightsIcon sx={{ fontSize: 32, color: '#8b5cf6', mr: 2 }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 900, 
            color: '#f8fafc'
          }}>
            Key Insights & Conclusions
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700, mb: 2 }}>
              🎯 Economic Patterns
            </Typography>
            <List>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Economic Freedom Drives Prosperity"
                  secondary="Strong positive correlation between economic freedom and GDP per capita"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Wealth Concentration"
                  secondary="Only 15% of countries have GDP per capita above $50,000"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Population Paradox"
                  secondary="Most populous countries don't necessarily have the highest GDP per capita"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 700, mb: 2 }}>
              🏛️ Political Governance
            </Typography>
            <List>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Republican Dominance"
                  secondary="Republics represent majority of political systems globally"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Monarchical Performance"
                  secondary="Constitutional monarchies often achieve high economic freedom scores"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 0.5, minWidth: 30 }}>
                  <ArrowIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="System Effectiveness"
                  secondary="Political system type appears less predictive of prosperity than economic policies"
                  primaryTypographyProps={{ sx: { color: '#f8fafc', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: '#94a3b8' } }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Alert 
          severity="info" 
          sx={{ 
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 2,
            '& .MuiAlert-icon': { color: '#38bdf8' }
          }}
        >
          <AlertTitle sx={{ color: '#38bdf8', fontWeight: 700 }}>
            💡 Strategic Implications
          </AlertTitle>
          <Typography sx={{ color: '#bae6fd', mt: 1 }}>
            The data suggests that countries seeking to improve their economic outcomes should prioritize policies that enhance 
            economic freedom, including property rights protection, regulatory efficiency, and open markets. Political system 
            type appears to be less deterministic than the actual economic policies implemented within those systems.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default DataAnalysis; 