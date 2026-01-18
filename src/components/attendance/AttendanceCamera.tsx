/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CameraAlt, CheckCircle, Error } from '@mui/icons-material';
import { FaceDetectionResult } from '@/types';
import { faceApi } from '@/api/faceApi';

interface AttendanceCameraProps {
  onFaceDetected: (result: FaceDetectionResult) => void;
  onCapture: (imageData: string) => void;
  isProcessing?: boolean;
  setIsProcessing?: (value: boolean) => void;
}

const AttendanceCamera: React.FC<AttendanceCameraProps> = ({
  onFaceDetected,
  onCapture,
  isProcessing = false,
  setIsProcessing,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode,
  };

const capture = useCallback(async () => {
  if (!webcamRef.current) return;

  const imageSrc = webcamRef.current.getScreenshot();
  if (imageSrc) {
    setLastCapture(imageSrc);
    setIsProcessing?.(true);
    setError(null);
    
    try {
      // Call face detection API
      const response = await faceApi.detectFaces({ image: imageSrc });
      
      if (response.faces) {
        onFaceDetected(response);
        onCapture(imageSrc);
      } else {
        setError('No face detected. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Face detection failed');
    } finally {
      setIsProcessing?.(false);
    }
  }
}, [onCapture, onFaceDetected, setIsProcessing]);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Face Recognition Camera
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ position: 'relative', mb: 2 }}>
          {lastCapture ? (
            <Box
              component="img"
              src={lastCapture}
              alt="Captured"
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                width: '100%',
                maxHeight: 400,
                borderRadius: 8,
              }}
              onUserMediaError={() => setError('Cannot access camera. Please check permissions.')}
            />
          )}

          {isProcessing && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={24} color="inherit" />
              <Typography color="white">Processing face...</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<CameraAlt />}
            onClick={capture}
            disabled={isProcessing}
            fullWidth
          >
            Capture & Recognize
          </Button>
          
          <Button
            variant="outlined"
            onClick={flipCamera}
            disabled={isProcessing}
          >
            Flip Camera
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          • Ensure good lighting
          • Face the camera directly
          • Remove glasses if possible
          • Stay still while capturing
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AttendanceCamera;