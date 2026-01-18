/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
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
} from '@mui/material';
import { CameraAlt, CheckCircle } from '@mui/icons-material';
import { faceApi } from '@/api/faceApi';
import { LivenessCheck as LivenessCheckType } from '@/types';

interface LivenessCheckProps {
  onComplete: (result: LivenessCheckType) => void;
  isProcessing?: boolean;
}

const LivenessCheck: React.FC<LivenessCheckProps> = ({ onComplete }) => {
  const webcamRef = useRef<Webcam>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Look at Camera', 'Turn Head', 'Blink'];

  const challenges = [
    'Look straight at camera',
    'Turn your head slowly',
    'Blink 2–3 times',
  ];

  const captureFrame = () => {
    if (!webcamRef.current) return;

    const img = webcamRef.current.getScreenshot();
    if (!img) return;

    const updated = [...capturedImages, img];
    setCapturedImages(updated);

    if (updated.length < 3) {
      setActiveStep(updated.length);
    } else {
      performLiveness(updated);
    }
  };

  const performLiveness = async (images: string[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      const res = await faceApi.checkLiveness({ images });

      console.log('Liveness response:', res);

      onComplete(res);
    } catch (err) {
      setError('Liveness check failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Liveness Detection</Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          {challenges[activeStep]}
        </Alert>

        {error && <Alert severity="error">{error}</Alert>}

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', borderRadius: 8 }}
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
        />

        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel icon={capturedImages[i] ? <CheckCircle color="success" /> : <CameraAlt />}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Button
          fullWidth
          variant="contained"
          onClick={captureFrame}
          disabled={isProcessing}
        >
          Capture Step {activeStep + 1}
        </Button>

        {isProcessing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography align="center">Analyzing...</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LivenessCheck;
