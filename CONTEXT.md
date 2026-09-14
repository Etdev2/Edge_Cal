# Edge Calculator

Edge Calculator is a decision-support product for comparing NBA and NFL player-prop prices with historical evidence, sizing illustrative stakes from a user's own bankroll and win-probability inputs, and, in a future validated model, predictive estimates.

## Language

**Player prop**:
A market on whether an NBA player's recorded performance statistic finishes over or under a stated line.
_Avoid_: Pick, lock

**Analysis**:
One comparison of a player prop's price with evidence from a defined set of eligible games.
_Avoid_: Bet, recommendation

**Line**:
The performance threshold used to settle a player prop as a win, loss, or push.
_Avoid_: Projection

**Sportsbook price**:
The offered odds whose payout determines the probability required to break even.
_Avoid_: True probability, projection

**Break-even probability**:
The win probability at which the sportsbook price has zero expected profit before considering pushes.
_Avoid_: Fair probability, predicted probability

**No-vig probability**:
The market probability obtained by normalizing the prices on both sides to remove the sportsbook margin.
_Avoid_: Break-even probability, predicted probability

**Evidence window**:
The explicitly selected historical sample, such as season, last 20, last 10, last 5, versus opponent, or home/away.
_Avoid_: Prediction period

**Eligible game**:
An official completed game in the selected evidence window and season type in which the player appeared. DNPs are excluded, overtime is included, and unusually low minutes remain visible.
_Avoid_: Scheduled game, DNP

**Historical hit rate**:
The share of settled, non-push games in an evidence window that would have won at the selected line and side. It describes the sample and is not a forecast.
_Avoid_: Predicted probability, true probability

**Push**:
A settled outcome in which the recorded statistic equals an integer line and the stake is returned.
_Avoid_: Tie, loss

**Historical hit-rate gap**:
The historical hit rate minus the sportsbook price's break-even probability, expressed in percentage points. It is descriptive evidence, not a guaranteed edge.
_Avoid_: Guaranteed edge, model edge, profit margin

**Historical status**:
A neutral summary of whether the historical evidence is above, inconclusive against, or below the break-even probability. It is not a wager recommendation.
_Avoid_: Pick, lock, bet signal

**Hypothetical return**:
The calculated return at the sportsbook price if the selected historical hit rate were the future win probability. It is an illustration, not a forecast.
_Avoid_: Expected profit, guaranteed return

**Uncertainty range**:
An interval showing the sampling uncertainty around a historical hit rate. It does not measure every source of future uncertainty.
_Avoid_: Prediction range, guaranteed range

**Analysis snapshot**:
A preserved record of an analysis's inputs, evidence, result, source, and time. A later recalculation is a new analysis rather than a revision of the snapshot.
_Avoid_: Live analysis

**Expected value (EV)**:
The arithmetic return per unit of stake if a stated win probability were exact: p × b − (1 − p), where b is the net profit per dollar on a win at the selected price. It describes the price and the assumed probability, not the future.
_Avoid_: Guaranteed profit, Expected edge

**Kelly criterion**:
The stake fraction f* = (p × b − (1 − p)) / b that maximizes long-run bankroll growth if the win probability p is exactly right. Because real probabilities are estimates, the tool applies a user-selected fraction (default quarter Kelly) and a hard maximum-stake cap.
_Avoid_: Optimal bet size, Safe bet size

**Stake sizing (illustrative)**:
The application of the Kelly criterion at a user-selected fraction, capped at a user-selected maximum share of bankroll, to an EV computed from the analysis price and a win probability (historical hit rate by default, or the user's own estimate). It is an arithmetic illustration, not a recommendation.
_Avoid_: Bet size recommendation, Play, Pick

**Bankroll**:
The total amount of money a user allocates to this activity, entered and stored only in the user's own browser. It is never transmitted to the server and never persisted in any analysis snapshot.
_Avoid_: Balance, Wagering account

**Estimated probability**:
A future validated predictive model's forecast of the probability that a player prop will win.
_Avoid_: Historical hit rate

**Model edge**:
The estimated probability minus the sportsbook price's break-even probability, expressed in percentage points.
_Avoid_: Historical hit-rate gap

**Predictive model**:
A system that estimates a player prop's future win probability from information available before the game. It remains experimental until it passes the validation gate.
_Avoid_: Historical calculator

**Validation gate**:
The evidence standard a predictive model must pass before its estimated probability and model edge can be shown to users, including chronological backtesting, calibration, and an untouched holdout period.
_Avoid_: Training accuracy, historical hit rate
