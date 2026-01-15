import axiosInstance from './axiosConfig';
import { Attendance, PaginatedResponse } from '@/types';

export interface MarkAttendanceRequest {
  image: string; // base64 encoded image
  location?: string;
}

export interface FaceEnrollmentRequest {
  student_id: number;
  images: string[]; // base64 encoded images
}

export const attendanceApi = {


  // Get today's attendance
  getTodayAttendance: async (): Promise<Attendance[]> => {
    const response = await axiosInstance.get('/attendance/today/');
    return response.data;
  },

  // Get attendance by date range
  getAttendanceByDate: async (
    startDate: string,
    endDate: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Attendance>> => {
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
  ): Promise<PaginatedResponse<Attendance>> => {
    const response = await axiosInstance.get(`/attendance/${studentId}/`, {
      params: { page, page_size: pageSize },
    });
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

};