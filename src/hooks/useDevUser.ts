import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';

export const useDevUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Only in development
    if (process.env.NODE_ENV !== 'development') return;
    
    // Check if user already exists
    const existingUser = localStorage.getItem('user');
    if (existingUser) return;
    
    // Create development user
    const devUser = {
      id: 1,
      email: 'admin@example.com',
      first_name: 'Development',
      last_name: 'User',
      role: 'admin' as 'student', // Can change to 'student' for testing
      student_id: 'DEV001',
      is_active: true,
      date_joined: new Date().toISOString(),
    };
    
    // Store in localStorage
    localStorage.setItem('access_token', 'dev-token');
    localStorage.setItem('refresh_token', 'dev-refresh-token');
    localStorage.setItem('user', JSON.stringify(devUser));
    
    // Update Redux store
    dispatch(setUser(devUser));
    
    console.log('Development user initialized');
  }, [dispatch]);
};