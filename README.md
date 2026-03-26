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

## Project layout

- `src/app/` — App shell, routes, pages, UI
- `src/app/contexts/LanguageContext.tsx` — English / Spanish copy and browser-based default locale
- `Dockerfile` / `docker-compose.yml` — Multi-stage Node build + nginx

## Credits

- UI patterns and components derive from [shadcn/ui](https://ui.shadcn.com/) ([MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)).
- Stock photography via [Unsplash](https://unsplash.com) ([license](https://unsplash.com/license)).
