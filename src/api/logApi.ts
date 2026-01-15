/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig';
import {  PaginatedResponse } from '@/types';

export interface SystemLog {
  id: number;
  level: 'info' | 'warning' | 'error' | 'debug';
  type: 'attendance' | 'face_recognition' | 'system' | 'user' | 'security';
  message: string;
  user: number | null;
  ip_address: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export const logApi = {
  // Get system logs (admin only)
  getLogs: async (
    page: number = 1,
    pageSize: number = 20,
    level?: string,
    type?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedResponse<SystemLog>> => {
    const response = await axiosInstance.get('/system-logs/', {
      params: {
        page,
        page_size: pageSize,
        level,
        type,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  // Get log by ID
  getLogById: async (id: number): Promise<SystemLog> => {
    const response = await axiosInstance.get(`/system-logs/${id}/`);
    return response.data;
  },

  // Clear old logs
  clearOldLogs: async (days: number = 30): Promise<{ deleted_count: number }> => {
    const response = await axiosInstance.post('/system-logs/clear/', { days });
    return response.data;
  },
};