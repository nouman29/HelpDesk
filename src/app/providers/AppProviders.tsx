import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/ThemeContext';
import { AppToaster } from '@/components/ui/AppToaster';

/** Top-level provider tree. Add additional providers (auth/store/etc) here. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
        <AppToaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}
