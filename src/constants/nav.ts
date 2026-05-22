import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  /** Either an in-page anchor (#problem) or a route (/chat). */
  href: string;
  external?: boolean;
}

/**
 * Items shown in the top navigation bar.
 *
 * The three anchor entries map directly to the three landing sections
 * rendered below the hero (see `pages/landing/LandingPage.tsx`).
 * The IDs describe what each section actually shows — NOT the filename:
 *
 *   #the-problem   → JourneySection
 *     "The Problem With AI Today" — chaotic chat vs. structured
 *     HelpDesk, plus the four pain-point cards.
 *
 *   #decision-flow → AIFlowPreview
 *     The clickable, animated decision-flow tree the user can
 *     interact with to start a journey.
 *
 *   #why-helpdesk  → MarketGapSection
 *     Feature-by-feature comparison of HelpDesk against ChatGPT /
 *     Perplexity / Claude.
 *
 * Anchor clicks are intercepted by Navbar and routed through
 * `lenisScrollTo()` so smooth-scroll stays in sync. If the user is on a
 * non-landing route, Navbar first navigates to "/" then scrolls after
 * 350 ms so the section has time to mount.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Problem',   href: '#the-problem' },
  { label: 'Decision', href: '#decision-flow' },
  { label: 'Why HelpDesk',  href: '#why-helpdesk' },
  { label: 'Chat',          href: ROUTES.CHAT },
  { label: 'Recent',        href: ROUTES.RECENT_CHATS },
];

/** Returns true when an href points to an in-app route rather than an anchor. */
export const isRouteHref = (href: string) =>
  href.startsWith('/') && !href.startsWith('//');

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Product',
    items: [
      { label: 'Decision Journeys', href: '#decision-journey' },
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
