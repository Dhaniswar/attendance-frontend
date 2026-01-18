/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosConfig';

export const statisticsApi = {
  // Dashboard stats (students, teachers, today, recent activity)
  getDashboardStats: async (): Promise<any> => {
    const response = await axiosInstance.get('/analytics/dashboard/statistics/');
    return response.data;
  },

  // Attendance heatmap
  getHeatmapData: async (
    startDate: string,
    endDate: string
  ): Promise<any> => {
    const response = await axiosInstance.get('/analytics/attendance/heatmap/', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};
