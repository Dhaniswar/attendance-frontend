export const APP_NAME = 'Face Recognition Attendance System';
export const API_TIMEOUT = 10000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const FACE_CONFIDENCE_THRESHOLD = 0.8;
export const LIVENESS_THRESHOLD = 0.7;

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
} as const;

export const TIME_FORMAT = 'HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
} as const;

export const WEBSOCKET_EVENTS = {
  ATTENDANCE_MARKED: 'attendance_marked',
  STUDENT_REGISTERED: 'student_registered',
  SYSTEM_ALERT: 'system_alert',
  REAL_TIME_UPDATE: 'real_time_update',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FACE_NOT_DETECTED: 'No face detected. Please try again.',
  LOW_CONFIDENCE: 'Low confidence. Please try again.',
  LIVENESS_FAILED: 'Liveness check failed. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  ATTENDANCE_MARKED: 'Attendance marked successfully!',
  STUDENT_REGISTERED: 'Student registered successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FACE_ENROLLED: 'Face enrolled successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;