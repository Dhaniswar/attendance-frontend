import React, { useState, useEffect, useRef } from 'react';
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
import {
  Visibility,
  RotateRight,
  CheckCircle,
  CameraAlt,
} from '@mui/icons-material';
import { LivenessCheck as LivenessCheckType } from '@/types';

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
  const [progress, setProgress] = useState(0);
  const [challenge, setChallenge] = useState<string>('Look at the camera');
  const videoRef = useRef<HTMLVideoElement>(null);

  const steps = [
    'Eye Blink Detection',
    'Head Movement',
    'Texture Analysis',
  ];

  const challenges = [
    'Look at the camera',
    'Blink your eyes',
    'Turn your head left',
    'Turn your head right',
    'Look back at camera',
  ];

  useEffect(() => {
    // Simulate liveness check process
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            
            // Move to next step
            if (activeStep < steps.length) {
              const newStepsCompleted = [...stepsCompleted];
              newStepsCompleted[activeStep] = true;
              setStepsCompleted(newStepsCompleted);
              
              if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);
                setProgress(0);
                setChallenge(challenges[activeStep + 1]);
              } else {
                // All steps completed
                const result: LivenessCheckType = {
                  eye_blink_detected: true,
                  head_movement_detected: true,
                  texture_analysis_passed: true,
                  overall_score: 0.85,
                  is_live: true,
                };
                onComplete(result);
              }
            }
            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 200);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isProcessing, activeStep, stepsCompleted, onComplete]);

  const handleStartCheck = () => {
    setProgress(0);
    setActiveStep(0);
    setStepsCompleted([false, false, false]);
    setChallenge(challenges[0]);
  };

  const getStepIcon = (index: number) => {
    if (stepsCompleted[index]) {
      return <CheckCircle color="success" />;
    }
    if (index === activeStep) {
      return <CameraAlt color="primary" />;
    }
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
            This step ensures you're a real person and not a photo/video.
            Please follow the instructions carefully.
          </Typography>
        </Alert>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={stepsCompleted[index]}>
              <StepLabel StepIconComponent={() => getStepIcon(index)}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Challenge Display */}
        <Box
          sx={{
            position: 'relative',
            height: 300,
            bgcolor: 'grey.100',
            borderRadius: 2,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Mock video display */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '3px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Face outline */}
              <Box
                sx={{
                  width: 120,
                  height: 160,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  borderRadius: '50%',
                }}
              />
              
              {/* Eyes */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 60,
                  left: 40,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 60,
                  right: 40,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                }}
              />
              
              {/* Mouth */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 60,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'primary.light',
                }}
              />
            </Box>
            
            <Typography
              variant="h5"
              color="primary"
              sx={{
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              {challenge}
            </Typography>
          </Box>

          <video
            ref={videoRef}
            style={{ display: 'none' }}
            autoPlay
            playsInline
          />
        </Box>

        {/* Progress Bar */}
        {isProcessing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Processing liveness check...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
            </Typography>
          </Box>
        )}

        {/* Status Indicators */}
        {/* Status Indicators */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Visibility
              sx={{
                fontSize: 40,
                color: stepsCompleted[0] ? 'success.main' : 'action.disabled',
                mb: 1,
              }}
            />
            <Typography variant="caption" display="block">
              Eye Blink
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <RotateRight
              sx={{
                fontSize: 40,
                color: stepsCompleted[1] ? 'success.main' : 'action.disabled',
                mb: 1,
              }}
            />
            <Typography variant="caption" display="block">
              Head Movement
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CameraAlt
              sx={{
                fontSize: 40,
                color: stepsCompleted[2] ? 'success.main' : 'action.disabled',
                mb: 1,
              }}
            />
            <Typography variant="caption" display="block">
              Texture
            </Typography>
          </Box>
        </Box>
        {/* Start Button */}
        {!isProcessing && activeStep === 0 && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleStartCheck}
            startIcon={<CameraAlt />}
          >
            Start Liveness Check
          </Button>
        )}

        {/* Tips */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Tips for success:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            • Ensure good lighting
            • Remove glasses if possible
            • Follow the instructions exactly
            • Stay within the frame
            • Complete within 30 seconds
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LivenessCheck;