/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig';
import { User, ApiResponse, PaginatedResponse } from '@/types';

export interface StudentCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  password?: string;
}

export interface StudentUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  student_id?: string;
  is_active?: boolean;
}

export const studentApi = {
  // Get all students
  getStudents: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosInstance.get('/students/', {
      params: { page, page_size: pageSize, search },
    });
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`/students/${id}/`);
    return response.data;
  },

  // Create new student
  createStudent: async (data: StudentCreateRequest): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post('/students/', data);
    return response.data;
  },

  // Update student
  updateStudent: async (
    id: number,
    data: StudentUpdateRequest
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch(`/students/${id}/`, data);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/students/${id}/`);
    return response.data;
  },

  // Bulk import students
  importStudents: async (file: File): Promise<ApiResponse<{ imported: number; failed: number }>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/students/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get student statistics
  getStudentStatistics: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/students/statistics/');
    return response.data;
  },

  // Search students
  searchStudents: async (
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosInstance.get('/students/search/', {
      params: { q: query, page, page_size: pageSize },
    });
    return response.data;
  },

  // Get inactive students
  getInactiveStudents: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosInstance.get('/students/inactive/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Activate/deactivate student
  toggleStudentStatus: async (
    id: number,
    isActive: boolean
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch(`/students/${id}/status/`, {
      is_active: isActive,
    });
    return response.data;
  },
};