import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  /** Either an in-page anchor (#problem) or a route (/chat). */
  href: string;
  external?: boolean;
}

/** Items shown in the top navigation bar. */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Product',  href: '#product' },
  { label: 'Journeys', href: '#journeys' },
  { label: 'Problem',  href: '#problem' },
  { label: 'Chat',     href: ROUTES.CHAT },
  { label: 'Recent',   href: ROUTES.RECENT_CHATS },
];

/** Returns true when an href points to an in-app route rather than an anchor. */
export const isRouteHref = (href: string) =>
  href.startsWith('/') && !href.startsWith('//');

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      { label: 'Decision Journeys', href: ROUTES.CHAT },
      { label: 'AI Chat',           href: ROUTES.CHAT },
      { label: 'Recent',            href: ROUTES.RECENT_CHATS },
      { label: 'Pricing',           href: '#pricing' },
    ],
  },
  {
    title: 'Use cases',
    items: [
      { label: 'Career Planning',   href: ROUTES.CHAT },
      { label: 'Medical Guidance',  href: ROUTES.CHAT },
      { label: 'Legal Support',     href: ROUTES.CHAT },
      { label: 'Life Decisions',    href: ROUTES.CHAT },
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
