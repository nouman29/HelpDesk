import '@/App.css';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/router/AppRouter';
import { useLenis } from '@/hooks/useLenis';

function Shell() {
  useLenis();
  return (
    <div className="app-shell">
      <div className="noise" aria-hidden />
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
