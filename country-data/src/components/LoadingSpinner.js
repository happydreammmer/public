import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  LinearProgress,
  Paper,
  Fade,
  keyframes
} from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

// Define animations
const pulse = keyframes`
  0%, 70%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  35% {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const LoadingSpinner = ({ 
  message = 'Loading data...', 
  showProgress = false, 
  progress = 0 
}) => {
  return (
    <Fade in={true} timeout={500}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          p: 4,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(103, 58, 183, 0.05) 100%)',
          borderRadius: 3,
          border: '1px solid rgba(25, 118, 210, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(103, 58, 183, 0.1))',
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(25, 118, 210, 0.1))',
            animation: `${float} 8s ease-in-out infinite reverse`,
          }}
        />

        {/* Main loading icon */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <CircularProgress 
            size={80} 
            thickness={3} 
            sx={{ 
              color: 'primary.main',
              animation: `${float} 3s ease-in-out infinite`
            }} 
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <AnalyticsIcon 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main',
                animation: `${pulse} 2s ease-in-out infinite`
              }} 
            />
          </Box>
        </Box>

        {/* Loading text */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1,
            fontWeight: 600,
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            maxWidth: 400,
            lineHeight: 1.5
          }}
        >
          We're fetching and processing country data including GDP, population, economic freedom indices, 
          and political system information to create your interactive visualization...
        </Typography>

        {/* Progress bar */}
        {showProgress && (
          <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #1976d2, #673ab7)',
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}% complete
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress < 30 ? 'Connecting...' : 
                 progress < 70 ? 'Downloading...' : 
                 progress < 90 ? 'Processing...' : 'Almost done!'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Animated dots */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {[0, 0.3, 0.6].map((delay, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                animation: `${pulse} 1.5s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </Box>

        {/* Loading steps indicator */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {['CSV', 'Parse', 'Validate', 'Ready'].map((step, index) => (
            <Box
              key={step}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                opacity: progress > (index + 1) * 25 ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: progress > (index + 1) * 25 ? 'success.main' : 'grey.300',
                  transition: 'background-color 0.3s ease-in-out'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

export default LoadingSpinner; 