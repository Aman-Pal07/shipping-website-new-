import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * Custom hook to check if the current user has a specific role
 * @returns Object with role checking functions
 */
export const useRole = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isUser = (): boolean => {
    return user?.role === 'user';
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return {
    isAdmin,
    isUser,
    hasRole,
    role: user?.role,
  };
};
