/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Attendance } from '@/types';
import { attendanceApi } from '@/api/attendanceApi';
import { faceApi } from '@/api/faceApi'; 

interface AttendanceState {
  todayAttendance: Attendance[];
  recentAttendance: Attendance[];
  studentAttendance: Attendance[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: AttendanceState = {
  todayAttendance: [],
  recentAttendance: [],
  studentAttendance: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getTodayAttendance();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s attendance');
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (data: { image: string; location?: string }, { rejectWithValue }) => {
    try {
      const response = await faceApi.markAttendance(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark attendance');
    }
  }
);

export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getStudentAttendance(studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
    },
    addAttendanceRecord: (state, action: PayloadAction<Attendance>) => {
      state.todayAttendance.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch today's attendance
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayAttendance = action.payload;
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark attendance
      .addCase(markAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayAttendance.unshift(action.payload);
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setPage, setPageSize, addAttendanceRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer;