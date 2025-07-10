import React, { useState, useEffect, useRef } from 'react';
import CountryVisualization from './components/CountryVisualization';
import DataAnalysis from './components/DataAnalysis';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { 
  Box, 
  Typography, 
  Container, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Fade,
  Alert,
  AlertTitle
} from '@mui/material';
import * as d3 from 'd3';

interface CountryData {
  country: string;
  gdp_per_capita: number;
  population: number;
  economic_freedom: number;
  political_system: string;
}

// Create a theme matching event-hunter style
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.8)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    success: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 900,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
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
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 50,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  const mainContentRef = useRef(null);
  const errorContentRef = useRef(null);
  const visualizationRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(20);

      const response = await fetch(`data/final_country_data.csv`);
      setLoadingProgress(40);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      setLoadingProgress(70);

      const parsedData = d3.csvParse(csvText, (d): CountryData | null => {
        if (!d.country || !d.gdp_per_capita || !d.population || !d.economic_freedom) {
          return null;
        }

        return {
          country: d.country.trim(),
          gdp_per_capita: +d.gdp_per_capita,
          population: +d.population,
          economic_freedom: +d.economic_freedom,
          political_system: d.political_system ? d.political_system.trim() : 'Unknown'
        };
      }).filter((d): d is CountryData => d !== null);

      setLoadingProgress(90);

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the CSV file');
      }

      console.log(`Successfully loaded ${parsedData.length} countries`);
      setCountryData(parsedData);
      setLoadingProgress(100);
      
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

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <h1>Interactive Country Data Visualization</h1>
        </header>

        <main className="container">
          <section className="section">
            <h2>Country Data Visualization</h2>
            <CountryVisualization data={countryData} />
          </section>

          <DataAnalysis data={countryData} />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
