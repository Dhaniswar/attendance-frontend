import axiosInstance from './axiosConfig';
import { ApiResponse, PaginatedResponse } from '@/types';

export interface Class {
  id: number;
  name: string;
  code: string;
  description: string;
  teacher: number;
  students: number[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface ClassCreateRequest {
  name: string;
  code: string;
  description?: string;
  teacher: number;
  students?: number[];
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export const classApi = {
  // Get all classes
  getClasses: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Class>>> => {
    const response = await axiosInstance.get('/classes/', {
      params: { page, page_size: pageSize, search },
    });
    return response.data;
  },

  // Get class by ID
  getClassById: async (id: number): Promise<ApiResponse<Class>> => {
    const response = await axiosInstance.get(`/classes/${id}/`);
    return response.data;
  },

  // Create class
  createClass: async (data: ClassCreateRequest): Promise<ApiResponse<Class>> => {
    const response = await axiosInstance.post('/classes/', data);
    return response.data;
  },

  // Update class
  updateClass: async (id: number, data: Partial<ClassCreateRequest>): Promise<ApiResponse<Class>> => {
    const response = await axiosInstance.patch(`/classes/${id}/`, data);
    return response.data;
  },

  // Delete class
  deleteClass: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/classes/${id}/`);
    return response.data;
  },

  // Add student to class
  addStudent: async (classId: number, studentId: number): Promise<ApiResponse<Class>> => {
    const response = await axiosInstance.post(`/classes/${classId}/add_student/`, { student_id: studentId });
    return response.data;
  },

  // Remove student from class
  removeStudent: async (classId: number, studentId: number): Promise<ApiResponse<Class>> => {
    const response = await axiosInstance.post(`/classes/${classId}/remove_student/`, { student_id: studentId });
    return response.data;
  },
};