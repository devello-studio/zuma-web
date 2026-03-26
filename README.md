# Zuma Web

Marketing site for **Zuma Solutions**: Vite, React, React Router, Tailwind CSS, and Dockerized static production builds.

## Requirements

- Node.js 20+ (22 matches the Docker image)
- npm

## Development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
```

Output is written to `dist/`. Preview locally:

```bash
npm run preview
```

## Docker

Build and run with Compose (serves `dist` via nginx on port **8080**):

```bash
docker compose up -d --build
```

Then open `http://localhost:8080`.

## Vercel (production)

This repo is set up for **[Vercel](https://vercel.com/)** as the primary host: static **Vite** build from `dist/`, with SPA **rewrites** so React Router paths (e.g. `/consulta-gratuita`) work on refresh.

1. Push the repo to GitHub (or GitLab / Bitbucket).
2. In Vercel: **Add New Project** → import the repo.
3. Leave defaults: **Framework Preset** Vite (or “Other” with build `npm run build`, output `dist` — already declared in `vercel.json`).
4. Deploy. Add your **custom domain** under Project → Settings → Domains.

Future **serverless API routes** (e.g. form handlers under `/api`) are matched before the SPA rewrite, so you can add `api/` without changing `vercel.json`.

The local **`.vercel`** folder (from `vercel link`) is gitignored.

## Project layout

- `src/app/` — App shell, routes, pages, UI
- `src/app/contexts/LanguageContext.tsx` — English / Spanish copy and browser-based default locale
- `Dockerfile` / `docker-compose.yml` — Multi-stage Node build + nginx

## Credits

- UI patterns and components derive from [shadcn/ui](https://ui.shadcn.com/) ([MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)).
- Stock photography via [Unsplash](https://unsplash.com) ([license](https://unsplash.com/license)).
