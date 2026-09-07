# Analysis-only compliance boundary

Status: research resolution for [Wayfinder ticket #3](https://github.com/Etdev2/Edge_Cal/issues/3)  
Scope: federal United States law, California law, web/PWA distribution, later Apple and Google native distribution, advertising claims, privacy, age gating, and responsible-gambling disclosures  
Reviewed: 2026-09-07

> This report is product-risk research, not legal advice. It identifies a defensible product boundary and legal-review gates; qualified counsel must confirm the conclusion before public launch or monetization.

## Executive decision

**Proceed conditionally with a free, invitation-only, analysis-only PWA beta after a targeted California counsel review. Do not launch a native app, paid plan, sportsbook integration, affiliate relationship, wager tracker, contest, or predictive-pick product under this decision.**

On the stated facts, the beta is more likely to be treated as an information/analytics product than as a sportsbook or gambling operator because it does not accept or transmit stakes, make or accept wagers, award value based on sports outcomes, connect users to a sportsbook, or receive betting-linked compensation. That is an inference from the elements in federal and California statutes, not a safe harbor.

The most important ambiguity is not whether the beta takes bets—it does not—but whether an edge-oriented analytics product could be treated as information that assists wagering or, for a native build, as a prohibited gambling aid or companion. The PWA-first plan limits app-store risk but does not remove federal, state, consumer-protection, or privacy obligations.

## Approved beta boundary

The beta may:

- Let an adult manually enter a player, market, line, over/under side, and American odds.
- Compute break-even probability, historical hit rate, a clearly labeled historical hit-rate gap, and a hypothetical return scenario.
- Show sample size, uncertainty, game-level evidence, data source, and freshness.
- Save an immutable **analysis snapshot** locally, provided it contains no indication that a wager was placed.
- Charge nothing, offer no prize, and provide no financial reward.
- Link to a neutral responsible-gambling resource.

The beta must not:

- Accept, transmit, place, route, settle, fund, or record a wager.
- Store stake amount, sportsbook, bet-slip ID, placement status, win/loss settlement, wallet, deposit, withdrawal, or wagering history.
- Connect to, deep-link to, advertise, recommend, or rank sportsbooks.
- Use affiliate links, referral codes, revenue share, cost-per-acquisition payments, or compensation based on betting activity or outcomes.
- Run contests, sweepstakes, pick'em games, leaderboards with prizes, or virtual currencies exchangeable for value.
- Describe a result as a lock, safe bet, guaranteed profit, proven winner, expected earnings, or a recommendation to wager.
- Publish a predictive model or personalized pick alerts under this beta decision.

## Federal boundary

### UIGEA

The Unlawful Internet Gambling Enforcement Act defines a “bet or wager” around staking or risking something of value on an outcome under an agreement that value will be received for a certain outcome. It prohibits a person engaged in the business of betting or wagering from knowingly accepting specified financial instruments in connection with unlawful internet gambling. A free or fixed-fee calculator that accepts neither stakes nor betting-related payments and awards no outcome-dependent value does not match those core elements on the stated facts.

Sources: [31 U.S.C. § 5362](https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-title31-section5362&num=0&edition=prelim), [31 U.S.C. § 5363](https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-title31-section5363&num=0&edition=prelim).

### Wire Act

The Wire Act applies to a person “engaged in the business of betting or wagering” who knowingly uses interstate or foreign wire communications to transmit bets, wagers, or information assisting their placement on a sporting event or contest. The no-wager, no-sportsbook-connection, no-affiliate, and no-outcome-compensation boundaries materially reduce this risk, but the statute's reference to wagering information is why any sportsbook connection, real-time bet routing, operator-facing data feed, or betting-linked compensation requires fresh counsel review.

Source: [18 U.S.C. § 1084](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title18-section1084).

## California boundary

California Penal Code § 337a prohibits bookmaking; receiving, holding, or forwarding stakes; recording or registering bets; and making, offering, or accepting bets. The statute applies even to a single instance. A user-entered hypothetical line analyzed without a stake or placement record is materially different from recording an actual wager. Product fields and copy must preserve that distinction.

California Penal Code § 337i separately addresses knowingly transmitting betting odds and related contest information to or by persons engaged in illegal gambling operations. The beta must therefore have no operator integration or operator-facing feed, and it must not knowingly provide services to an illegal sportsbook.

California's regulator states that sports betting and daily fantasy sports are not regulated in California and directs reports about illegal in-person sportsbooks to the Department of Justice. A 2025 California Attorney General opinion concluded that online fantasy-sports wagers made by a person physically present in California violate § 337a even when associated technology is outside the state. The beta does not accept wagers, but California's enforcement posture makes counsel review necessary before any feature that closes the distance between analysis and a transaction.

The 2026 California gambling resource book also includes Penal Code § 337o, which prohibits defined dual-currency online sweepstakes games that simulate sports wagering and award cash or cash equivalents. The current no-contest, no-currency, no-prize design avoids those elements. Any promotional competition or prize feature is a legal-review trigger.

Sources: [California Penal Code § 337a](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=337a), [California Gambling Law, Regulations, and Resource Information—2026 edition](https://www.cgcc.ca.gov/documents/enabling/California_Gambling_Law_Regulations_and_Resource_Information.pdf), [California Gambling Control Commission complaint guidance](https://www.cgcc.ca.gov/?pageID=complaints), [California Attorney General Opinion 23-1001](https://oag.ca.gov/system/files/attachments/press-docs/23-1001.pdf), [California 2025 gambling-legislation summary](https://www.cgcc.ca.gov/?pageID=2025GamblingLegislation).

## Distribution-platform implications

| Channel | Current implication | Decision |
| --- | --- | --- |
| Mobile-first PWA | Apple expressly notes that Safari and the open Internet remain available when App Store rules do not fit a business idea. A PWA avoids App Store and Play review, but it remains subject to law, hosting terms, privacy rules, and consumer-protection rules. | **Preferred beta channel.** Keep it installable but web-delivered. |
| Apple native app | Apple requires real-money gaming apps to be licensed, geo-restricted, and free, and separately prohibits “illegal gambling aids.” It does not define exactly when a statistical edge calculator becomes an aid. Accurate age rating and complete review notes are also required. | **Do not submit under this decision.** Obtain California gaming counsel's written classification and prepare App Review notes before submission. |
| Google Play native app | Google generally prohibits apps that enable or facilitate real-money wagering unless licensed and approved. The policy also treats odds/performance tracking as gambling companion functionality in its gambling-advertising restrictions and gives a dedicated sports-odds tracker with gambling ads as a violation example. Removing all gambling ads and links helps, but classification remains uncertain because the product is intended to evaluate wagers. | **Do not submit under this decision.** Request policy guidance and legal review first; keep all sportsbook ads and calls to action out. |

Sources: [Apple App Review Guidelines, introduction and §§ 2.3.6, 5.3.4](https://developer.apple.com/app-store/review/guidelines/), [Google Play Real-Money Gambling, Games, and Contests policy](https://support.google.com/googleplay/android-developer/answer/9877032?hl=en).

## Marketing and result-language controls

Federal truth-in-advertising rules require claims to be truthful, non-deceptive, and evidence-based. The FTC's substantiation policy requires a reasonable basis before an objective claim is disseminated. California Business and Professions Code § 17500 independently prohibits untrue or misleading statements about services, including statements made over the Internet.

Use these result labels:

- “Historical hit rate”
- “Break-even probability at entered odds”
- “Historical hit-rate gap”
- “Hypothetical return per $100 if the historical frequency repeated”
- “Sample: 7 of 10 eligible games”
- “Historical data is not a prediction or recommendation”

Do not use:

- “Edge” as an unqualified claim that the user has a true predictive advantage
- “Expected profit” when the calculation merely substitutes a historical frequency for a future probability
- “Lock,” “safe,” “guaranteed,” “can't lose,” “proven system,” “best bet,” or personalized commands such as “take the over”
- Testimonials or win-rate claims without records and a documented calculation methodology
- A disclaimer that contradicts a stronger headline or overall message

The working brand “Edge Calculator” may remain during private development, but public-facing naming, store metadata, screenshots, and paid acquisition copy require review because the word “edge” can imply predictive value beyond the historical calculation.

Sources: [FTC Advertising and Marketing Basics](https://www.ftc.gov/business-guidance/advertising-marketing), [FTC Policy Statement Regarding Advertising Substantiation](https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation), [FTC .com Disclosures guidance](https://www.ftc.gov/business-guidance/resources/com-disclosures-how-make-effective-disclosures-digital-advertising), [California Business and Professions Code § 17500](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17500.).

## Privacy and data minimization

The free beta should be local-first and collect no information that is unnecessary to calculate or evaluate the analysis flow.

Required controls:

- Default saved analyses to on-device storage. Do not create accounts for the initial beta.
- Store only a boolean/session record for “I confirm I am 21 or older” if retention is necessary. Do not collect a full birth date, government ID, biometric, precise geolocation, financial credentials, or sportsbook credentials.
- If a user fails the age screen, stop access and do not retain their age or other personal data.
- Do not request GPS. If jurisdictional research later requires location, start with an optional user-selected state and obtain legal review before automated geolocation.
- Inventory analytics, error monitoring, support forms, cookies, IP/device identifiers, and third-party SDKs. Disable advertising IDs, cross-site tracking, and data sale/sharing for the beta.
- Scrub prop selections and saved analyses from logs unless required for a documented beta metric; aggregate or de-identify telemetry where practicable.
- Publish a conspicuous privacy policy before collecting email addresses, account identifiers, device identifiers, or other personally identifiable information.
- Set retention periods, provide a deletion/contact path, contractually bind service providers, and maintain reasonable security.

California's CalOPPA requires a commercial website or online service collecting personally identifiable information from California consumers to conspicuously post a privacy policy describing collection, sharing, change procedures, effective date, tracking response, and third-party tracking. This can apply below the larger CCPA business thresholds.

If the product later meets CCPA thresholds, the CCPA adds notice, access, deletion, correction, opt-out, sensitive-information, and non-discrimination obligations. It also requires collection, use, retention, and sharing to be reasonably necessary and proportionate. California separately requires businesses maintaining specified personal information to use reasonable security.

Sources: [California Business and Professions Code § 22575](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=22575.), [California Civil Code § 1798.100](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.100.), [California Attorney General CCPA guidance](https://oag.ca.gov/privacy/ccpa), [California Civil Code § 1798.81.5](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.81.5.).

## Age gating

The 21+ restriction is a prudent product boundary, not a legal safe harbor and, for a non-wagering calculator, not an identified independent statutory requirement. For the invited PWA beta, use neutral, friction-light self-attestation and adult-oriented design. Do not describe self-attestation as “age verified.”

COPPA applies to child-directed sites and services and to general-audience services with actual knowledge that they collect personal information from a child under 13. The FTC states that a general-audience service is not required to ask every visitor's age and may rely on neutrally collected age information. Keeping the service clearly adult-oriented and avoiding accounts or personal-data collection reduces exposure.

California's Digital Age Assurance Act becomes operative January 1, 2027. It requires covered app-store/operating-system age signals and requires developers receiving those signals to use them for applicable-law compliance while minimizing collection and sharing. Before a native release—or an installable PWA release that may fall within the Act's broad definitions—counsel must determine applicability and implementation. The Act's oldest signal bucket is “at least 18,” so it does not replace a separate 21+ product restriction.

Sources: [FTC COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa), [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [California AB 1043 / Digital Age Assurance Act](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1043).

## Responsible-gambling disclosure

No federal or California source reviewed here imposed a specific responsible-gambling disclosure on a standalone non-wagering calculator. Even so, the product is intentionally used in a betting context, so the beta should display a visible, neutral help link in Settings and on result screens:

> Gambling can be harmful. For free, confidential California help, call 1-800-GAMBLER or text SUPPORT to 53342.

This is a harm-reduction measure, not a compliance safe harbor. Do not pair it with celebratory wagering imagery or copy.

Source: [California Department of Justice Bureau of Gambling Control](https://oag.ca.gov/gambling).

## Legal-review triggers

Stop and obtain a written review from gaming/privacy/consumer-protection counsel before any of the following:

1. Bet placement, routing, wallets, deposits, payouts, settlement, sportsbook credentials, bet-slip import, or stored wager records.
2. Sportsbook links, affiliate codes, operator advertising, lead generation, revenue share, cost per acquisition, or outcome-linked compensation.
3. Operator-facing APIs, live odds feeds intended to support placement, or knowledge that an illegal operator is using the service.
4. Paid predictive picks, personalized bet recommendations, push alerts, expected-profit claims, or public model output.
5. Stakes, contests, sweepstakes, prizes, cash equivalents, redeemable points, or simulated sportsbook play.
6. Public launch, paid subscriptions, launch outside California, or any state-by-state expansion.
7. Native App Store or Google Play submission.
8. Precise geolocation, full date of birth, identity documents, biometrics, financial data, or sportsbook credentials.
9. Targeting or admitting minors, child-oriented creative, or receipt of an app-store age signal indicating a minor.
10. Material changes in California sports-wagering law, federal gambling law, Apple policy, Google policy, or the product's compensation model.

## Pre-beta acceptance checklist

- [ ] California counsel confirms the written facts and analytics-product classification.
- [ ] No wager, sportsbook, bet-tracking, affiliate, advertising, contest, or prize fields exist in UI, API, schema, telemetry, or copy.
- [ ] Results use the approved historical labels and display sample size and uncertainty.
- [ ] Historical-data and no-bet-placement disclosures are visible before or adjacent to the result.
- [ ] 21+ self-attestation is implemented without claiming identity verification.
- [ ] Privacy policy, terms, source attribution, retention rules, and contact/deletion path are published.
- [ ] Analytics and error logging are inventoried, minimized, and tested for sensitive-field leakage.
- [ ] Responsible-gambling help is visible in Settings and results.
- [ ] Invite list, feedback intake, and support process do not collect betting outcomes or wager records.
- [ ] A compliance owner is named to recheck law and platform policy before public, paid, predictive, or native expansion.

## Sources reviewed

Only primary legal, regulatory, and platform sources were used:

- [United States Code—31 U.S.C. §§ 5362–5363](https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title31%2Fsubtitle4%2Fchapter53)
- [United States Code—18 U.S.C. § 1084](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title18-section1084)
- [California Gambling Law, Regulations, and Resource Information—2026 edition](https://www.cgcc.ca.gov/documents/enabling/California_Gambling_Law_Regulations_and_Resource_Information.pdf)
- [California Attorney General Opinion 23-1001](https://oag.ca.gov/system/files/attachments/press-docs/23-1001.pdf)
- [California Legislature—BPC §§ 17500 and 22575; CIV §§ 1798.100 and 1798.81.5](https://leginfo.legislature.ca.gov/)
- [California Gambling Control Commission](https://www.cgcc.ca.gov/)
- [California Department of Justice Bureau of Gambling Control](https://oag.ca.gov/gambling)
- [Federal Trade Commission advertising and COPPA guidance](https://www.ftc.gov/business-guidance)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Real-Money Gambling, Games, and Contests policy](https://support.google.com/googleplay/android-developer/answer/9877032?hl=en)
