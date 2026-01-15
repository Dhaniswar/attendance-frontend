/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig';
import { FaceDetectionResult, LivenessCheck, Attendance } from '@/types';

export interface FaceDetectionRequest {
  image: string; // base64
  location?: string;
}

export interface FaceVerificationRequest {
  image: string;
}

export interface LivenessCheckRequest {
  images: string[];
}

export interface FaceEnrollmentRequest {
  student_id: number;
  images: string[];
}

export interface MarkAttendanceRequest {
  image: string; // base64 encoded image
  location?: string;
}


export const faceApi = {
  // Detect faces in image
  detectFaces: async (data: FaceDetectionRequest): Promise<FaceDetectionResult> => {
    const response = await axiosInstance.post('/biometrics/detect/', data);
    return response.data;
  },

  // Verify face
  verifyFace: async (data: FaceVerificationRequest): Promise<any> => {
    const response = await axiosInstance.post('/biometrics/verify/', data);
    return response.data;
  },

  // Liveness check
  checkLiveness: async (data: LivenessCheckRequest): Promise<LivenessCheck> => {
    const response = await axiosInstance.post('/biometrics/liveness/', data);
    return response.data;
  },

  // Enroll face
  enrollFace: async (data: FaceEnrollmentRequest): Promise<void> => {
    const response = await axiosInstance.post('/biometrics/enroll/', data);
    return response.data;
  },

  // Test face recognition (development only)
  testFaceRecognition: async (): Promise<any> => {
    const response = await axiosInstance.get('/core/health/');
    return response.data;
  },

  // Mark attendance
  markAttendance: async (data: MarkAttendanceRequest): Promise<Attendance> => {
    const response = await axiosInstance.post('/attendance/mark_with_face/', data);
    return response.data;
  },


};