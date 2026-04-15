# United Parks · AI Concierge Prototype
### Product Requirements Document — v1.0 · April 2026

| | |
|---|---|
| **Scenario** | Family with teens · SeaWorld Orlando · Mako as anchor · Orca Encounter |
| **Status** | Working prototype — ready for stakeholder demo |
| **Stack** | React 18 · Vite 6 · Tailwind CSS v3 |
| **Repo** | github.com/chrisbcn/united-parks |
| **Live** | Deployed via Vercel |

---

## 1. Purpose

This prototype makes abstract AI concierge capabilities tangible — showing how a personalised park assistant could plan a family's day, respond intelligently to disruptions like queue spikes, and adapt its communication style to different guest personalities.

It is not a production build. It's a high-fidelity interactive concept built to demonstrate what an AI concierge layer could look like across United Parks & Entertainment properties.

---

## 2. What Was Built

### Screen 1 — My Plan (Itinerary)
The primary view. Shows a chronological day plan built from onboarding answers. Each card shows time, attraction name, walk time, and a short AI rationale. After a plan update, changed items receive an **UPDATED** badge and the list re-sorts chronologically.

### Screen 2 — Live (Disruption)
Fires automatically ~3 seconds after onboarding completes. Explains what changed (Mako queue spiked to 90 min), presents two options, and updates the plan based on the guest's choice. Response copy adapts to the selected archetype.

### Screen 3 — Explore (Park Map)
Interactive park map with filter chips — Animals, Shows & Presentations, Rides, Dining. Lets guests browse attractions by category and find what's nearby.

### Screen 4 — Settings
Displays captured visit preferences, the concierge mode selector (three archetypes), and notification toggles. Shows the system retains what it learned during onboarding.

### Onboarding Flow
Runs inside Screen 1 before the itinerary appears. Five conversational questions:
1. Group type
2. Must-do rides (Mako, Orca Encounter, Penguin Trek)
3. Lunch window preference
4. Open to surprises?
5. Departure time

Answers build the itinerary in real time. Once complete, the disruption timer starts.

### Journey Map (`/journey-map.html`)
Standalone HTML doc served from the same Vite server. Full guest journey in table format — touchpoints, emotions, AI actions, commercial opportunities — plus the disruption breakdown and archetype profiles. Cross-linked from the prototype header.

---

## 3. The Scenario

| | |
|---|---|
| **Guests** | Family with two teens |
| **Property** | SeaWorld Orlando |
| **Must-dos** | Mako, Orca Encounter, Penguin Trek |
| **Lunch** | Around 12:30 PM (Sharks Underwater Grill) |
| **Discovery** | Wild Arctic (guest didn't specifically ask for it) |
| **Disruption** | Mako queue spikes to 90 min mid-morning |
| **Departure** | 5:00 PM |

The disruption is the centrepiece: the AI detects a queue spike on the family's first planned ride, surfaces two options rather than acting silently, and updates the itinerary based on what they pick.

---

## 4. Key Design Decisions

### Three archetypes, not one response style
The most common objection to AI concierge concepts is "but every guest is different." The archetype switcher (above the phone shell in the demo) answers this directly — same intelligence, different communication register:

- **Truster** — acts, then briefly informs. One-tap. No options surfaced.
- **Configurator** — two options, clearly labelled, recommended path flagged.
- **Skeptic** — full rationale, explicit list of what stays vs. changes, reassurance that must-dos are protected.

### Light, family-friendly theme
Teal/navy/white palette with Inter body text and Playfair Display headings. Designed to feel approachable and energetic — appropriate for a theme park context and distinct from luxury hospitality.

### Itinerary re-sort after plan update
Accepting Option A re-sorts the full list chronologically (not just patches times inline). This mirrors how a human concierge would re-present a revised plan — a clean logical sequence, not a patched version of the old one. UPDATED badges make changes findable at a glance.

### Disruption as opportunity, not failure
The queue spike scenario was deliberately chosen because it's a high-frequency, high-frustration moment in theme park visits. The prototype reframes it: the AI turns a bad situation into a demonstration of trust by acting quickly, explaining clearly, and keeping the family's must-dos intact.

### Tailwind @apply limitation
Custom color tokens (`sw.teal`, `sw.navy` etc.) cannot be used inside `@apply` in `@layer components` — Tailwind v3 doesn't resolve them at that stage. All component styles in `index.css` use plain CSS with hardcoded hex values for this reason.

---

## 5. What It's Meant to Show

| Claim | How the prototype demonstrates it |
|---|---|
| AI can personalise at depth | Onboarding answers directly shape the itinerary — must-do rides locked in, lunch timing respected, Wild Arctic surfaced as a discovery |
| Real-time disruption handling | Alert banner, two-option card, and itinerary update happen live during the demo |
| Guest stays in control | AI never acts unilaterally (in Configurator/Skeptic modes). Must-dos are visually protected |
| Style adapts to the guest | Switching archetypes changes the disruption copy in real time — same facts, different tone |
| This scales across properties | The same architecture was re-themed for MGM Grand in a single session — demonstrating it is brand and property agnostic |
| It's production-realistic | React + Vite + Tailwind is a real production stack; the code could be evolved, not thrown away |

---

## 6. Suggested Demo Flow

1. Open prototype (Vercel URL). Set archetype to **Configurator**.
2. Walk through onboarding as the family — teens, Mako + Orca Encounter, 12:30 lunch, yes to surprises, 5 PM departure.
3. Itinerary appears. Point out: AI rationale on each card, Sharks Underwater Grill as the lunch anchor, Wild Arctic as a surprise discovery.
4. After ~3 seconds, disruption banner fires. Tap it. Show the two options.
5. Accept Option A. Watch the itinerary re-sort with UPDATED badges.
6. Switch to **Truster**. Reload. Repeat the disruption — show how the copy changes.
7. Switch to **Skeptic**. Repeat — show the full-detail response.
8. Open the Explore tab and the Journey Map to ground the broader AI journey conversation.

---

## 7. Out of Scope (This Version)

- Real API integration — all data is hardcoded
- Authentication or guest profile management
- Actual queue time or booking system connectivity
- Mobile app deployment (iOS / Android)
- Multi-property support (though the MGM prototype proves portability)
- Accessibility audit
