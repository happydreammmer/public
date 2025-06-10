import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error while loading the visualization. 
              This might be due to a data formatting issue or a temporary problem.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleReload}
                sx={{ mr: 2 }}
              >
                Reload Page
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </Button>
            </Box>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Error Details (Development Mode):
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    overflow: 'auto',
                    maxHeight: 200,
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                >
                  <pre>{this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 