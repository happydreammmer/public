import React, { useRef } from 'react';
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

interface LoadingSpinnerProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading data...', 
  showProgress = false, 
  progress = 0 
}) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  
  return (
    <Fade in={true} timeout={500}>
      <Paper ref={loadingRef}
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          p: 4,
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent)',
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent)',
            animation: `${float} 8s ease-in-out infinite reverse`,
          }}
        />

        {/* Main loading icon */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <CircularProgress 
            size={60} 
            thickness={3} 
            sx={{ 
              color: '#38bdf8',
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
                fontSize: 24, 
                color: '#38bdf8',
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
            color: '#f8fafc',
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            maxWidth: 350,
            lineHeight: 1.5,
            color: '#94a3b8'
          }}
        >
          Fetching and processing country data including GDP, population, economic freedom indices, 
          and political system information...
        </Typography>

        {/* Progress bar */}
        {showProgress && (
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#38bdf8',
                  borderRadius: 3,
                }
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1,
                color: '#94a3b8',
                fontWeight: 500
              }}
            >
              {progress}% complete
            </Typography>
          </Box>
        )}

        {/* Animated dots */}
        <Box sx={{ mt: 2, display: 'flex', gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                animation: `${pulse} 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

export default LoadingSpinner; 