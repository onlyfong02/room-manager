---
description: How to run and restart the Room Manager project
---

# Running Room Manager Project

## Backend (NestJS)
// turbo
```bash
cd e:\Project\room-manager\backend
npm run start:dev
```

## Frontend (React + Vite)
// turbo
```bash
cd e:\Project\room-manager\frontend
npm run dev
```

## Build Backend
// turbo
```bash
cd e:\Project\room-manager\backend
yarn build
```

## Build Frontend
// turbo
```bash
cd e:\Project\room-manager\frontend
npm run build
```

## Restart Both Servers
If servers are already running with watch mode (`npm run start:dev` / `npm run dev`), they will automatically reload when files change.

If manual restart is needed:
1. Stop current processes (Ctrl+C)
2. Run the start commands above

## Important Notes
- Backend runs on: http://localhost:3000/api
- Frontend runs on: http://localhost:5173
- After making backend changes, the dev server auto-reloads
- After making frontend changes, Vite hot reloads automatically
