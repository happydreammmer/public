import React, { createRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Fade,
  Alert,
  AlertTitle
} from '@mui/material';
import { 
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.errorRef = createRef();
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
        <Fade in={true} timeout={500} nodeRef={this.errorRef}>
          <Box ref={this.errorRef} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)',
              borderRadius: 2
            }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                maxWidth: 600,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(220, 38, 38, 0.1)'
              }}
            >
              {/* Error Icon */}
              <Box sx={{ mb: 3 }}>
                <ErrorIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: 'error.main',
                    filter: 'drop-shadow(0 2px 8px rgba(220, 38, 38, 0.3))'
                  }} 
                />
              </Box>

              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: 'error.main',
                  mb: 2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Oops! Something went wrong
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                We encountered an unexpected error while loading the visualization. 
                This might be due to a data formatting issue or a temporary problem.
                Don't worry, this can usually be fixed easily!
              </Typography>
              
              <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={this.handleReload}
                  startIcon={<RefreshIcon />}
                  sx={{ 
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  Reload Page
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  sx={{ 
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Try Again
                </Button>
              </Box>

              {/* Helpful suggestions */}
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  textAlign: 'left'
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Quick fixes to try:</AlertTitle>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Clear your browser cache</li>
                  <li>Try a different browser</li>
                </ul>
              </Alert>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mt: 3, textAlign: 'left' }}>
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BugIcon fontSize="small" />
                      Error Details (Development Mode)
                    </AlertTitle>
                    <Paper 
                      sx={{ 
                        mt: 2,
                        p: 2, 
                        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                        overflow: 'auto',
                        maxHeight: 200,
                        fontSize: '12px',
                        fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
                        borderRadius: 1,
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Typography component="pre" sx={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                        {this.state.error.toString()}
                      </Typography>
                      <Typography component="pre" sx={{ fontSize: '11px', color: 'text.secondary', mt: 1, whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    </Paper>
                  </Alert>
                </Box>
              )}
            </Paper>
          </Box>
        </Fade>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 