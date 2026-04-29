# Making Portfolio Pop - Recovered Planning Brief

Source: recovered Maverick planning artifacts from workstream
`5134a61d-d51d-43d6-b07e-a7d6f8bd8816`.

Archive location on the Maverick host:
`C:\Users\wimer\Desktop\Maverick\data\recovered-planning-artifacts\portfolio-resume\making-portofolio-pop-5134a61d`

This file distills the useful work from four recovered Claude plan variants so
future planning and implementation can continue instead of restarting.

## Goal

Turn the portfolio into a stronger career-proof artifact while preserving the
existing static HTML/CSS site, the dark visual identity, and all real project
content.

The page should quickly communicate:

- Brooks Wimer is a software engineer with durable systems taste.
- Current proof includes Maverick, SyncSonic, Astra, and API modernization work.
- Older projects still look intentional, not abandoned.
- The site is easy to scan on desktop and mobile.

## Main Files

- `index.html`: hero, project cards, About, Experience, Contact.
- `assets/css/main.css`: compiled site CSS. Edit directly unless the SASS build
  path is confirmed and compiled CSS is updated too.
- `assets/css/projects.css`: shared project detail page styling, if detail page
  polish is included.
- `projects/maverick/maverick.html`: flagship AI orchestration page.
- `projects/syncsonic/syncsonic.html`: flagship distributed audio page.
- `projects/astra/astra.html`: flagship local network intelligence page.
- `projects/kitbash/kitbash.html`: title/status copy cleanup.
- `projects/foodpal/foodpal.html`: title/status copy cleanup.

## Implementation Slices

### 1. Hero And Positioning

- Replace `Brooks Wimer's Software Portfolio` with `Brooks Wimer`.
- Add a short tagline. Good default:
  `Software Engineer building durable systems, AI developer tooling, and real-time hardware.`
- Add simple anchor navigation to Projects, About, Experience, and Contact.
- Add matching section ids.
- Add meta description and basic Open Graph tags.

### 2. Project Cards

- Add a one-line hook beneath each card title.
- Hooks should state the problem solved or proof shown.
- Use facts from existing detail pages and repo context.
- Fix placeholder titles:
  - `customizable game controller application` to `KITBASH - Customizable Wireless Controller`
  - `food delivery application` to `FoodPal - Restaurant Discovery & Ordering`
- Consider stronger title framing:
  - `SyncSonic - Multi-Speaker Bluetooth Audio`
  - `Maverick - AI Agent Orchestration Suite`
  - `Astra - Local Network Device Scanner`
  - `ISO-NE Control Room - Real-Time Grid Dashboard`
  - `Power Forecast API - Wind & Solar Web Services`

### 3. Visual System

- Keep the white-on-dark base.
- Add a restrained blue accent only as a supporting token.
- Use accent on button hover/focus, dividers, project title details, and links.
- Do not add a new framework or visual dependency.
- Consolidate repeated inline styles into named CSS classes.
- Remove dead hover-content rules if they no longer match the current card
  structure.

### 4. About And Experience Copy

About should lead with differentiators:

- Durable systems.
- AI agent orchestration.
- Distributed audio hardware.
- C# REST API modernization.
- Real-time grid monitoring tools.

Experience should be scoped and concrete:

- Collette: modernizing a legacy VB monolith and stored-procedure-heavy system
  into a C# REST API while preserving production compatibility.
- ISO New England: internal real-time grid monitoring tools and wind/solar
  forecasting API templates/documentation.
- Boston University: CS degree, 3.74 GPA, C# full-stack TA, peer tutor.

Do not invent metrics. If numbers are unavailable, use scope and technical
specificity instead.

### 5. Detail Pages

Prioritize:

- Maverick: explain why it exists, that it is used as a real development
  control plane, and what lifecycle it manages.
- SyncSonic: lead with the multi-speaker Bluetooth audio problem and demo proof.
- Astra: lead with ordinary-user home-network visibility and current capability
  vs. roadmap.
- Kitbash and FoodPal: fix title/status mismatch and make current status honest
  without underselling the work.

Useful detail page additions:

- `Impact / Status` section.
- `What I Learned` section.
- More consistent tech stack badges.
- Existing project images or logos where available.

### 6. Mobile And Accessibility

- Fix fixed `100vh` fullscreen-card behavior on small screens.
- Ensure card content can wrap without clipping.
- Avoid oversized hero text on mobile.
- Add social link `aria-label`s.
- Add visible `:focus-visible` styles for keyboard navigation.

## Constraints

- No new npm dependencies for the site.
- Do not modify `CNAME` or deployment config.
- Preserve all existing projects.
- Do not rename public Astra back to Netwise.
- Do not fabricate project claims, metrics, employers, or results.
- Prefer implementation inside Maverick-created disposable worktrees.

## Verification Checklist

- Serve the site locally.
- Check desktop hero, project cards, About, Experience, and Contact.
- Check 375px or similar mobile viewport.
- Click hero anchor links.
- Click resume PDF link.
- Click flagship project pages.
- Confirm no missing images in browser dev tools.
- Run HTML validation if available.
- Confirm no package/deployment files changed unless intentionally required.

## Ready Dispatch Prompt

Use this as the seed for a Codex implementation agent:

```text
Implement a portfolio polish pass for this static HTML/CSS portfolio.

Use docs/maverick/epics/portfolio.md and
docs/maverick/plans/making-portfolio-pop.md as durable context. Do not
rediscover the whole project from scratch unless a referenced file is missing.

Implement the work in slices:
1. Hero positioning and anchor navigation.
2. Project card hooks and title cleanup.
3. Restrained accent/focus visual system.
4. About and Experience copy sharpening.
5. Detail-page polish for Maverick, SyncSonic, Astra, Kitbash, and FoodPal.
6. Mobile and accessibility fixes.
7. Local verification and handoff summary.

Respect the constraints in the recovered planning brief. Do not add new site
dependencies, do not modify deployment config, and do not invent facts.
```
