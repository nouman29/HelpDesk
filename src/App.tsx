import '@/App.css';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/router/AppRouter';
import { CursorGlow } from '@/components/animations/CursorGlow';
import { useLenis } from '@/hooks/useLenis';

function Shell() {
  useLenis();
  return (
    <div className="app-shell">
      <div className="noise" aria-hidden />
      <CursorGlow />
      <AppRouter />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Shell />
    </AppProviders>
  );
}
