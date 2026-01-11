import axiosInstance from './axiosConfig';
import { Attendance, ApiResponse, PaginatedResponse, FaceDetectionResult, LivenessCheck } from '@/types';

export interface MarkAttendanceRequest {
  image: string; // base64 encoded image
  location?: string;
}

export interface FaceEnrollmentRequest {
  student_id: number;
  images: string[]; // base64 encoded images
}

export const attendanceApi = {
  // Mark attendance
  markAttendance: async (data: MarkAttendanceRequest): Promise<ApiResponse<Attendance>> => {
    const response = await axiosInstance.post('/attendance/mark/', data);
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async (): Promise<ApiResponse<Attendance[]>> => {
    const response = await axiosInstance.get('/attendance/today/');
    return response.data;
  },

  // Get attendance by date range
  getAttendanceByDate: async (
    startDate: string,
    endDate: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Attendance>>> => {
    const response = await axiosInstance.get('/attendance/', {
      params: {
        start_date: startDate,
        end_date: endDate,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // Get student attendance
  getStudentAttendance: async (
    studentId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Attendance>>> => {
    const response = await axiosInstance.get(`/attendance/student/${studentId}/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Face detection API
  detectFace: async (image: string): Promise<ApiResponse<FaceDetectionResult>> => {
    const response = await axiosInstance.post('/face/detect/', { image });
    return response.data;
  },

  // Liveness check
  checkLiveness: async (images: string[]): Promise<ApiResponse<LivenessCheck>> => {
    const response = await axiosInstance.post('/face/liveness/', { images });
    return response.data;
  },

  // Face enrollment for new students
  enrollFace: async (data: FaceEnrollmentRequest): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post('/face/enroll/', data);
    return response.data;
  },

  // Verify face
  verifyFace: async (image: string): Promise<ApiResponse<{ student_id: number; confidence: number }>> => {
    const response = await axiosInstance.post('/face/verify/', { image });
    return response.data;
  },

  // Export attendance to Excel
  exportAttendance: async (
    startDate: string,
    endDate: string,
    format: 'excel' | 'csv' = 'excel'
  ): Promise<Blob> => {
    const response = await axiosInstance.get('/attendance/export/', {
      params: { start_date: startDate, end_date: endDate, format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Get attendance statistics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStatistics: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/attendance/statistics/');
    return response.data;
  },

  // Get attendance heatmap data
  getHeatmapData: async (
    startDate: string,
    endDate: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/attendance/heatmap/', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};