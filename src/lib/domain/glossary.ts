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
      "A market on whether an NBA or NFL player's recorded performance statistic finishes over or under a stated line.",
    avoid: ["Pick", "Lock", "Sure bet"],
    complianceNotes: "Neutral market term; never frame as a betting recommendation.",
  },
  {
    term: "Expected value (EV)",
    definition:
      "The arithmetic return per unit of stake if a stated win probability were exact: p × b − (1 − p), where b is the net profit per dollar on a win at the selected price. Describes the price and the assumed probability, not the future.",
    avoid: ["Guaranteed profit", "Expected edge", "ROI"],
    complianceNotes: "Computed from user-supplied inputs; an illustration, not a forecast.",
  },
  {
    term: "Kelly criterion",
    definition:
      "The stake fraction f* = (p × b − (1 − p)) / b that maximizes long-run bankroll growth if the win probability p is exactly right. Because real probabilities are estimates, the tool applies a user-selected fraction (default quarter Kelly) and a hard maximum-stake cap.",
    avoid: ["Optimal bet size", "Safe bet size"],
    complianceNotes: "Framed as a sizing formula on user inputs; never presented as an instruction to wager.",
  },
  {
    term: "Stake sizing (illustrative)",
    definition:
      "The application of the Kelly criterion at a user-selected fraction, capped at a user-selected maximum share of bankroll, to an EV computed from the analysis price and a win probability (historical hit rate by default, or the user's own estimate). It is an arithmetic illustration, not a recommendation.",
    avoid: ["Bet size recommendation", "Play", "Pick"],
    complianceNotes: "Requires the 21+ confirmation; output is always labeled illustrative and never a forecast.",
  },
  {
    term: "Bankroll",
    definition:
      "The total amount of money a user allocates to this activity, entered and stored only in the user's own browser. It is never transmitted to the server and never persisted in any analysis snapshot.",
    avoid: ["Balance", "Wagering account"],
    complianceNotes: "Client-side only (ADR 0005); the server stores no financial data.",
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
