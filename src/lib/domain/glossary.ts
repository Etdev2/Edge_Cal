/**
 * Canonical Glossary & Compliance Language Rules
 * Sourced directly from CONTEXT.md and ADRs
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  avoid: string[];
  complianceNotes: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Player prop",
    definition:
      "A market on whether an NBA player's recorded performance statistic finishes over or under a stated line.",
    avoid: ["Pick", "Lock", "Sure bet"],
    complianceNotes: "Neutral market term; never frame as a betting recommendation.",
  },
  {
    term: "Analysis",
    definition:
      "One comparison of a player prop's price with evidence from a defined set of eligible games.",
    avoid: ["Bet", "Recommendation", "Prediction"],
    complianceNotes: "Defines the core non-wagering analytical comparison.",
  },
  {
    term: "Line",
    definition:
      "The performance threshold used to settle a player prop as a win, loss, or push.",
    avoid: ["Projection", "Target"],
    complianceNotes: "Settlement barrier only.",
  },
  {
    term: "Sportsbook price",
    definition:
      "The offered odds whose payout determines the probability required to break even.",
    avoid: ["True probability", "Projection"],
    complianceNotes: "Describes market quote, not intrinsic ground truth.",
  },
  {
    term: "Break-even probability",
    definition:
      "The win probability at which the sportsbook price has zero expected profit before considering pushes.",
    avoid: ["Fair probability", "Predicted probability"],
    complianceNotes: "Formulaic odds reciprocal.",
  },
  {
    term: "No-vig probability",
    definition:
      "The market probability obtained by normalizing the prices on both sides to remove the sportsbook margin.",
    avoid: ["Break-even probability", "Predicted probability"],
    complianceNotes: "Pure normalized margin-free market quote.",
  },
  {
    term: "Evidence window",
    definition:
      "The explicitly selected historical sample, such as season, last 20, last 10, last 5, versus opponent, or home/away.",
    avoid: ["Prediction period", "Forecast window"],
    complianceNotes: "Explicit retrospective historical dataset boundary.",
  },
  {
    term: "Eligible game",
    definition:
      "An official completed game in the selected evidence window and season type in which the player appeared. DNPs are excluded, overtime is included, and unusually low minutes remain visible.",
    avoid: ["Scheduled game", "DNP"],
    complianceNotes: "Strict retrospective qualification standard.",
  },
  {
    term: "Historical hit rate",
    definition:
      "The share of settled, non-push games in an evidence window that would have won at the selected line and side. It describes the sample and is not a forecast.",
    avoid: ["Predicted probability", "True probability", "Expected win rate"],
    complianceNotes: "Descriptive sample statistic only; not predictive.",
  },
  {
    term: "Push",
    definition:
      "A settled outcome in which the recorded statistic equals an integer line and the stake is returned.",
    avoid: ["Tie", "Loss"],
    complianceNotes: "Excluded from hit rate denominator or partitioned.",
  },
  {
    term: "Historical hit-rate gap",
    definition:
      "The historical hit rate minus the sportsbook price's break-even probability, expressed in percentage points. It is descriptive evidence, not a guaranteed edge.",
    avoid: ["Guaranteed edge", "Model edge", "Profit margin"],
    complianceNotes: "Descriptive comparison; does not promise future yield.",
  },
  {
    term: "Historical status",
    definition:
      "A neutral summary of whether the historical evidence is above, inconclusive against, or below the break-even probability. It is not a wager recommendation.",
    avoid: ["Pick", "Lock", "Bet signal"],
    complianceNotes: "Must remain strictly neutral (Above / Inconclusive / Below).",
  },
  {
    term: "Hypothetical return",
    definition:
      "The calculated return at the sportsbook price if the selected historical hit rate were the future win probability. It is an illustration, not a forecast.",
    avoid: ["Expected profit", "Guaranteed return", "ROI estimate"],
    complianceNotes: "Mathematical scenario illustration only.",
  },
  {
    term: "Uncertainty range",
    definition:
      "An interval showing the sampling uncertainty around a historical hit rate. It does not measure every source of future uncertainty.",
    avoid: ["Prediction range", "Guaranteed range"],
    complianceNotes: "Wilson Score 95% interval for sample variability.",
  },
  {
    term: "Analysis snapshot",
    definition:
      "A preserved record of an analysis's inputs, evidence, result, source, and time. A later recalculation is a new analysis rather than a revision of the snapshot.",
    avoid: ["Live analysis", "Active bet"],
    complianceNotes: "Immutable reference; never stores user bets or bets-slips.",
  },
];

export const PROHIBITED_WORDS = [
  "pick",
  "lock",
  "bet signal",
  "sure bet",
  "guaranteed win",
  "guaranteed profit",
  "bet now",
  "place bet",
  "cash out",
  "easy money",
  "best bets",
  "locks of the day",
];

export function scanTextForCompliance(text: string): {
  isCompliant: boolean;
  flaggedWords: string[];
} {
  const lower = text.toLowerCase();
  const flagged = PROHIBITED_WORDS.filter((word) =>
    lower.includes(word.toLowerCase())
  );
  return {
    isCompliant: flagged.length === 0,
    flaggedWords: flagged,
  };
}
