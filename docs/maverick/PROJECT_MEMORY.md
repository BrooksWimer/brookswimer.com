# Portfolio & Resume Project Memory

Durable cross-workstream facts, decisions, and conventions. Operator-editable.

## 2026-05-05 — Maverick doctrine bootstrap

- Wrote PROJECT_ROADMAP.md and PROJECT_MEMORY.md (this file). PROJECT_CONTEXT.md and the two epic charters (`portfolio.md`, `resume.md`) already existed and remain authoritative for their lanes.
- Confirmed audience: technical hiring managers + engineering peers, recruiters as downstream readers.
- Confirmed v1 priority: portfolio polish first; resume epic deferred until master inventory extraction is wanted.

## Naming rule

- **Astra** is the public-facing name for the network-intelligence project. Use it in any portfolio page, project card, image alt text, or marketing copy.
- **Netwise** is internal only — repo names, internal config, Maverick orchestration references. Never on the public site.
- This rule is also documented in the netwise repo's `PROJECT_MEMORY.md`. Both sources of truth align.

## Canonical URL

- **`brookswimer.com`** (per `CNAME`). This is the GitHub Pages target.
- The `og:url` meta tag in `index.html` referencing `brookswimer.dev` is **stale metadata** and should be treated as such. If this lane updates `index.html`, fix the `og:url`.

## Featured project ordering

- Operator decision (2026-05-05): featured projects render in **Maverick → Astra → SyncSonic** order. These three are the current flagship proofs of capability.
- Older projects (Kitbash, FoodPal, 3D models, Face Filter, Control Room, API Docs, Emergency Contact, Wind/Solar Forecast) stay visible — no neglected archive — but do not get above-the-fold prominence.
- This ordering is the default; specific roles may justify temporary reordering for a tailored portfolio view, but the durable site reflects this order.

## Public-facing claims rule

- **Don't invent numbers or claims.** Proof comes from existing project pages, evidence assets, or live work. If a metric isn't real, omit it.
- Project descriptions should explain: what was built, why it matters, what technical judgment was involved, what evidence exists. Generic adjectives ("scalable", "robust") without anchors are not proof.

## Direct-edit-only rule

- Portfolio polish work edits `index.html`, `projects/*`, `assets/css/main.css`, and `images/` directly. **Don't introduce a new frontend framework or new deployment dependency** unless the operator explicitly opts in.
- If SASS is modified, update the compiled CSS in the same slice. Don't leave the deployed bundle out of sync.
- Preserve `CNAME`, GitHub Pages settings, and the resume PDF link as durable artifacts. Slices should not change them.

## Workstream model

- Portfolio polish work happens on **disposable Maverick workstreams** branching from the `portfolio` durable epic branch — not directly on `master`. Workstreams finish into `portfolio`, and `portfolio` gets explicitly promoted to `master` when ready to deploy.
- Same pattern for resume work on the `resume` epic branch.
- Following the standard Maverick promotion path: `disposable workstream → durable epic → production (master)`.

## "Making Portofolio Pop" recovered planning baseline

- Operator-typo'd workstream name preserved as artifact. The planning content is durable: see [`epics/portfolio.md`](epics/portfolio.md) "Recovered Planning Baseline" section + [`plans/making-portfolio-pop.md`](plans/making-portfolio-pop.md).
- Future portfolio polish work should start from that baseline rather than rediscovering the site from scratch.

## Resume epic priority

- Resume epic is **lower priority** than portfolio as of 2026-05-05. The pipeline (master inventory extraction → tailored output) should be ready when the operator wants to apply for roles, but no urgency.
- M3 (master inventory extraction) is the prerequisite for any meaningful resume work and should be done before M4 (tailored variant).

## Open questions

- **Project ordering after the flagships** (Maverick → Astra → SyncSonic): what's next? Defer until M2 surfaces the question with concrete content updates.
- **Detail-page treatment for non-flagships:** how much polish do older projects get? Operator default: enough to feel intentional, not enough to crowd the flagships.
- **Resume target role family:** unknown until the operator picks one for M4. Defer.
