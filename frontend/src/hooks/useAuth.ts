import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logoutUser } from '../features/auth/authSlice';

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(!auth.user);
  
  const logout = () => {
    dispatch(logoutUser());
  };

  // Update loading state when user data is available
  useEffect(() => {
    if (auth.user) {
      setIsLoading(false);
    }
  }, [auth.user]);

  return {
    ...auth,
    user: auth.user,
    isAdmin: auth.user?.role === 'admin',
    isLoading,
    logout
  };
}