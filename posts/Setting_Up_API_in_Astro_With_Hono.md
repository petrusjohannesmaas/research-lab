---
title: "Setting Up an API in Astro with Hono"
description: "A walkthrough of mounting a Hono API inside an Astro project, then extending it with logging and error-handling middleware."
slug: "setting-up-an-api-in-astro-with-hono"
date: "2026-06-21"
tags: ['Astro', 'Hono', 'TypeScript']
author: "Petrus Johannes Maas"
---

# Setting Up an API in Astro with Hono

## Overview

This guide sets up a Hono API inside an Astro project, then extends it with middleware so you can see how requests flow through it before reaching a route handler.

### File layout

```
src/
  server/
    app.ts              # Hono app: routes + middleware live here
  pages/
    api/
      [...path].ts       # Astro catch-all, hands requests to Hono
astro.config.mjs          # needs output: 'server'
```

Keeping the Hono app in `src/server/` rather than `src/api/` avoids having two differently-purposed folders both named `api` — `src/pages/api/` is fixed by Astro's router, but the Hono app itself can live anywhere.

### Enable server output

API routes need Astro running in server mode, not static. In `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
});
```

Without this, `src/pages/api/` routes won't run — Astro will try to prerender them as static files instead.

### Install Hono

```bash
npm install hono
```

### Create the Hono app

`src/server/app.ts`:

```ts
import { Hono } from 'hono';

const app = new Hono().basePath('/api');

app.get('/', (c) => c.text('Hello from Hono API!'));

export default app;
```

`.basePath('/api')` matters: it must match the directory the catch-all route lives in (`src/pages/api/`). Without it, Hono tries to match routes against the full path including `/api`, and nothing resolves.

### Wire it into Astro

`src/pages/api/[...path].ts`:

```ts
import type { APIRoute } from 'astro';
import app from '../../server/app';

export const ALL: APIRoute = ({ request }) => app.fetch(request);
```

Two things have to be exact here:

- The filename `[...path].ts` creates a catch-all route, so every request under `/api/*` reaches this file.
- The export must be `ALL` (uppercase). Astro only recognizes uppercase HTTP method exports (`GET`, `POST`, `ALL`, etc) — `all` is silently ignored.

### Add a JSON route

Back in `src/server/app.ts`, add another route below the first:

```ts
app.get('/json', (c) => c.json({ message: 'Hello JSON' }));
```

### Run it

```bash
npm run dev
```

In another terminal:

```bash
curl http://localhost:4321/api/
curl http://localhost:4321/api/json
```

You should get back `Hello from Hono API!` and `{"message":"Hello JSON"}`.

At this point you have a working API. The rest of this guide adds middleware on top of it.

## Extending it: middleware

### Logging middleware

Add this to `src/server/app.ts`, right after the app is created and before any routes:

```ts
app.use('*', async (c, next) => {
  console.log(`[LOG] ${c.req.method} ${c.req.path}`);
  await next();
});
```

`app.use('*', ...)` matches every route. Calling `next()` passes control to whatever's next in the chain — another middleware, or the route handler itself.

### onError middleware

`app.onError()` catches any exception thrown inside a route, in one place, instead of needing try/catch in every handler. Add it near the bottom of `src/server/app.ts`, after your routes:

```ts
app.onError((err, c) => {
  console.error(`[ERROR] ${c.req.path}:`, err.message);
  return c.json({ error: 'Something went wrong' }, 500);
});
```

To see it fire, add a route that throws:

```ts
app.get('/boom', () => {
  throw new Error('mock failure');
});
```

Your full `src/server/app.ts` should now read, top to bottom: the import and `app` creation, the logging middleware, the routes (`/`, `/json`, `/boom`), then `app.onError()`, then `export default app`.

### Try it

```bash
curl http://localhost:4321/api/
curl http://localhost:4321/api/json
curl http://localhost:4321/api/boom
```

Check the terminal running `npm run dev`:

- `GET /api/` → `[LOG] GET /`
- `GET /api/json` → `[LOG] GET /json`
- `GET /api/boom` → `[LOG] GET /boom` then `[ERROR] /boom: mock failure`

The `/boom` request itself gets back `{"error":"Something went wrong"}` with a 500 status, instead of an unhandled exception.

(Hono strips the `/api` base path from `c.req.path`, so logs show paths relative to the API root, not the full URL.)

## Where to go from here

Same pattern, more additions to `src/server/app.ts`:

- Auth middleware that checks a token before letting requests through
- Request timing, by wrapping `next()` and logging the elapsed time
- Request IDs (`hono/request-id`) so a single request is traceable across log lines

**Disclaimer & Intent**:
This project was developed for research and portfolio purposes. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

**License**:
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)
Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

**Third-Party Attribution**:
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.
