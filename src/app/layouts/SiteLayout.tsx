import type { ReactNode } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollProgressBar } from '@/components/common/ScrollProgressBar';

interface Props { children: ReactNode; transparentNav?: boolean; }

export function SiteLayout({ children, transparentNav = true }: Props) {
  return (
    <>
      <ScrollProgressBar />
      <Navbar transparent={transparentNav} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
