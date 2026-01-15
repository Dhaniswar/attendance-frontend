import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: 3,
            backgroundColor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 64,
                color: 'error.main',
                mb: 2,
              }}
            />
            
            <Typography variant="h4" gutterBottom color="error">
              Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              The application encountered an unexpected error. Please try again.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  marginY: 3,
                  backgroundColor: 'grey.50',
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 200,
                }}
              >
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Error Details:
                </Typography>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
                
                {this.state.errorInfo && (
                  <>
                    <Typography variant="subtitle2" color="error" sx={{ mt: 2 }}>
                      Component Stack:
                    </Typography>
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </>
                )}
              </Paper>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{ minWidth: 120 }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                onClick={this.handleGoHome}
                sx={{ minWidth: 120 }}
              >
                Go to Home
              </Button>
            </Box>
            
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 3 }}
            >
              If the problem persists, please contact support.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;