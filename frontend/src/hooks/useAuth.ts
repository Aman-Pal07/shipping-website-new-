import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logoutUser } from '../features/auth/authSlice';

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    ...auth,
    user: auth.user,
    isAdmin: auth.user?.role === 'admin',
    logout
  };
}