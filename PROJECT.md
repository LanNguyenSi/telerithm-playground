# telerithm-playground

Interactive demo experience for [Telerithm](https://github.com/LanNguyenSi/telerithm).

## Problem

Someone visits telerithm.cloud, registers, and sees an empty dashboard. No logs, no context, no reason to stay. They leave and never come back.

## Solution

Two things:

### 1. Demo Team (auto-join)
- Pre-seeded team with realistic log data
- New users can "Join Demo Team" with one click
- Read-only access — browse dashboard, try AI queries, see alerts
- Continuously fed with fresh logs so it never feels stale

### 2. Playground (interactive)
- Public page at `telerithm.cloud/playground` or `play.telerithm.cloud`
- Buttons that trigger real log events:
  - 🔴 Auth Error
  - 🟡 Rate Limit Warning
  - 🟢 100 Normal Logs
  - 💥 Simulate Incident
  - 📈 Traffic Spike
- Logs appear instantly in a live-tail panel on the same page
- Split view: left = buttons, right = live log stream
- Optional: AI query bar at the bottom — type "show errors" and see results

## Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Playground UI      │────→│   Telerithm API      │
│   (Next.js or SPA)   │     │   /api/v1/ingest     │
│                      │←────│   /api/v1/stream/logs │
│   Buttons + LiveTail │     │   (SSE)               │
└──────────────────────┘     └──────────────────────┘
```

The playground is a thin client. It:
1. Sends logs to telerithm's ingestion API (via SDK or HTTP)
2. Subscribes to SSE stream to show live results
3. Optionally calls the natural query endpoint

No separate backend needed — it talks directly to the existing telerithm deployment.

## Components

### Playground UI (`/playground`)
- **TriggerPanel** — Grid of scenario buttons
- **LiveTail** — Real-time log stream (SSE)
- **QueryBar** — Natural language search (optional)
- **ScenarioRunner** — Generates realistic log sequences per scenario

### Demo Team Seeder (backend task or cron)
- Creates "demo" team on first boot
- Seeds 1000+ realistic logs across 5 services
- Refreshes every hour with new logs
- Generates sample alerts and incidents

### Scenarios
Each button triggers a predefined log sequence:

| Scenario | Logs Generated | Duration |
|----------|---------------|----------|
| Auth Error | 5 logs (login attempt → fail → retry → fail → lockout) | instant |
| Rate Limit | 10 logs (requests → warning → 429 → backoff → recovery) | 2s |
| Normal Traffic | 100 logs across 3 services | 5s stream |
| Incident | 20 logs (degradation → errors → alert → recovery) | 5s |
| Traffic Spike | 200 logs (ramp up → peak → cool down) | 10s |

## Tech Stack

- **Frontend:** Next.js (consistent with telerithm) or plain React SPA
- **Styling:** Tailwind CSS
- **Log Delivery:** telerithm JS SDK (`@telerithm/sdk-js`)
- **Live View:** EventSource (SSE) to telerithm streaming API
- **Deployment:** Same VPS, behind Traefik (`play.telerithm.cloud`)

## Milestones

### M1 — Demo Team (backend-side, in telerithm repo)
- [ ] Auto-create demo team + source on startup
- [ ] Seed script with realistic multi-service logs
- [ ] "Join Demo" button on login/register page
- [ ] Read-only role for demo members

### M2 — Playground MVP
- [ ] Trigger panel with 3 scenarios (auth error, normal, incident)
- [ ] Live-tail panel showing results
- [ ] Deploy behind Traefik
- [ ] Link from landing page + telerithm dashboard

### M3 — Polish
- [ ] All 5 scenarios
- [ ] AI query bar integration
- [ ] Mobile-responsive layout
- [ ] Rate-limit triggers (prevent abuse)
- [ ] Analytics: track which scenarios users click most
