# Jay Week & Day Plan

Production planning for the tea-packing lines, rebuilt with **React + Node** and **real-time** updates.

- **Week plan** (every Friday 05:00 or on demand): which sales order is produced in which week —
  1 production week + 4 packing-material (PM) weeks, within machine-line capacity and material availability.
- **Day plan** (Monday): the production week split into 12 shifts (Mon A … Sat B) per machine line and machine,
  with carry-forward of shortfalls. Supervisors enter actuals per shift and every open screen updates live.

## Stack

| Part | Technology |
|---|---|
| Front end | React 19, Vite, TypeScript, TanStack Query, React Router, Socket.IO client |
| API | Node 24, NestJS 11, Socket.IO gateway |
| Database | PostgreSQL 17 via Prisma |
| Jobs / pub-sub | Redis 7 (BullMQ jobs from phase 3) |
| Planning engines | `packages/engine` — pure TypeScript, no I/O, unit tested with Vitest |
| Monorepo | npm workspaces + Turborepo |

## Layout

```
apps/
  api/        NestJS API: REST under /api, Socket.IO, Prisma schema in prisma/schema.prisma
  web/        React app
packages/
  engine/     planWeeks(), planLine(), date helpers
  shared/     types, Zod schemas and real-time event names used by both apps
docker-compose.yml   PostgreSQL + Redis for local development
```

## First-time setup

Requirements: Node 24+, Docker Desktop (running).

```powershell
npm install
copy apps\api\.env.example apps\api\.env
npm run db:up        # starts PostgreSQL and Redis in Docker
npm run db:migrate   # creates the tables (first time: name the migration "init")
npm run dev          # API on http://localhost:3000/api, web on http://localhost:5173
```

Open http://localhost:5173. The badge in the top bar shows **Live** when the real-time connection is up, and
the Overview page shows whether the database is connected.

Other commands: `npm run build`, `npm test`, `npm run lint`, `npm run db:studio` (browse the database).

## Real-time design

The server is the single source of truth. After any change (actual entered, plan run, upload, line settings)
the API recomputes as needed and emits an event to a Socket.IO room; browsers in that room update their data.

- Rooms: `global` (everyone) and `week:<Monday>` (people viewing that production week).
- Events are typed in [`packages/shared/src/events.ts`](packages/shared/src/events.ts).
- Day-plan recomputes are serialized per week, and each carries a `version` so clients re-fetch if they miss one.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | Monorepo, Docker, Prisma schema, API + web skeleton, socket connection, CI | **done** |
| 1 | Port week and day planning rules into `packages/engine` with full rule tests | next |
| 2 | Login and roles, masters, Excel templates and uploads, plan endpoints, Excel exports | |
| 3 | Background jobs: Friday 05:00 week plan, day-plan recompute, imports | |
| 4 | React screens: machine lines, uploads, week plan, 12-shift day-plan grid | |
| 5 | Live updates: events, presence, cell locks, reconnect handling, Redis adapter | |
| 6 | Audit log, end-to-end tests, load test, monitoring, deployment | |
| 7 | Optional: machine counts from MES / MQTT feed the day plan automatically | |

## Open questions for the client

- Flavour-tea machines formula: currently ceil(tea bags ÷ (capacity per shift × 12)).
- Plan horizon: 5 weeks (1 + 4 PM, guideline sheet) or 4 weeks (BRD) — `PM_WEEKS` setting.
- Variety packs: loose tea bags only for now; CFC/CTN variety planning not defined.
- Tie-breaker after ship date and priority: earliest PO date.
