import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Face,
  CheckCircle,
  Error,
  CameraAlt,
  Security,
  ArrowForward,
  RestartAlt,
} from '@mui/icons-material';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import AttendanceCamera from '@/components/attendance/AttendanceCamera';
import LivenessCheck from '@/components/attendance/LivenessCheck';
import { RootState } from '@/store/store';
import { FaceDetectionResult, LivenessCheck as LivenessCheckType } from '@/types';

const AttendancePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);
  const [livenessResult, setLivenessResult] = useState<LivenessCheckType | null>(null);
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = ['Face Detection', 'Liveness Check', 'Confirmation'];

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleFaceDetected = (result: FaceDetectionResult) => {
    setFaceResult(result);
    setErrorMessage(null);
    
    if (result.face_detected && result.confidence > 0.8) {
      setActiveStep(1);
    } else {
      setErrorMessage(
        result.face_detected 
          ? `Low confidence (${(result.confidence * 100).toFixed(1)}%). Please try again.`
          : 'No face detected. Please position yourself correctly.'
      );
    }
  };

  const handleLivenessComplete = (result: LivenessCheckType) => {
    setLivenessResult(result);
    
    if (result.is_live && result.overall_score > 0.7) {
      setActiveStep(2);
    } else {
      setErrorMessage('Liveness check failed. Please try again.');
    }
  };

  const handleCapture = async (imageData: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock face detection result
    const mockResult: FaceDetectionResult = {
      face_detected: true,
      confidence: 0.92,
      face_embedding: Array(128).fill(0.1),
      bounding_box: { x: 100, y: 100, width: 200, height: 200 },
      landmarks: Array(68).fill([0, 0]),
    };
    
    handleFaceDetected(mockResult);
    setIsProcessing(false);
  };

  const handleMarkAttendance = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuccessDialog(true);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFaceResult(null);
    setLivenessResult(null);
    setErrorMessage(null);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AttendanceCamera
            onFaceDetected={handleFaceDetected}
            onCapture={handleCapture}
            isProcessing={isProcessing}
          />
        );
      case 1:
        return (
          <LivenessCheck
            onComplete={handleLivenessComplete}
            isProcessing={isProcessing}
          />
        );
      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Confirm Attendance
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Face recognized successfully!
                  </Typography>
                  <Typography variant="body2">
                    Confidence: {(faceResult?.confidence || 0) * 100}%
                  </Typography>
                </Alert>
                
                {livenessResult && (
                  <Alert severity="info">
                    <Typography variant="subtitle2">
                      Liveness check passed
                    </Typography>
                    <Typography variant="body2">
                      Score: {(livenessResult.overall_score * 100).toFixed(1)}%
                    </Typography>
                  </Alert>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Student Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {user?.first_name} {user?.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1">
                      {user?.student_id || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleMarkAttendance}
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isProcessing ? 'Marking Attendance...' : 'Confirm Attendance'}
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Mark Attendance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Use face recognition with liveness detection to mark your attendance
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color: activeStep > index ? 'success.main' : 'grey.300',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Error Message */}
        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleReset}>
                Retry
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {/* Current Step Content */}
        {getStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={handleReset}
            startIcon={<RestartAlt />}
            disabled={activeStep === 0 || isProcessing}
          >
            Start Over
          </Button>
          
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => prev + 1)}
              endIcon={<ArrowForward />}
              disabled={isProcessing}
            >
              Next
            </Button>
          )}
        </Box>

        {/* Tips Section */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
            Tips for Best Results
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <CameraAlt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">
                  Good Lighting
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Face sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">
                  Face Camera Directly
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">
                  No Glasses/Mask
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">
                  Stay Still
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="success" />
            Attendance Marked Successfully!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Your attendance has been recorded for {new Date().toLocaleDateString()}.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Time: ${new Date().toLocaleTimeString()}`}
              color="primary"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`Confidence: ${(faceResult?.confidence || 0) * 100}%`}
              color="success"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialog(false)}>Close</Button>
          <Button variant="contained" href="/student">
            View Attendance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendancePage;