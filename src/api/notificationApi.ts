/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig';
import { PaginatedResponse } from '@/types';

export interface Notification {
  id: number;
  type: 'attendance' | 'system' | 'alert' | 'info';
  title: string;
  message: string;
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export const notificationApi = {
  // Get all notifications for current user
  getNotifications: async (
    page: number = 1,
    pageSize: number = 10,
    unreadOnly: boolean = false
  ): Promise< PaginatedResponse<Notification>> => {
    const response = await axiosInstance.get('/notifications/', {
      params: { page, page_size: pageSize, unread_only: unreadOnly },
    });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise< void> => {
    const response = await axiosInstance.post(`/notifications/${id}/mark_read/`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise< void> => {
    const response = await axiosInstance.post('/notifications/mark_all_read/');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/notifications/${id}/`);
    return response.data;
  },
};