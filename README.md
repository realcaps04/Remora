# Remora

**One app. Every remote.**

Remora is a premium, mobile-first universal remote. This repository is the first frontend phase: a production-quality prototype with realistic mock devices, tactile remotes, and architecture ready for IR, Bluetooth, Wi-Fi, and smart-home integrations.

## Run

```bash
npm install
npm run dev
```

## Flow

1. Open Remora
2. Choose a device **category**
3. Pick a device
4. Control it with a dedicated remote

Remotes are not generic. TV, DTH, fan, AC, soundbar, lights, and plugs each have their own layout, using the same dark tactile control language.

## Stack

React, Vite, TypeScript, Tailwind CSS, Lucide React.

## Deploy (Vercel)

Import this GitHub repo in Vercel. Framework is Vite, output is `dist`.

Each new deployment writes a `version.json`. Open tabs detect it and show an **Update now** popup so users reload onto the latest build instead of a stale cache.

Opened in a browser, Remora offers **Install app** (or iPhone Add to Home Screen) so it can run like a native remote.
