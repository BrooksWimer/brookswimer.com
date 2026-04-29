# Epic: portfolio

Owns the public portfolio website: homepage, project ordering, project pages/cards, screenshots, visual polish, and public-facing project narrative.

## Goal

Make the site an easy-to-scan career-proof artifact for recruiters, engineering managers, and technical peers while preserving authenticity and avoiding gimmicks.

## Rules

- Keep every visible project clean and updated enough to feel intentional.
- Current and classic projects can be ordered closer to the top, but do not create a neglected archive.
- Keep the design simple and readable.
- Project descriptions should explain what was built, why it matters, what technical judgment was involved, and what evidence exists.
- Use Astra as the public name for the Netwise project.

## Context Inputs

- `index.html`
- `projects/`
- `images/`
- `assets/css/`
- `README.txt`
- `docs/maverick/plans/making-portfolio-pop.md`

## Recovered Planning Baseline

Maverick recovered the interrupted Claude planning run for workstream
`5134a61d-d51d-43d6-b07e-a7d6f8bd8816`, named `Making portofolio pop`.
The raw archive is preserved on the Maverick host at:

`C:\Users\wimer\Desktop\Maverick\data\recovered-planning-artifacts\portfolio-resume\making-portofolio-pop-5134a61d`

The useful planning consensus is now durable in this repo. Future planning
for broad portfolio polish should start from this baseline instead of
rediscovering the site from scratch.

### Portfolio Polish Objective

Make the site materially more compelling for recruiters, engineering managers,
and technical peers without turning it into a gimmicky landing page. The
portfolio should quickly answer who Brooks is, what he builds, what proof
exists, and which projects deserve attention.

### Current Problems To Address

- Hero currently reads like a label, not a positioning statement.
- Project cards need stronger hooks and consistent title casing.
- Lowercase placeholder titles should be replaced, especially Kitbash and
  FoodPal.
- Maverick, SyncSonic, and Astra should be treated as flagship/current proof.
- About and Experience copy should lead with differentiators, scope, and impact.
- Fullscreen project cards need mobile behavior checked and fixed.
- Inline styles should be consolidated into maintainable CSS classes.
- Accessibility basics should be present: aria labels and visible focus states.
- Detail pages should have consistent visual language, impact/status sections,
  and proof assets where available.

### Preferred Implementation Slices

1. Hero and positioning:
   Replace `Brooks Wimer's Software Portfolio` with `Brooks Wimer` plus a
   short software-engineering positioning tagline. Add simple anchor navigation
   for Projects, About, Experience, and Contact.

2. Project card hierarchy:
   Add a one-line hook or blurb beneath each project card title. Use facts from
   existing project pages and avoid invented metrics. Fix inconsistent titles:
   `customizable game controller application`, `food delivery application`, and
   any other placeholder-style title.

3. Visual system:
   Keep the existing white-on-dark palette. Add only a restrained blue accent
   for buttons, focus states, dividers, and small card details. Do not add a new
   frontend framework or new deployment dependency.

4. About and experience:
   Lead with durable systems, AI agent orchestration, distributed audio
   hardware, and API modernization. Collette should emphasize legacy VB
   monolith to C# REST API modernization. ISO New England should emphasize
   real-time grid monitoring tools and forecasting API documentation.

5. Detail pages:
   Prioritize Maverick, SyncSonic, Astra, Kitbash, and FoodPal. Add or improve
   `Impact / Status` and `What I Learned` style sections where useful. For
   Maverick and Astra, add stronger motivation narrative and proof assets.

6. Mobile and accessibility:
   Fix fixed-height card behavior on small screens. Ensure card hooks and hero
   text do not overflow. Add social link `aria-label`s and `:focus-visible`
   styles for keyboard navigation.

7. Verification:
   Serve locally, inspect desktop and mobile viewports, check internal links,
   validate key HTML pages if tooling is available, and confirm no new broken
   images or deployment changes.

### Resolved Defaults

- Use public name `Astra`; keep `Netwise` internal only.
- Do not invent numbers or claims.
- Do not remove older projects just because they are old.
- Prefer direct edits to `index.html` and `assets/css/main.css`; if SASS is
  edited, update the compiled CSS too.
- Preserve `CNAME`, GitHub Pages settings, and resume PDF link.
- Work from the durable `portfolio` branch and disposable Maverick workstreams,
  not directly from `master`.

## TODO

- Identify canonical screenshots/videos for each important project.
- Add concise public-facing descriptions for every project folder.
- Define project ordering after the next site cleanup pass.
