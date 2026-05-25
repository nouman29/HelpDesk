import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Problem',   href: '#the-problem' },
  { label: 'Decision', href: '#decision-flow' },
  { label: 'Why HelpDesk',  href: '#why-helpdesk' },
  { label: 'Chat',          href: ROUTES.CHAT },
  { label: 'Recent',        href: ROUTES.RECENT_CHATS },
];

export const isRouteHref = (href: string) =>
  href.startsWith('/') && !href.startsWith('//');

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      { label: 'Decision Journeys', href: '#decision-flow' },
      { label: 'AI Chat',           href: ROUTES.CHAT },
      { label: 'Recent',            href: ROUTES.RECENT_CHATS },
      { label: 'Pricing',           href: '#pricing' },
    ],
  },
  {
    title: 'Use cases',
    items: [
      { label: 'Medical Guidance',  href: ROUTES.CHAT },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About',   href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
      { label: 'Blog',    href: '#blog' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms',   href: '#terms' },
      { label: 'Security', href: '#security' },
    ],
  },
];
