import type { DecisionStep, FeatureCard } from '@/types';

export const DECISION_JOURNEY: DecisionStep[] = [
  { id: 's1', title: 'Frame',     description: 'AI clarifies what decision you\'re actually making — separating noise from signal.', type: 'question' },
  { id: 's2', title: 'Branch',    description: 'It builds the decision tree from your constraints, not generic advice.',             type: 'branch' },
  { id: 's3', title: 'Stress-test', description: 'Each branch is tested against your runway, risk tolerance, and time horizon.',    type: 'branch' },
  { id: 's4', title: 'Narrow',    description: 'Options are eliminated transparently, never silently.',                              type: 'question' },
  { id: 's5', title: 'Commit',    description: 'You leave with one clear decision and a contingency plan.',                          type: 'outcome' },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'f1',
    title: 'Structured journeys',
    description: 'Visual flow, not endless chat. Every step has purpose and direction.',
    icon: 'GitBranch',
    accent: 'from-sky-500/40 to-blue-700/0',
  },
  {
    id: 'f2',
    title: 'No prompt engineering',
    description: 'You speak naturally. The system handles the structure.',
    icon: 'Sparkles',
    accent: 'from-violet-500/40 to-fuchsia-700/0',
  },
  {
    id: 'f3',
    title: 'Outcome-focused',
    description: 'Optimized to produce a decision, not just information.',
    icon: 'Target',
    accent: 'from-cyan-400/40 to-sky-700/0',
  },
  {
    id: 'f4',
    title: 'High-stakes ready',
    description: 'Calibrated guardrails for medical, legal, and career decisions.',
    icon: 'Shield',
    accent: 'from-emerald-400/40 to-teal-700/0',
  },
  {
    id: 'f5',
    title: 'Memory that matters',
    description: 'Recalls your constraints across journeys — without surveillance.',
    icon: 'Brain',
    accent: 'from-rose-400/40 to-pink-700/0',
  },
  {
    id: 'f6',
    title: 'Cinematic interface',
    description: 'A workspace designed for clarity in the moments that count.',
    icon: 'Layers',
    accent: 'from-indigo-400/40 to-blue-700/0',
  },
];

export const PROBLEM_POINTS = [
  { title: 'Information overload',     description: 'Modern AI gives you everything and decides nothing.' },
  { title: 'Endless conversations',    description: 'Threads loop without ever converging on a choice.' },
  { title: 'Prompt-engineering barrier', description: 'Users without prompting skill get watered-down output.' },
  { title: 'No structured logic',      description: 'Branches and trade-offs live in your head, not on screen.' },
  { title: 'Lost context',             description: 'You repeat yourself between turns and across sessions.' },
];

export const DOMAINS = [
  { name: 'Career',  blurb: 'Pivots, offers, negotiation' },
  { name: 'Medical', blurb: 'Escalation, next-steps, second opinions' },
  { name: 'Legal',   blurb: 'Contracts, tenant rights, disputes' },
  { name: 'Life',    blurb: 'Relocation, relationships, ramps' },
  { name: 'Business', blurb: 'Pricing, hiring, strategy' },
];
