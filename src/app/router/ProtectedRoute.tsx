import { type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/features/auth/authStorage';
import { ROUTES } from '@/constants/routes';

interface Props {
  children: ReactElement;
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LANDING} replace state={{ from: location.pathname }} />;
  }
  return children;
}
