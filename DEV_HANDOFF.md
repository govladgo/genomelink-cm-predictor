# Common Ancestor cM — Dev Handoff

**Live prototype:** https://genomelink-cm-predictor.vercel.app
**Help page:** https://genomelink-cm-predictor.vercel.app/help
**Repo:** https://github.com/govladgo/genomelink-cm-predictor
**Vercel project:** `genomelink-cm-predictor` (org `team_y8a7U6xWwk5oWePbjjxOW46n`)

---

## What it does

Given a shared cM value, this tool predicts the probability of every compatible relationship class — from identical twin to 8th cousin — and lets the user adjust for **historical population context**.

The headline insight: **cM doesn't mean one specific relationship.** A shared 100 cM segment fits half-1st-cousin, 2nd-cousin, 1st-cousin-twice-removed, and several other distant variants — all with overlapping likelihood. Existing tools usually pick the most likely and hide the rest. This tool surfaces the full distribution.

The differentiator: **Common Ancestor cM**. For populations with significant historical endogamy (Ashkenazi Jewish, Acadian, Mennonite) or shared bottleneck history (Polish-Lithuanian Commonwealth, Iberian Colonial), two unrelated members can share substantial DNA simply by belonging to that population. The tool subtracts the population baseline before predicting recent-relationship probabilities. Naming + framing are deliberately historical / cultural rather than the clinical "endogamy multiplier" used elsewhere.

UI structure:
- **Left sidebar:** searchable list of the active demo user's matches (sorted by cM), click-to-predict
- **Right column:** cM input → relationship histogram → endogamy slider → Common Ancestor cM panel (population dropdown + narrative + cM breakdown + adjusted predictions)
- **Header:** demo-user switcher (10 users), "How to use" link

The app was previously named "Shared cM Relationship Predictor"; renamed to **"Common Ancestor cM"** to lead with the differentiating feature.

---

## Architecture

**Stack:**
- Next.js 14.2.35 App Router (no API routes — pure client-side)
- React 18, TypeScript 5, Tailwind 3.4.1 (`tw-` prefix, mostly unused; inline styles + GL design tokens preferred)
- ES5 target — **no `for...of` on iterators, no regex `s` flag**

**Data flow:**
```
public/data/index.json                    ← list of 10 demo users (~10 KB)
public/data/user-{1..10}.json             ← per-user dataset (~1 MB each, ~1,737 matches)
       │
       │ fetch on mount + on user-switch
       ▼
data/adapters/realData.ts                 ← loadUserIndex(), loadUserDataset(userId)
       │
       ▼
app/page.tsx                              ← UI state (active user, selected match,
                                            cmValue, populationId, endogamyFactor)
       │              ┌───────────────────┴────────────────┐
       ▼              ▼                                    ▼
data/sharedCmData.ts        data/populationContext.ts   components/predictor/*
(V4 reference table          (8 populations + per-       (Histogram, Endogamy slider,
+ getRelationshipsForCM)     relationship overrides)     Common Ancestor panel,
                                                          MatchList, RelationshipList)
```

URL state: active user is stored in `?user=user-N`. Selected match resets on user switch.

The two prediction surfaces (raw histogram + Common Ancestor panel) coexist — they don't replace each other. The histogram always uses the V4 baseline; the Common Ancestor panel applies the population baseline subtraction before predicting.

---

## Core algorithm — V4 relationship prediction (`data/sharedCmData.ts`)

Uses the **V4 Shared cM Project** reference table (Bettinger / Larkin / Perl, 2020) covering 34 relationship classes from identical twin (~3500 cM) to 8th cousin (~4 cM avg).

For each candidate relationship:
```
σ = (maxCM - minCM) / 4
z = (adjustedCM - avgCM) / σ
rawProb = exp(-0.5 × z²) / (σ × √(2π))    // normal PDF approximation
```

Where `adjustedCM = cM / endogamyFactor`. Filtering: only relationships where `adjustedCM ∈ [minCM - 5%, maxCM + 5%]` are kept. Final probabilities are normalized so they sum to 1, sorted descending.

**Public API:**
```typescript
getRelationshipsForCM(cM: number, endogamyFactor: number = 1.0): SharedCmEntryV4[]
```

Returns up to ~10 candidates depending on cM, each with `relationship`, `probability`, `histogram` (10 buckets, normalized), `category` (close/moderate/distant/very-distant), `generationGap`.

Performance: O(34) constant. ~0.1 ms per call.

---

## Common Ancestor cM feature (`data/populationContext.ts` + `components/predictor/CommonAncestorPanel.tsx`)

### Algorithm

```typescript
recentAncestorCM = max(0, observedCM - population.sharedPopulationFloor)
adjustedPredictions = getRelationshipsForCM(recentAncestorCM)
```

Conceptually: "how much of this cM is real recent ancestry, vs. just shared population history?"

The tool shows two parallel views:
- The original histogram for the raw observed cM (using the existing endogamy slider only, no population context)
- The Common Ancestor panel with population baseline subtracted, then the residual cM run through the same predictor

### 8 populations (`POPULATION_CONTEXTS`)

| ID | Label | Era | Baseline cM | endogamyEquiv |
|----|-------|-----|------------:|--------------:|
| `none` | None / Outbred | — | 0 | 1.00 |
| `baltic_slavic` | Baltic / Slavic | Polish-Lithuanian Commonwealth (1569–1795) | 25 | 1.15 |
| `ashkenazi` | Ashkenazi Jewish | Pale of Settlement (1791–1917) and earlier | 80 | 1.50 |
| `iberian_latam` | Iberian / Latin American Colonial | Spanish & Portuguese colonization (1500s–1800s) | 40 | 1.25 |
| `acadian_quebec` | Acadian / Quebec French | New France (1604–1763) and Acadian diaspora | 90 | 1.55 |
| `british_irish_colonial` | British & Irish Colonial American | British colonization of North America (1607–1776) | 35 | 1.20 |
| `mennonite_amish` | Mennonite / Amish | Anabaptist diaspora (1525–present) | 150 | 1.75 |
| `icelandic` | Icelandic | Norse settlement (~874 CE) and continued isolation | 50 | 1.40 |

Each population also has optional `cmAdjustments` — per-relationship cM range overrides (e.g. Ashkenazi 3rd cousin = 100–400 cM avg 200, vs. baseline 90–620 avg 200). Currently used for narrative/example display, not yet wired into the predictor (a v2 enhancement that would replace the simple subtract-floor approach with per-relationship distributions).

### Auto-suggest

When the user clicks a match in the sidebar, the population dropdown auto-selects based on the active demo user's primary ancestry (`activeUser.ancestryProfile[0].region` → `suggestPopulationForAncestry()`). User can override.

### Caveats baked into the data

The narratives explicitly cite real history (Polish-Lithuanian Commonwealth dates, Pale of Settlement, Mayflower descendants, Reykjavík isolation). Baseline cM values are **approximations from genealogical literature** — flagged as such in the UI footer. Numbers represent rough order-of-magnitude per-population shared ancestry, not precise population-genetic estimates.

---

## Demo data

Same dataset as Match Hub: 10 anchor users, ~1,737 matches each, generated by `scripts/preprocess_pickle.py` from a real 254K-pair pickle. See `genomelink-match-hub/DEV_HANDOFF.md` § "Demo data" for the full pipeline. The `public/data/` directory contains identical JSON copies.

What's used here vs. Match Hub:
- **Match list rendering:** name, sharedCM, relationship, avatar, kinship — same shape
- **Click-to-predict:** sets `cmValue = match.sharedCM` and auto-suggests `populationId`
- **Selected-match callout:** name + cM + kinship + primary ancestry (top of prediction card)

This app does **not** use the dedup engine or vendor pills — just the matches and ancestry data.

---

## Key files

| File | Role |
|------|------|
| `app/page.tsx` | Main route, ~360 lines. Header (logo + How-to-use + UserSwitcher), 2-column grid (sidebar + main), MatchList sidebar, prediction card with selected-match callout, cM input, EndogamyPanel, CommonAncestorPanel, RelationshipList, footer disclaimer |
| `app/help/page.tsx` | Help/docs page (`/help`), ~520 lines. Mirrors DNA Painter v2 help layout |
| `app/layout.tsx` | Title metadata: "Common Ancestor cM — Genomelink" |
| `data/adapters/realData.ts` | `loadUserIndex()`, `loadUserDataset(userId)`, URL state helpers. In-memory caches |
| `data/types.ts` | `SharedCmEntry`, `SharedCmEntryV4`, `DNAMatch`, `AncestryComponent`, `Segment` (subset used here) |
| `data/sharedCmData.ts` | V4 reference table (34 relationships) + `getRelationshipsForCM()`. Normal PDF probability + histogram generation |
| `data/populationContext.ts` | 8 populations: id, label, era, narrative, baseline cM, per-relationship cM overrides. Helpers: `getPopulationById()`, `suggestPopulationForAncestry()`, `recentAncestorCM()` |
| `components/predictor/CmInput.tsx` | Numeric input with cM-shared label |
| `components/predictor/Histogram.tsx` | Probability bar chart per relationship |
| `components/predictor/RelationshipList.tsx` | Full ranked list of compatible relationships |
| `components/predictor/EndogamyPanel.tsx` | Generic endogamy slider (0.5×–2.0×) — kept for users who don't want to commit to a specific population |
| `components/predictor/CommonAncestorPanel.tsx` | Population dropdown + narrative + cM breakdown tiles (population baseline / recent-ancestor signal) + adjusted predictions list + example callout |
| `components/predictor/MatchList.tsx` | Searchable sidebar match list with progressive "Show more" (default 80 rows, +100 per click) |
| `components/predictor/InfoBox.tsx` | Top-result info card |
| `components/UserSwitcher.tsx` | Header dropdown, click-outside handling, active highlight (copied from match-hub) |

---

## Performance

| Metric | Value |
|--------|-------|
| Initial JSON fetch (largest user) | ~1 MB gzipped, ~250 ms cold |
| `getRelationshipsForCM()` call | < 0.1 ms |
| Match list render (1,737 items) | ~50 ms first paint, capped at 80 visible by default |
| User switch | Async fetch + UI update, ~500 ms total |
| Build size | First-load JS ~94 KB, route bundle ~13 KB (includes match list state) |

---

## Known limits (flagged for prod discussion)

1. **Population reference cM tables are approximations.** Per-relationship cM brackets per population aren't published in any single canonical source. v1 numbers are order-of-magnitude estimates from genealogical literature (Acadian endogamy studies, Ashkenazi bottleneck papers). Production should source authoritative values where possible, or label the prediction as "approximate" more prominently.
2. **No multi-population mixing model.** A user with 50% Baltic + 30% Ashkenazi ancestry has to pick one population at a time. Real users may share ancestry from multiple populations simultaneously, which would shift the baseline differently. v2 enhancement.
3. **No "half" relationship modeling in the population context.** The V4 table itself includes half relationships, but the population baseline subtraction doesn't differentiate between "this is a closer half-relative" vs. "this is shared population ancestry" — both look the same numerically.
4. **Synthetic ancestry per match.** Match `ancestryComposition` is randomly synthesized per pair seed in the demo, so a 3rd cousin to a Polish anchor might be Sub-Saharan African. Production data won't have this issue.
5. **Auto-suggest uses anchor's primary ancestry only.** Doesn't yet consider the match's ancestry. Better suggestion would use the OVERLAP between anchor + match ancestry profiles. Current behavior is conservative (always suggests user's primary).
6. **No tree integration.** Once the user identifies a likely population context and recent-relationship range, the next natural step is "place this match in my tree." That's deferred to the YourRoots integration / Common Ancestor Finder tool (separate work).
7. **Endogamy slider and Common Ancestor panel are independent.** They don't share state; user could enable endogamy AND pick a population, which would double-count. UI doesn't currently warn about this.

---

## Backend integration roadmap

The cM prediction itself is pure compute and can stay client-side (~30 KB reference table, sub-millisecond runtime). What needs server backing:

**Per-user endogamy / population profile** — if we don't want to ask for it every session:
```python
class UserGeneticProfile(models.Model):
    user = OneToOneField(User, on_delete=CASCADE)
    endogamy_factor = FloatField(default=1.0, validators=[0.5, 3.0])
    common_ancestor_population_id = CharField(
        max_length=40, blank=True,
        help_text='matches data/populationContext.ts POPULATION_CONTEXTS[].id'
    )
    self_reported_population_label = CharField(max_length=100, blank=True)
```

This would replace the per-page-load default and let cM Predictor (and other tools that take an `endogamyFactor`) read it once.

**Auto-detection of population from segment patterns** — separate ML/statistics work. We could compute a user's likely population from over-representation of segment-overlap with their match list, especially close matches. Not blocking for v1.

**Real match data integration:**
The current `data/adapters/realData.ts` fetches static JSON from `/public/data/`. Production should:
- Replace with an `apiClient.fetchMatches(userId)` call to a Django endpoint
- Endpoint emits the same `DNAMatch` shape as Match Hub (canonical wire format)
- Same caching strategy as Match Hub: 24h TTL, recompute on `MAX(DNAMatchResults.updated_at)` change

---

## Things to discuss with the dev team

1. **Where do we source authoritative per-population cM baselines?** Genealogical literature has rough numbers; population genetics papers have more rigorous estimates but at different granularities. Worth investing in a curation pass before launch?
2. **Should the population context be inferred or self-reported?** A user with 60% Iberian ancestry should probably get the Iberian / Latin American context auto-applied. But people with mixed ancestry will need to override — what's the UX?
3. **How to handle mixed-ancestry pairs?** If anchor is Baltic and match is Ashkenazi, neither population's baseline applies cleanly. Show both? Pick the one that produces the more conservative prediction?
4. **Where should the V4 reference table live?** Currently duplicated in cm-predictor and WATO (Phase 3). Would benefit from extraction into a shared package or a backend endpoint.
5. **Per-relationship cM overrides in `populationContext.ts`** — currently defined but only used for narrative/example display. Should they replace the simple "subtract floor → predict residual" algorithm with full per-population probability distributions? More accurate but more research-heavy.
6. **Glossary tooltips on the main page.** The /help page covers terminology but a hover-over on "centiMorgan", "MRCA", "endogamy" in the main UI would reduce the round-trip. Worth doing?
7. **Tree integration handoff.** When this tool produces a relationship prediction, the natural next step is "show me where this match could fit in my tree." Should we deep-link to YourRoots or build the tree-fitting view in this same app?
8. **Naming clarity.** "Common Ancestor cM" is the tool name and the feature name — could be confusing in conversation. Consider naming the feature differently (e.g., "Population Context") and keeping "Common Ancestor cM" as the app brand.
