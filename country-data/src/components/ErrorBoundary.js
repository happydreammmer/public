import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Alert,
  AlertTitle,
  Fade
} from '@mui/material';
import { 
  Warning as WarningIcon, 
  Refresh as RefreshIcon,
  BugReport as BugReportIcon 
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Fade in={true} timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2), transparent)',
              }}
            />

            {/* Error Icon */}
            <Box sx={{ mb: 3 }}>
              <WarningIcon 
                sx={{ 
                  fontSize: 64, 
                  color: '#f87171',
                  filter: 'drop-shadow(0 4px 8px rgba(220, 38, 38, 0.3))'
                }} 
              />
            </Box>

            {/* Error Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#f87171',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Oops! Something went wrong
            </Typography>

            {/* Error Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem',
                color: '#fecaca'
              }}
            >
              We encountered an unexpected error while loading the visualization. 
              This might be due to a data formatting issue or a temporary problem.
              Don't worry, this can usually be fixed easily!
            </Typography>
            
            <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={this.handleReload}
                startIcon={<RefreshIcon />}
                sx={{ 
                  px: 3,
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  }
                }}
              >
                Reload Page
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                sx={{ 
                  px: 3,
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'rgba(248, 113, 113, 0.5)',
                  color: '#f87171',
                  '&:hover': {
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  }
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
                textAlign: 'left',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: '#93c5fd',
                '& .MuiAlert-icon': {
                  color: '#60a5fa'
                }
              }}
            >
              <AlertTitle sx={{ color: '#60a5fa', fontWeight: 600 }}>
                Troubleshooting Tips
              </AlertTitle>
              <Typography variant="body2" sx={{ color: '#93c5fd', mb: 1 }}>
                • Check your internet connection
              </Typography>
              <Typography variant="body2" sx={{ color: '#93c5fd', mb: 1 }}>
                • Clear your browser cache and reload
              </Typography>
              <Typography variant="body2" sx={{ color: '#93c5fd' }}>
                • If the problem persists, try again in a few minutes
              </Typography>
            </Alert>

            {/* Technical Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#94a3b8',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <BugReportIcon fontSize="small" />
                  Technical Details (Development Mode)
                </Typography>
                <Box sx={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  maxHeight: 200,
                  overflow: 'auto'
                }}>
                  <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 'inherit' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 