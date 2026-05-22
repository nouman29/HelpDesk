import { type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/features/auth/authStorage';
import { ROUTES } from '@/constants/routes';

interface Props {
  children: ReactElement;
}

/**
 * Gate a route behind the presence of a token in localStorage.
 * Redirects to the landing page (preserving the original target via
 * state.from) when the user has no token, even if they typed the URL
 * directly into the address bar.
 */
export function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LANDING} replace state={{ from: location.pathname }} />;
  }
  return children;
}
