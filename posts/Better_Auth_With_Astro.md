```md
---
title: "Better Auth with Astro & SQLite"
description: "A step-by-step guide to integrating Better Auth email/password authentication into an Astro project using a SQLite database."
slug: "better-auth-astro-sqlite"
date: "2026-06-26"
tags: ['Authentication', 'Astro', 'SQLite', 'TypeScript', 'Better Auth']
author: "Petrus Johannes Maas"
---

# Better Auth with Astro & SQLite

## Overview

This guide covers integrating [Better Auth](https://better-auth.com) into an Astro project with email and password authentication, backed by a local SQLite database. Better Auth requires server-side request handling, so SSR mode must be enabled in Astro.

### Prerequisites

- An existing Astro project
- Node.js 18+
- Basic familiarity with TypeScript

---

### Step 1 — Install Dependencies

```bash
npm install better-auth @better-auth/cli better-sqlite3
npm install -D @types/better-sqlite3
```

---

### Step 2 — Enable SSR in Astro

Better Auth requires server-side rendering. Open `astro.config.mjs` and set the `output` option:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
});
```

If you are deploying to a platform like Vercel or Cloudflare, install and configure the appropriate Astro adapter as well.

---

### Step 3 — Create the Auth Instance

Create `src/lib/auth.ts` to configure the server-side auth instance:

```ts
import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  database: new Database('./database.db'),
  emailAndPassword: {
    enabled: true,
  },
  secret: import.meta.env.BETTER_AUTH_SECRET,
  baseURL: import.meta.env.BETTER_AUTH_URL,
});
```

The SQLite file (`database.db`) is created automatically after running the migration in the next steps.

---

### Step 4 — Configure Environment Variables

Create or update your `.env` file at the project root:

```env
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:4321
PUBLIC_BETTER_AUTH_URL=http://localhost:4321
```

Generate a strong secret by running:

```bash
npx @better-auth/cli secret
```

> The `PUBLIC_` prefix is required for any variable exposed to the Astro client side.

---

### Step 5 — Run the Database Migration

Better Auth generates all required tables (user, session, account, verification) automatically:

```bash
npx @better-auth/cli migrate
```

Run this once after initial setup, and again any time you add plugins that introduce new schema fields.

---

### Step 6 — Create the API Route

Better Auth uses a single catch-all route to handle all auth endpoints. Create `src/pages/api/auth/[...all].ts`:

```ts
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};
```

This one file covers sign-up, sign-in, sign-out, session management, and more.

---

### Step 7 — Create the Auth Client

Create `src/lib/auth-client.ts` for use in frontend components and pages:

```ts
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_BETTER_AUTH_URL ?? 'http://localhost:4321',
});
```

---

### Step 8 — Build an Auth Page

Create `src/pages/auth.astro` with a simple sign-up and sign-in form:

```astro
---
// src/pages/auth.astro
---

<html>
  <body>
    <h2>Sign Up</h2>
    <input id="email" type="email" placeholder="Email" />
    <input id="password" type="password" placeholder="Password" />
    <button id="signup">Sign Up</button>

    <h2>Sign In</h2>
    <button id="signin">Sign In</button>

    <script>
      import { authClient } from '../lib/auth-client';

      document.getElementById('signup')?.addEventListener('click', async () => {
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const { data, error } = await authClient.signUp.email({ email, password, name: email });
        if (error) alert(error.message);
        else alert('Signed up: ' + data?.user.email);
      });

      document.getElementById('signin')?.addEventListener('click', async () => {
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const { data, error } = await authClient.signIn.email({ email, password });
        if (error) alert(error.message);
        else window.location.href = '/dashboard';
      });
    </script>
  </body>
</html>
```

---

### Step 9 — Protect a Page Server-Side

Use `auth.api.getSession` in any Astro page frontmatter to guard access:

```astro
---
// src/pages/dashboard.astro
import { auth } from '../lib/auth';

const session = await auth.api.getSession({ headers: Astro.request.headers });

if (!session) {
  return Astro.redirect('/auth');
}
---

<h1>Welcome, {session.user.email}!</h1>
```

---

### File Structure Summary

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Server auth instance with SQLite config |
| `src/lib/auth-client.ts` | Client-side auth methods |
| `src/pages/api/auth/[...all].ts` | Catch-all API route for all auth endpoints |
| `.env` | Secret key and base URLs |
| `database.db` | Auto-created SQLite database after migration |

---

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
```
