# United Parks · AI Concierge Prototype
### Product Requirements Document — v1.1 · April 2026

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

It is not a production build. It's a high-fidelity interactive concept built to demonstrate what an AI concierge layer could look like across United Parks & Entertainment properties, and to anchor the proposal conversation with something concrete rather than slides.

---

## 2. Journey Phases

A key output of the client call is clarity on the three distinct phases of the guest journey, and which channel owns each one.

| Phase | Channel | What happens |
|---|---|---|
| **0 — Pre-purchase** | Desktop web | Guest discovers SeaWorld, buys tickets. AI concierge surfaces during the purchase flow to build confidence ("here's what your day could look like") and capture initial preferences. ~90% of ticket revenue comes from desktop. |
| **1 — Pre-visit** | Mobile app | Guest has tickets. Concierge confirms the preferences captured at purchase, allows adjustments (e.g. a family member dropped out), and builds the final itinerary. Acts as a "this is what you said — still true?" handshake before agents go to work. |
| **2 — In-park** | Mobile app | The day is live. The concierge monitors conditions (queue times, geo-location) and proactively surfaces replanning suggestions. Guest accepts or overrides. |
| **3 — Post-visit** | Email / mobile | Follow-up, loyalty, re-booking hooks. Out of scope for this prototype. |

**The current prototype covers Phases 1 and 2.** Phase 0 (desktop pre-purchase) was identified in the client call as an important addition — not a large lift, but meaningful to show the full funnel and directly addresses what Brian is focused on: exposing the AI to uninitiated users during ticket purchase to build trust and conversion.

---

## 3. What Was Built (Phases 1 & 2)

### Onboarding Flow (Phase 1 — Pre-visit)
Conversational setup before the itinerary appears. Five questions:
1. Group type
2. Must-do rides — guest's non-negotiables (Mako, Orca Encounter, Penguin Trek in the demo)
3. Lunch window preference
4. Open to surprises?
5. Departure time

Answers are locked as hard constraints. Agents build the itinerary around them. Once complete, the plan appears and the in-park disruption timer starts.

### Screen 1 — My Plan (Itinerary)
The primary view. Chronological day plan with time, attraction, walk time, and AI rationale per card. Must-dos are visually locked. After a plan update, changed items get an **UPDATED** badge and the list re-sorts chronologically.

### Screen 2 — Live (Disruption)
The in-park disruption screen. Fires ~3 seconds after onboarding (simulating real-time conditions). Explains what changed (Mako queue spiked to 90 min), presents two options, updates the plan on acceptance. Response copy adapts to the active archetype.

### Screen 3 — Explore (Park Map)
Park map with filter chips — Animals, Shows & Presentations, Rides, Dining. Browse by category, find what's nearby.

### Screen 4 — Settings
Captured visit preferences, concierge mode selector (three archetypes), notification toggles. Demonstrates the system remembers what it learned.

### Journey Map (`/journey-map.html`)
Standalone HTML doc at the same URL. Full guest journey table — touchpoints, emotions, AI actions, commercial opportunities — plus disruption breakdown and archetype profiles. Cross-linked from the prototype header.

---

## 4. The Scenario

| | |
|---|---|
| **Guests** | Family with two teens |
| **Property** | SeaWorld Orlando |
| **Must-dos** | Mako, Orca Encounter, Penguin Trek |
| **Lunch** | Around 12:30 PM (Sharks Underwater Grill) |
| **Discovery** | Wild Arctic (surfaced as a surprise — guest didn't ask for it) |
| **Disruption** | Mako queue spikes to 90 min mid-morning |
| **Departure** | 5:00 PM |

The disruption is the centrepiece: the AI detects a queue spike, surfaces two options, and updates the itinerary based on what the family picks. The Orca Encounter remains locked throughout regardless of what changes.

---

## 5. Key Design Decisions

### Three archetypes, not one response style
The most common objection to AI concierge is "but every guest is different." The archetype switcher answers this live in the demo — same intelligence, different communication register:

- **Truster** — acts, then briefly informs. One tap. No options presented.
- **Configurator** — two options, clearly labelled, recommended path flagged. Guest decides.
- **Skeptic** — full rationale, explicit list of what stays vs. changes, reassurance that must-dos are untouched. Notably: a Skeptic who starts the day wanting full control often ends the day saying "just tell me" — the AI earns trust through transparency.

### Hard constraints vs soft preferences
Must-dos are set at onboarding and never moved by the AI — they're locked visually and in the replanning logic. This is not just a UX detail: it's the core trust mechanism. The AI can only earn the right to rearrange the day if guests know their non-negotiables are safe.

### Disruption as opportunity, not failure
Queue spikes are one of the highest-frustration moments in a theme park day. The prototype reframes it: the AI turns a problem into a demonstration of value. Option A saves the family 45 minutes. That's tangible. That's what makes someone trust the system for the rest of the day.

### Itinerary re-sort after plan update
Accepting a plan change re-sorts the full list chronologically — not a patched version of the old plan, a clean new one. UPDATED badges make changes findable. This matters because it mirrors how a good human concierge would present a revised itinerary.

### Geo-location (illustrated, not wired)
The map tab and the Live screen reference geo-awareness — "you're 5 minutes from Mako, queue is unusually light right now, do you want to jump in?" This is illustrated in the prototype as a concept but not wired to real location data. It's a demo talking point, not a technical claim.

### Light, family-friendly theme
Teal/navy/white palette, approachable and energetic. Designed to be legible in bright outdoor conditions. Deliberately different from the dark luxury MGM version — same architecture, different brand register.

---

## 6. What It's Meant to Show

| Claim | How the prototype demonstrates it |
|---|---|
| AI can personalise at depth | Onboarding answers directly shape the itinerary — must-dos locked, lunch timing respected, Wild Arctic as a surprise |
| Real-time disruption handling | Alert banner, two-option card, and itinerary update happen live |
| Guest stays in control | AI never acts unilaterally (Configurator/Skeptic modes). Must-dos are visually protected |
| Style adapts to the guest | Archetype switcher changes the disruption copy in real time — same facts, different tone |
| The funnel starts at purchase | Phase 0 desktop concept shows the AI can build trust before the guest even arrives |
| This scales across properties | Same architecture re-themed for MGM Grand in one session — brand-portable by design |
| It's production-realistic | React + Vite + Tailwind is a real production stack — this code could be evolved, not thrown away |

---

## 7. Demo Moments

These are the specific beats to hit in a client walkthrough:

1. **Surprise discovery** — Wild Arctic appears in the itinerary even though the family never mentioned it. The AI explains why.
2. **Booking** — All-day dining pass and Quick Queue added in one tap; confirmation sent.
3. **Disruption** — Queue spike alert fires live. Two options presented. Family chooses, plan updates.
4. **Geo moment** — (talking point) "As you walk past Penguin Trek, the app notices the queue just dropped. It asks if you want to go now and reshuffles the rest of the day." Not wired, but illustrate from the map tab.
5. **Archetype shift** — Switch between Truster / Configurator / Skeptic to show the same event handled three different ways. The Skeptic arc is the most compelling: full control at the start, earned trust by the end.

---

## 8. Suggested Demo Flow

1. Open prototype. Set archetype to **Configurator**.
2. Walk through onboarding — family with teens, Mako + Orca Encounter as must-dos, 12:30 lunch, yes to surprises, 5 PM departure.
3. Itinerary appears. Point out: locked must-dos, AI rationale on each card, Wild Arctic as a discovery.
4. Disruption banner fires. Tap it. Walk through the two options — Option A saves 45 minutes.
5. Accept Option A. Watch the itinerary re-sort with UPDATED badges.
6. Switch to **Truster**. Reload. Repeat disruption — one-tap, done, no options.
7. Switch to **Skeptic**. Repeat — full breakdown, rationale, reassurance.
8. Open Explore tab. Walk through the geo moment as a talking point.
9. Open Journey Map. Use it to anchor the broader phase conversation (Phase 0 desktop, multi-day, post-visit).

---

## 9. What's Not in the Demo (But Is in Scope)

These were confirmed in the client call as real requirements — worth naming in the presentation so they're addressed, not ignored:

- **Phase 0 — desktop pre-purchase** — not built yet, small lift to add, directly addresses Brian's ask
- **Multi-day planning** — easy to illustrate with dummy data (Fri / Sat / Sun tabs); not wired
- **Geo-location** — illustrated as a concept, not technically implemented
- **Upsell engine** — booking CTA is there; the intelligence behind it (what to offer, when) is not
- **Real queue / condition data** — all hardcoded; production would need a live data feed

---

## 10. Out of Scope (This Prototype)

- Real API integration
- Authentication or guest profile persistence
- Live queue time or booking system connectivity
- Mobile app deployment (iOS / Android)
- Accessibility audit
- Post-visit phase (email, loyalty, re-booking)
