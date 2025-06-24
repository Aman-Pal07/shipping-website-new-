import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    // Redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Check if user exists and email is verified
  if (isAuthenticated && user && !user.isVerified) {
    // Redirect to email verification with email in state
    return <Navigate to="/verify-email" state={{ email: user.email }} replace />;
  }

  return <>{children}</>;
}