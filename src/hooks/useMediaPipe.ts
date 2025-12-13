/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from 'react';
import { FaceDetectionResult } from '@/types';

declare global {
  interface Window {
    FaceDetector?: any;
  }
}

export const useMediaPipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetector, setFaceDetector] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initializeFaceDetector = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if browser supports FaceDetector API
      if (!('FaceDetector' in window)) {
        throw new Error('FaceDetector API not supported in this browser');
      }

      // Initialize FaceDetector
      const detector = new window.FaceDetector({
        maxDetectedFaces: 1,
        fastMode: true,
      });

      setFaceDetector(detector);
      setIsLoading(false);
      return detector;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize face detector';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const detectFaceFromImage = useCallback(
    async (imageElement: HTMLImageElement | HTMLVideoElement): Promise<FaceDetectionResult> => {
      if (!faceDetector) {
        throw new Error('Face detector not initialized');
      }

      try {
        const faces = await faceDetector.detect(imageElement);

        if (faces.length === 0) {
          return {
            face_detected: false,
            confidence: 0,
          };
        }

        const face = faces[0];
        const { boundingBox } = face;

        // Calculate confidence (for FaceDetector API, we need to estimate)
        const confidence = face.confidence || 0.9;

        // Extract landmarks if available
        const landmarks = face.landmarks
          ? face.landmarks.map((point: any) => [point.x, point.y])
          : [];

        return {
          face_detected: true,
          confidence,
          bounding_box: {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
          },
          landmarks,
        };
      } catch (err) {
        console.error('Face detection error:', err);
        throw new Error('Failed to detect face');
      }
    },
    [faceDetector]
  );

  const detectFaceFromVideo = useCallback(
    async (): Promise<FaceDetectionResult> => {
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      return await detectFaceFromImage(videoRef.current);
    },
    [detectFaceFromImage]
  );

  const captureFromVideo = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const drawFaceBox = useCallback(
    (result: FaceDetectionResult, context: CanvasRenderingContext2D) => {
      if (!result.bounding_box) return;

      const { x, y, width, height } = result.bounding_box;

      // Draw bounding box
      context.strokeStyle = result.confidence > 0.8 ? '#00ff00' : '#ff0000';
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);

      // Draw landmarks if available
      if (result.landmarks) {
        context.fillStyle = '#00ff00';
        result.landmarks.forEach(([landmarkX, landmarkY]) => {
          context.beginPath();
          context.arc(landmarkX, landmarkY, 2, 0, 2 * Math.PI);
          context.fill();
        });
      }

      // Draw confidence text
      context.fillStyle = '#ffffff';
      context.font = '14px Arial';
      context.fillText(
        `Confidence: ${Math.round(result.confidence * 100)}%`,
        x,
        y - 5
      );
    },
    []
  );

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (faceDetector) {
        // FaceDetector doesn't have a cleanup method
        setFaceDetector(null);
      }
    };
  }, [faceDetector]);

  return {
    isLoading,
    error,
    faceDetector,
    videoRef,
    canvasRef,
    initializeFaceDetector,
    detectFaceFromImage,
    detectFaceFromVideo,
    captureFromVideo,
    drawFaceBox,
  };
};