import type { ReactNode } from 'react';

/** Minimal layout for cinematic full-screen pages (auth, chat). */
export function BareLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
