/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  Visibility,
  RotateRight,
  CheckCircle,
  CameraAlt,
} from '@mui/icons-material';
import { faceApi } from '@/api/faceApi';
import { LivenessCheck as LivenessCheckType } from '@/types';
// import { AttendanceCamera } from './AttendanceCamera';

interface LivenessCheckProps {
  onComplete: (result: LivenessCheckType) => void;
  isProcessing?: boolean;
}

const LivenessCheck: React.FC<LivenessCheckProps> = ({
  onComplete,
  isProcessing = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>([false, false, false]);
  const [challenge, setChallenge] = useState<string>('Look at the camera');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const steps = ['Look at Camera', 'Turn Head', 'Blink Eyes'];

  const challenges = [
    'Look at the camera',
    'Slowly turn your head left',
    'Slowly turn your head right',
    'Blink your eyes 2-3 times',
    'Look back at camera',
  ];

  const handleCapture = async () => {
    if (capturedImages.length >= 5) return;

    setIsCapturing(true);

    // ⬇️ Simulated capture (replace with real webcam later)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const updated = [...capturedImages, mockImage];
    setCapturedImages(updated);
    setIsCapturing(false);

    // Step progression
    if (activeStep < steps.length - 1) {
      setStepsCompleted((prev) => {
        const copy = [...prev];
        copy[activeStep] = true;
        return copy;
      });

      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setChallenge(challenges[nextStep]);
    } else {
      await performLivenessCheck(updated);
    }
  };

  const performLivenessCheck = async (images: string[]) => {
    setIsCapturing(true);

    try {
      const response = await faceApi.checkLiveness({
        images,
      });

      // Mark all steps complete
      setStepsCompleted([true, true, true]);

      // Send result upward
      onComplete(response.data);
    } catch (error) {
      console.error('Liveness check failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const getStepIcon = (index: number) => {
    if (stepsCompleted[index]) return <CheckCircle color="success" />;
    if (index === activeStep) return <CameraAlt color="primary" />;
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Liveness Detection
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Follow the instructions to prove you're a real person
          </Typography>
        </Alert>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={stepsCompleted[index]}>
              <StepLabel StepIconComponent={() => getStepIcon(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Challenge Box */}
        <Box
          sx={{
            position: 'relative',
            height: 300,
            bgcolor: 'grey.100',
            borderRadius: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {capturedImages.length}/5
            </Typography>
            <Typography>{challenge}</Typography>

            {isCapturing && (
              <Typography variant="body2" color="text.secondary">
                Processing...
              </Typography>
            )}
          </Box>
        </Box>

        {/* Capture Button */}
        {!stepsCompleted.every(Boolean) && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCapture}
            disabled={isCapturing || capturedImages.length >= 5}
            startIcon={<CameraAlt />}
          >
            {isCapturing
              ? 'Processing...'
              : `Capture Image ${capturedImages.length + 1}`}
          </Button>
        )}

        {/* Progress Bar */}
        {capturedImages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(capturedImages.length / 5) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {capturedImages.length} of 5 images captured
            </Typography>
          </Box>
        )}

        {/* Status Icons */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {['Face', 'Movement', 'Blink'].map((label, i) => (
            <Grid item xs={4} key={label}>
              <Box sx={{ textAlign: 'center' }}>
                <CameraAlt
                  sx={{
                    fontSize: 40,
                    color: stepsCompleted[i] ? 'success.main' : 'action.disabled',
                  }}
                />
                <Typography variant="caption">{label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LivenessCheck;
