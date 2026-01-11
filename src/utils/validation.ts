/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERROR_MESSAGES } from './constants';

/**
 * Validation rules and error messages
 */
export const validationRules = {
  required: (value: string) => !!value?.trim() || 'This field is required',
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },
  minLength: (length: number) => (value: string) =>
    value.length >= length || `Minimum ${length} characters required`,
  maxLength: (length: number) => (value: string) =>
    value.length <= length || `Maximum ${length} characters allowed`,
  password: (value: string) => {
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/\d/.test(value)) return 'Password must contain at least one number';
    if (!/[a-zA-Z]/.test(value)) return 'Password must contain at least one letter';
    return true;
  },
  match: (compareValue: string, fieldName: string = 'Password') => (value: string) =>
    value === compareValue || `${fieldName} does not match`,
  studentId: (value: string) => {
    const studentIdRegex = /^[A-Za-z0-9-]+$/;
    return studentIdRegex.test(value) || 'Invalid student ID format';
  },
  phone: (value: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[^\d+]/g, '')) || 'Invalid phone number';
  },
  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },
  number: (value: string) => {
    return !isNaN(Number(value)) || 'Please enter a valid number';
  },
  positiveNumber: (value: string) => {
    const num = Number(value);
    return (!isNaN(num) && num > 0) || 'Please enter a positive number';
  },
  date: (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) || 'Please enter a valid date';
  },
  futureDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today || 'Date must be today or in the future';
  },
  pastDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today || 'Date must be today or in the past';
  },
  fileType: (allowedTypes: string[]) => (file: File) => {
    return allowedTypes.includes(file.type) || `File type must be: ${allowedTypes.join(', ')}`;
  },
  fileSize: (maxSize: number) => (file: File) => {
    return file.size <= maxSize || `File size must be less than ${maxSize / 1024 / 1024}MB`;
  },
};

/**
 * Validate form fields
 */
export const validateForm = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: Record<string, Array<(value: any) => string | boolean>>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(validationSchema).forEach((field) => {
    const value = formData[field];
    const validators = validationSchema[field];

    for (const validator of validators) {
      const result = validator(value);
      if (typeof result === 'string') {
        errors[field] = result;
        break;
      }
    }
  });

  return errors;
};

/**
 * Validate image file
 */
export const validateImageFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): string | null => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'] } = options;

  if (!file) {
    return 'No file selected';
  }

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
  }

  if (file.size > maxSize) {
    return `File is too large. Maximum size: ${maxSize / 1024 / 1024}MB`;
  }

  return null;
};

/**
 * Validate face detection result
 */
export const validateFaceDetection = (
  result: any,
  confidenceThreshold: number = 0.8
): { isValid: boolean; error?: string } => {
  if (!result?.face_detected) {
    return { isValid: false, error: ERROR_MESSAGES.FACE_NOT_DETECTED };
  }

  if (result.confidence < confidenceThreshold) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.LOW_CONFIDENCE} (${Math.round(result.confidence * 100)}%)`,
    };
  }

  return { isValid: true };
};

/**
 * Validate liveness check result
 */
export const validateLivenessCheck = (
  result: any,
  threshold: number = 0.7
): { isValid: boolean; error?: string } => {
  if (!result?.is_live || result.overall_score < threshold) {
    return { isValid: false, error: ERROR_MESSAGES.LIVENESS_FAILED };
  }

  return { isValid: true };
};

/**
 * Get validation error message for API error
 */
export const getApiErrorMessage = (error: any): string => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || data.detail || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        // Handle validation errors from server
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            return data.detail.map((d: any) => d.msg || d.message).join(', ');
          }
          return data.detail;
        }
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return data.message || data.detail || ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.request) {
    // Request made but no response
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Something else happened
    return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }
};

/**
 * Validate registration form
 */
export const validateRegistration = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!data.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validationRules.email(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.role === 'student' && !data.student_id?.trim()) {
    errors.student_id = 'Student ID is required';
  }

  return errors;
};