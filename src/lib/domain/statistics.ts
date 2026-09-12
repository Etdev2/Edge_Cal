/**
 * Pure domain logic for historical hit rates, push handling, and Wilson score intervals
 * Adheres to Issue #4 and CONTEXT.md
 */

export interface HitRateResult {
  totalGames: number;
  eligibleGames: number; // settled, non-push games
  wins: number;
  losses: number;
  pushes: number;
  hitRate: number; // wins / eligibleGames (0 to 1)
  rawHitRateIncludingPushes: number; // wins / totalGames
  uncertaintyInterval: {
    lower: number; // 0 to 1
    upper: number; // 0 to 1
    confidence: number; // 0.95
  };
  historicalStatus: "above" | "inconclusive" | "below";
  statusReason: string;
}

/**
 * Wilson Score Interval for Binomial Proportions with continuity correction support
 * Provides robust 95% confidence intervals even for small sample sizes (e.g. n=5, 10, 20).
 *
 * z = 1.96 for 95% confidence
 * p_hat = wins / n
 * center = (p_hat + z^2 / (2n)) / (1 + z^2 / n)
 * margin = (z / (1 + z^2 / n)) * sqrt((p_hat * (1 - p_hat) / n) + (z^2 / (4n^2)))
 */
export function calculateWilsonScoreInterval(
  wins: number,
  n: number,
  confidenceLevel: number = 0.95
): { lower: number; upper: number; confidence: number } {
  if (n <= 0) {
    return { lower: 0, upper: 1, confidence: confidenceLevel };
  }

  // standard normal critical value z
  let z = 1.95996; // 95%
  if (confidenceLevel === 0.90) z = 1.64485;
  if (confidenceLevel === 0.99) z = 2.57583;

  const pHat = wins / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (pHat + z2 / (2 * n)) / denom;
  const sqrtTerm = Math.sqrt(
    (pHat * (1 - pHat)) / n + z2 / (4 * (n * n))
  );
  const margin = (z * sqrtTerm) / denom;

  const lower = Math.max(0, center - margin);
  const upper = Math.min(1, center + margin);

  return {
    lower: Math.round(lower * 1000) / 1000,
    upper: Math.round(upper * 1000) / 1000,
    confidence: confidenceLevel,
  };
}

/**
 * Computes the historical hit rate and settles each game against the line.
 * Per CONTEXT.md:
 * "The share of settled, non-push games in an evidence window that would have won at the selected line and side."
 * Push: "A settled outcome in which the recorded statistic equals an integer line and the stake is returned."
 */
export function calculateHistoricalHitRate(
  statValues: number[],
  line: number,
  side: "over" | "under",
  breakEvenProbability: number
): HitRateResult {
  let wins = 0;
  let losses = 0;
  let pushes = 0;

  for (const stat of statValues) {
    if (side === "over") {
      if (stat > line) wins++;
      else if (stat === line) pushes++;
      else losses++;
    } else {
      // under
      if (stat < line) wins++;
      else if (stat === line) pushes++;
      else losses++;
    }
  }

  const eligibleGames = wins + losses;
  const totalGames = statValues.length;
  const hitRate = eligibleGames > 0 ? wins / eligibleGames : 0;
  const rawHitRateIncludingPushes = totalGames > 0 ? wins / totalGames : 0;

  const uncertaintyInterval = calculateWilsonScoreInterval(wins, eligibleGames, 0.95);

  // Determine neutral Historical Status
  // "A neutral summary of whether the historical evidence is above, inconclusive against,
  // or below the break-even probability. It is not a wager recommendation."
  let historicalStatus: "above" | "inconclusive" | "below" = "inconclusive";
  let statusReason = "";

  if (eligibleGames < 3) {
    historicalStatus = "inconclusive";
    statusReason = "Sample size is too small (fewer than 3 non-push games) for conclusive evidence.";
  } else if (uncertaintyInterval.lower > breakEvenProbability) {
    historicalStatus = "above";
    statusReason = `Historical 95% uncertainty floor (${(uncertaintyInterval.lower * 100).toFixed(1)}%) is strictly above break-even (${(breakEvenProbability * 100).toFixed(1)}%).`;
  } else if (uncertaintyInterval.upper < breakEvenProbability) {
    historicalStatus = "below";
    statusReason = `Historical 95% uncertainty ceiling (${(uncertaintyInterval.upper * 100).toFixed(1)}%) is strictly below break-even (${(breakEvenProbability * 100).toFixed(1)}%).`;
  } else {
    historicalStatus = "inconclusive";
    statusReason = `Break-even probability (${(breakEvenProbability * 100).toFixed(1)}%) falls within the 95% historical uncertainty range [${(uncertaintyInterval.lower * 100).toFixed(1)}% - ${(uncertaintyInterval.upper * 100).toFixed(1)}%].`;
  }

  return {
    totalGames,
    eligibleGames,
    wins,
    losses,
    pushes,
    hitRate,
    rawHitRateIncludingPushes,
    uncertaintyInterval,
    historicalStatus,
    statusReason,
  };
}
