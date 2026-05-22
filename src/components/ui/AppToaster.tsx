import { Toaster } from 'react-hot-toast';

/**
 * Global toast host — glass styling aligned with HelpDesk tokens.
 * Mount once inside AppProviders.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ top: 20 }}
      toastOptions={{
        duration: 4200,
        className: 'hd-toast',
        style: {
          background: 'var(--surface-glass-strong)',
          color: 'var(--text-1)',
          border: '1px solid var(--border-soft)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
          boxShadow: 'var(--shadow-glow), 0 8px 32px rgba(0,0,0,0.35)',
          fontSize: '13px',
          fontWeight: 500,
          maxWidth: '360px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: 'var(--brand-400)',
            secondary: 'var(--bg-2)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--accent-rose)',
            secondary: 'var(--bg-2)',
          },
        },
      }}
    />
  );
}
