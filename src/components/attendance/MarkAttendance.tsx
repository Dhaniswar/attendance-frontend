/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Face,
  CheckCircle,
  Error,
  ArrowForward,
  RestartAlt,
} from '@mui/icons-material';
import AttendanceCamera from './AttendanceCamera';
import LivenessCheck from './LivenessCheck';
import { faceApi } from '@/api/faceApi';
import { FaceDetectionResult } from '@/types';

const MarkAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const steps = ['Face Detection', 'Liveness Check', 'Mark Attendance'];

  const handleFaceDetected = (result: FaceDetectionResult) => {
    setFaceResult(result);
    setError(null);
    
    if (result.face_detected && (result.confidence || 0) > 0.6) {
      setActiveStep(1);
    } else {
      setError(
        result.face_detected 
          ? `Low confidence (${((result.confidence || 0) * 100).toFixed(1)}%). Please try again.`
          : 'No face detected. Please position yourself correctly.'
      );
    }
  };

  const handleLivenessComplete = (result: any) => {
    if (result.is_live) {
      setActiveStep(2);
    } else {
      setError('Liveness check failed. Please try again.');
    }
  };

  const handleMarkAttendance = async () => {
    if (!faceResult || !faceResult.face_detected || !faceResult.face_embedding || faceResult.face_embedding.length === 0) {
      setError('No face data available');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert face to base64 if needed (simplified - in real app you'd store the image)
      const response = await faceApi.markAttendance({
        image: '', // You need to store the image from camera
        location: 'Main Building',
      });

      setAttendanceData(response.data);
      setSuccess(true);
      
      // Show success for 3 seconds then redirect
      setTimeout(() => {
        navigate('/student');
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setFaceResult(null);
    setError(null);
    setSuccess(false);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AttendanceCamera
            onFaceDetected={handleFaceDetected}
            onCapture={() => {}}
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
                <Alert severity="info" icon={<Face />}>
                  <Typography variant="body2">
                    Face detected with {((faceResult?.confidence || 0) * 100).toFixed(1)}% confidence
                  </Typography>
                </Alert>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleMarkAttendance}
                disabled={isProcessing || success}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isProcessing ? 'Marking Attendance...' : 
                 success ? 'Attendance Marked!' : 'Confirm & Mark Attendance'}
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={handleReset}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            Attendance marked successfully!
          </Typography>
          <Typography variant="body2">
            Time: {new Date().toLocaleTimeString()}
          </Typography>
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
        
        {activeStep < steps.length - 1 && !success && (
          <Button
            variant="contained"
            onClick={() => setActiveStep(prev => prev + 1)}
            endIcon={<ArrowForward />}
            disabled={isProcessing}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MarkAttendance;