---
title: "Validating Requests in Hono with Zod"
description: "Adding a dedicated middleware folder to validate incoming request data with Zod, on top of an existing Astro + Hono API."
slug: "validating-requests-in-hono-with-zod"
date: "2026-06-21"
tags: ['Astro', 'Hono', 'Zod', 'TypeScript']
author: "Petrus Johannes Maas"
---

# Validating Requests in Hono with Zod

## Overview

This builds on the existing Astro + Hono setup. Zod schemas define the shape of incoming data, and `@hono/zod-validator` runs that check as middleware before a route handler ever runs.

### File layout

```
src/
  server/
    app.ts                     # Hono app: routes + middleware
    middleware/
      validate-submit.ts        # zValidator middleware for /submit
```

### Install dependencies

```bash
npm install zod @hono/zod-validator
```

### Create the validation middleware

`src/server/middleware/validate-submit.ts`:

```ts
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const submitSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const validateSubmit = zValidator('json', submitSchema);
```

`zValidator` checks the request body against `submitSchema`. If it doesn't match, it returns a 400 response on its own — the route handler never runs. If it matches, the validated data is available in the handler via `c.req.valid('json')`.

### Use it in a route

`src/server/app.ts`:

```ts
import { Hono } from 'hono';
import { validateSubmit } from './middleware/validate-submit';

const app = new Hono().basePath('/api');

app.post('/submit', validateSubmit, (c) => {
  const body = c.req.valid('json');
  return c.json({ status: 'ok', received: body });
});

export default app;
```

`validateSubmit` is passed straight into the route as middleware, the same way you'd add any other check. It runs first; only valid requests reach the handler.

### Try it

```bash
npm run dev
```

A valid request:

```bash
curl -X POST http://localhost:4321/api/submit \
  -H 'Content-Type: application/json' \
  -d '{"name":"Petrus","email":"petrus@example.com"}'
```

```json
{"status":"ok","received":{"name":"Petrus","email":"petrus@example.com"}}
```

An invalid one:

```bash
curl -X POST http://localhost:4321/api/submit \
  -H 'Content-Type: application/json' \
  -d '{"name":"","email":"not-an-email"}'
```

```json
{"success":false,"error":{...}}
```

With a 400 status, and the handler never running anything past validation.

## Where to go from here

- Add more files under `src/server/middleware/`, one per route that needs validation (e.g. `validate-login.ts`)
- Validate other targets the same way — `zValidator('query', schema)` for query strings, `zValidator('param', schema)` for route params
- Pass a third argument to `zValidator` to customize the error response shape instead of using the default

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
