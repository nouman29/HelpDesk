import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { RouteFallback } from '@/components/common/RouteFallback';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';

const LandingPage     = lazy(() => import('@/pages/landing/LandingPage'));
const LoginPage       = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage      = lazy(() => import('@/pages/auth/SignupPage'));
const ChatPage        = lazy(() => import('@/pages/chat/ChatPage'));
const RecentChatsPage = lazy(() => import('@/pages/chat/RecentChatsPage'));
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'));

export function AppRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.LANDING}     element={<LandingPage />} />
          <Route path={ROUTES.LOGIN}       element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP}      element={<SignupPage />} />
          <Route
            path={ROUTES.CHAT}
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RECENT_CHATS}
            element={
              <ProtectedRoute>
                <RecentChatsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*"                   element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
