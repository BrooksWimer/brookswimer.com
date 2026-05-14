# Resume Master Inventory

This file is the durable source for resume and cover-letter generation. The structured form of these facts lives in [`resume/content.json`](content.json); this file is the human- and agent-readable mirror, organized so a tailoring pass can scan it without parsing JSON.

When a fact changes, update both files. `content.json` is what the resume pipeline (`generator.py`, `html_builder.py`, `renderer.py`) actually reads when rendering output; this markdown is the inventory of truth that pipeline content should match.

## Current Source Documents

- `resume/content.json` — structured data driving the renderer.
- `Brooks Wimer Resume 2026.docx` — current Word source.
- `Brooks Wimer Software Developer Resume (4).pdf` — current PDF output.

## Default Target

Software engineering roles, with tailoring for backend, full-stack, automation, AI systems, or platform-adjacent roles when the target job calls for it.

## Contact

- Name: Brooks Wimer
- Address: 4 Gardner St., Allston, MA
- Phone: (847) 648-1332
- Email: wimerbrooks@gmail.com
- Links: LinkedIn, GitHub, Portfolio (link surfaces resolved at render time)

## Education

### Boston University — Computer Science
- Dates: Jan 2021 – May 2025
- GPA: 3.74
- Achievements: Dean's Advisory Board; Peer Tutor; Dean's List; Teacher's Assistant.

## Work Experience Inventory

Roles in reverse chronological order. The `priority` field signals relative emphasis in space-constrained tailored resumes.

### Collette — Software Engineer I, Strategic Initiatives
- Dates: Sep 2025 – Present
- Priority: 10
- Highlights:
  - Designs and develops RESTful APIs for core travel services (Booking, Payments, Air) on the Strategic Initiatives modernization team.
  - Led rework of the payment processing flow through the booking API, preserving full backwards compatibility with the existing legacy system throughout migration.
  - Contributes to the company-wide initiative migrating legacy SOAP-based, stored-procedure-heavy VB services to modern C# REST architecture.

### Corso — Full Stack Engineer Intern
- Dates: Jan 2025 – Apr 2025
- Priority: 7
- Highlights:
  - Built a Next.js web application for AI-powered analytics and visualization of construction permits and regulatory data — owned full-stack implementation including data pipeline, API layer, and interactive frontend dashboard.

### ISO New England — Software Development Intern
- Dates: Jun 2024 – Jan 2025
- Priority: 9
- Highlights:
  - Built a real-time capacity deviation dashboard used live by control-room operators to monitor grid stability — replaced manual data collection with a consolidated single view.
  - Engineered Emergency Notification tooling that synchronized two disconnected operator data sources, ensuring escalation accuracy and eliminating manual entry during grid events.
  - Delivered 60-page API documentation and a GUI-based template that brought 30% of non-compliant renewable energy plants into mandated data submission compliance.

### Boston University — Teacher Assistant, C# Full Stack App Dev
- Dates: Sep 2023 – May 2025
- Priority: 6
- Highlights:
  - Developed curriculum, taught classes, and mentored students in conceptualizing and building novel C# full-stack applications.

### Talitha — CPG Research Analyst
- Dates: May 2023 – May 2024
- Priority: 5
- Highlights:
  - Collaborated with the M&A team to analyze Salesforce data, identify potential acquisition targets, and streamline the acquisition process.

## Project Inventory For Resume Use

Resume-length descriptions (≤3 bullets). Full portfolio storytelling lives in the portfolio site, not here.

### Maverick — TypeScript · Node.js · Discord.js · SQLite · Claude Code · Codex CLI
- Dates: Jan 2025 – Present
- Priority: 10
- Bullets:
  - Built an AI agent orchestration platform controlled via Discord — routes software engineering tasks to Claude Code and Codex agents across concurrent projects.
  - Implements structured pipelines (intake → plan → implement → verify → review) with persistent SQLite state, git worktree isolation per task, and pluggable AI backends.
  - Supports concurrent multi-project workflows; agents surface results and diffs back to the operator through Discord with a full audit trail per task.

### SyncSonic — Python · BLE GATT · React Native · Shell
- Dates: Feb 2025 – Present
- Priority: 9
- Bullets:
  - Built the first open-source, brand-agnostic multi-speaker Bluetooth audio orchestrator — synchronizes 5+ speakers from any manufacturer simultaneously.
  - Programmed Raspberry Pi + multiple USB Bluetooth adapters with a deterministic state machine per device handling discovery, pairing, trust, connection, and audio loopback.
  - Built a React Native mobile app (BLE GATT) for per-speaker volume, latency, and mute control; engineered startup phase-alignment via microphone-based audio cross-correlation.

### Kitbash — Kotlin · Jetpack Compose
- Dates: Feb 2025 – May 2025
- Priority: 7
- Bullets:
  - Built an Android app (Jetpack Compose) that turns a phone into a fully customizable PC game controller — drag-and-drop layout builder with button, joystick, D-pad, voice, and motion controls.
  - Relayed inputs from device to PC over WebSocket via a Google Cloud relay server; synced layouts to Firebase with offline buffering and real-time reconnection handling.

### Capacity Deviation Display — R · SQL · JS · CSS · HTML
- Dates: Sep 2024 – Nov 2024
- Priority: 8
- Bullets:
  - Built a live dashboard used by power grid operators to monitor real-time capacity deviations.
  - Enabled faster emergency response by consolidating capacity metrics into a single real-time view, eliminating manual data collection across disparate systems.

### Emergency Notification System — Python · SQL · Selenium
- Dates: May 2024 – Sep 2024
- Priority: 7
- Bullets:
  - Built Python + Selenium tooling to synchronize two disconnected operator data sources for the Emergency Notification System, keeping escalation paths accurate during grid events.
  - Eliminated hours of weekly manual data entry and prevented input errors that could delay operator response during grid emergencies.

### API Template and Instructions — Java · XML · Python
- Dates: May 2024 – Aug 2024
- Priority: 8
- Bullets:
  - Authored a 60-page API guide and interactive GUI training tool covering every endpoint, schema, and workflow for renewable energy data submission.
  - Built a GUI-based Python API template so operators could submit data without writing code, removing the technical barrier driving non-compliance.
  - Directly enabled 30% of previously non-compliant renewable energy plants to meet mandated data submission requirements for ISO New England.

### FoodPal — Java · SQL · Python · HTML · CSS
- Dates: Sep 2023 – Dec 2023
- Priority: 3
- Bullets:
  - Class project: built a full-stack app integrating Spoonacular, DoorDash, and Google Maps APIs to automate recipe → ingredient matching → grocery delivery.

### Astra (public name; internal: Netwise) — *not yet in content.json*

The portfolio site features Astra as one of the three flagship projects (`projects/astra/`), but it is **not present** in `resume/content.json` and therefore does not flow through the resume pipeline today. Decision pending: add Astra to `content.json` with a resume-appropriate description so tailored resumes can include it, or intentionally keep it portfolio-only. Recommend adding an entry; flagging here so a future tailoring pass surfaces the gap rather than silently dropping the project.

## Skills Inventory

### Programming Languages
Python · TypeScript · JavaScript · C# · Java · C · R · C++ · HTML · CSS · SQL · XML

### Frameworks, Platforms & Tools
Node.js · React Native · Next.js · .NET / ASP.NET · BLE/GATT · Git · SQLite · Firebase · Selenium · Linux / Raspberry Pi

### Domains
Backend services and REST APIs · Legacy-to-modern service migration · Real-time operator dashboards · AI agent orchestration · Multi-device Bluetooth/audio orchestration · Cross-platform mobile (React Native, Jetpack Compose) · Data-source synchronization and compliance tooling.

## Tailoring Rules

- Start from the master inventory; do not invent experience not represented here.
- Select the most relevant work experience and project bullets for the target role.
- Re-order by `priority` and role relevance, not by raw recency.
- Keep claims factual and concise; prefer quantified evidence (e.g., "30% of plants brought into compliance", "5+ speakers", "60-page guide") when present.
- Preserve an official resume tone rather than portfolio-style narrative.
- When in doubt about a fact, leave it out — the inventory is the source of truth.

## Cover Letter Rules

- Keep letters concise and role-specific.
- Use direct evidence from the inventory; do not paraphrase into hype.
- Avoid generic enthusiasm without concrete fit.

## Open Inventory Tasks

- Resolve the Astra gap above (decide whether Astra ships with resume tailoring; if yes, add an entry to `content.json`).
- Add a `tailored/` folder convention for per-application resume + cover-letter outputs alongside the master files.
- Add explicit role-family variants (backend-leaning, full-stack, AI-systems) so tailoring is a selection rather than a rewrite.
- Add canonical resume format preferences (one-page vs. two-page thresholds, section ordering preferences when space is tight).
