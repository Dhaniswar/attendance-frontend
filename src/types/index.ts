export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'admin' | 'teacher';
  student_id?: string;
  is_active: boolean;
  date_joined: string;
}

export interface Attendance {
  id: number;
  student: User;
  date: string;
  time_in: string;
  time_out?: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  location?: string;
  verified_by_face: boolean;
  confidence_score: number;
}

export interface LivenessCheck {
  eye_blink_detected: boolean;
  head_movement_detected: boolean;
  texture_analysis_passed: boolean;
  overall_score: number;
  is_live: boolean;
}

export interface FaceDetectionResult {
  face_detected: boolean;
  face_embedding?: number[];
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: number[][];
  confidence: number;
}

export interface Notification {
  id: number;
  type: 'attendance' | 'system' | 'alert' | 'info';
  title: string;
  message: string;
  is_read: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  created_at: string;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}