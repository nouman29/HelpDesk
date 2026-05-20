import type { ChatThread, ChatMessage } from '@/types';

const HOUR = 3_600_000;
const DAY  = 24 * HOUR;

export const DUMMY_THREADS: ChatThread[] = [
  {
    id: 't-001',
    title: 'Switching from data engineering to AI research',
    domain: 'career',
    preview: 'Mapped out 3 viable transition paths with timeline & risk profile…',
    updatedAt: Date.now() - 0.5 * HOUR,
  },
  {
    id: 't-002',
    title: 'Should I take the founding engineer offer?',
    domain: 'career',
    preview: 'Compared comp, equity, learning surface area, and exit risk…',
    updatedAt: Date.now() - 3 * HOUR,
  },
  {
    id: 't-003',
    title: 'Persistent migraine — next steps before specialist',
    domain: 'medical',
    preview: 'Decision tree: triggers, OTC ladder, when to escalate to neurology…',
    updatedAt: Date.now() - 8 * HOUR,
  },
  {
    id: 't-004',
    title: 'Reviewing a SaaS contract — risk surface',
    domain: 'legal',
    preview: 'Surfaced 5 high-risk clauses and proposed redline language…',
    updatedAt: Date.now() - 1.5 * DAY,
  },
  {
    id: 't-005',
    title: 'Moving cities for partner — frameworks',
    domain: 'life',
    preview: 'Walked through identity / network / career impact lattice…',
    updatedAt: Date.now() - 2 * DAY,
  },
  {
    id: 't-006',
    title: 'Pricing strategy for AI dev tool',
    domain: 'business',
    preview: 'Compared usage-based vs. seat-based vs. hybrid w/ break-even…',
    updatedAt: Date.now() - 3 * DAY,
  },
  {
    id: 't-007',
    title: 'College major when I love both CS and Bio',
    domain: 'career',
    preview: 'Found 4 hybrid programs + 2 self-directed paths via electives…',
    updatedAt: Date.now() - 6 * DAY,
  },
  {
    id: 't-008',
    title: 'Caregiver decisions for aging parent',
    domain: 'medical',
    preview: 'Built escalation map: in-home vs. assisted vs. specialized…',
    updatedAt: Date.now() - 14 * DAY,
  },
  {
    id: 't-009',
    title: 'Tenant rights — broken HVAC for 3 weeks',
    domain: 'legal',
    preview: 'Charted notice → remedy → withholding rent w/ jurisdictional law…',
    updatedAt: Date.now() - 22 * DAY,
  },
  {
    id: 't-010',
    title: 'Quitting alcohol — structured ramp',
    domain: 'life',
    preview: 'Personalized step-down plan with checkpoints and fail-safes…',
    updatedAt: Date.now() - 40 * DAY,
  },
];

export const DUMMY_CHAT: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'system',
    content: "Decision Journey: Career transition into AI research",
    createdAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 'm-2',
    role: 'ai',
    content:
      "Welcome. I'll guide you through this decision step by step — no prompt engineering needed. To start, what's pulling you toward AI research right now: the intellectual surface, the compensation trend, or the long-term optionality?",
    createdAt: Date.now() - 1000 * 60 * 21,
  },
  {
    id: 'm-3',
    role: 'user',
    content:
      "Honestly, all three — but mostly the surface. I want to be working on problems where the ceiling is far higher than my current pipeline work.",
    createdAt: Date.now() - 1000 * 60 * 20,
  },
  {
    id: 'm-4',
    role: 'ai',
    content:
      "Got it. I'll branch the journey into three viable paths: (1) industry research engineer, (2) applied-research at a frontier lab, (3) PhD pivot. I'll score each against your runway, learning curve, and re-entry risk. Tell me your current runway — financial and emotional — for an unpaid or low-paid 12-month window?",
    createdAt: Date.now() - 1000 * 60 * 19,
  },
  {
    id: 'm-5',
    role: 'user',
    content: "Financial: comfortable for ~9 months. Emotional: probably 6 months before I start doubting.",
    createdAt: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'm-6',
    role: 'ai',
    content:
      "That eliminates the PhD path cleanly — at least as a first move. We'll keep options (1) and (2) live and start narrowing skill gaps against each one's hiring bar. Ready to expand the decision tree?",
    createdAt: Date.now() - 1000 * 60 * 17,
  },
];

export const PROMPT_SUGGESTIONS = [
  'Help me decide between two job offers',
  'Build a treatment escalation plan for chronic pain',
  'Review my SaaS subscription agreement',
  'Decide whether to move cities for my partner',
  'Choose pricing model for an AI dev tool',
  'Plan a 12-month career pivot into AI research',
];
