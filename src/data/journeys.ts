import type { DecisionStep } from "@/types";

export const DECISION_JOURNEY: DecisionStep[] = [
  {
    id: "s1",
    title: "Frame",
    description:
      "AI clarifies what decision you're actually making — separating noise from signal.",
    type: "question",
  },
  {
    id: "s2",
    title: "Branch",
    description:
      "It builds the decision tree from your constraints, not generic advice.",
    type: "branch",
  },
  {
    id: "s3",
    title: "Stress-test",
    description:
      "Each branch is tested against your runway, risk tolerance, and time horizon.",
    type: "branch",
  },
  {
    id: "s4",
    title: "Narrow",
    description: "Options are eliminated transparently, never silently.",
    type: "question",
  },
  {
    id: "s5",
    title: "Commit",
    description: "You leave with one clear decision and a contingency plan.",
    type: "outcome",
  },
];
