import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { login, logout, register } from '@/store/slices/authSlice';
import { LoginCredentials, RegisterData } from '@/api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      try {
        const result = await dispatch(register(data)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    hasRole,
    hasPermission,
  };
};