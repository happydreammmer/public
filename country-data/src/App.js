import React, { useState, useEffect } from 'react';
import CountryVisualization from './components/CountryVisualization';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Fade,
  Alert,
  AlertTitle
} from '@mui/material';
import { Refresh as RefreshIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import * as d3 from 'd3';

// Create a custom theme for better UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: 'transparent',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(20);

      const response = await fetch('/data/final_country_data.csv');
      setLoadingProgress(40);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      setLoadingProgress(70);

      // Use d3.csvParse for more robust CSV parsing
      const parsedData = d3.csvParse(csvText, d => {
        // Validate required fields
        if (!d.country || !d.gdp_per_capita || !d.population || !d.economic_freedom) {
          return null; // Skip invalid rows
        }

        return {
          country: d.country.trim(),
          gdp_per_capita: +d.gdp_per_capita,
          population: +d.population,
          economic_freedom: +d.economic_freedom,
          political_system: d.political_system ? d.political_system.trim() : 'Unknown'
        };
      }).filter(d => d !== null); // Remove invalid entries

      setLoadingProgress(90);

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the CSV file');
      }

      console.log(`Successfully loaded ${parsedData.length} countries`);
      setCountryData(parsedData);
      setLoadingProgress(100);
      
      // Small delay to show completion
      setTimeout(() => setLoading(false), 300);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <AnalyticsIcon sx={{ mr: 2, color: 'white' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 600 }}>
              Country Data Analytics
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh Data"
              sx={{ color: 'white' }}
            >
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in={true} timeout={800}>
            <Box>
              {/* Header Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    mb: 2
                  }}
                >
                  Interactive Country Data Visualization
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  Explore relationships between GDP, population, economic freedom, and political systems across countries
                </Typography>
              </Box>

              {/* Main Content Panel */}
              <Paper 
                elevation={6} 
                sx={{ 
                  p: { xs: 2, md: 4 }, 
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {loading ? (
                  <LoadingSpinner 
                    message="Loading country data..." 
                    showProgress={true}
                    progress={loadingProgress}
                  />
                ) : error ? (
                  <Fade in={true}>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiAlert-icon': { fontSize: 28 }
                      }}
                      action={
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={handleRefresh}
                          title="Try Again"
                        >
                          <RefreshIcon />
                        </IconButton>
                      }
                    >
                      <AlertTitle sx={{ fontWeight: 600 }}>Failed to load data</AlertTitle>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                        Please check your internet connection and try again.
                      </Typography>
                    </Alert>
                  </Fade>
                ) : (
                  <Fade in={true} timeout={600}>
                    <ErrorBoundary>
                      <CountryVisualization data={countryData} />
                    </ErrorBoundary>
                  </Fade>
                )}
              </Paper>

              {/* Footer Info */}
              {!loading && !error && (
                <Fade in={true} timeout={1000}>
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        maxWidth: 800,
                        mx: 'auto',
                        lineHeight: 1.6
                      }}
                    >
                      This visualization shows the top countries by GDP per capita. 
                      Circle size represents population, X-axis shows Economic Freedom Index, 
                      Y-axis shows GDP Per Capita, and colors represent different political systems. 
                      Use the interactive filters to explore specific countries and trends.
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
