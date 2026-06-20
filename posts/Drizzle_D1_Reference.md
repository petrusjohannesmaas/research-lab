# Astro + Preact + Drizzle/D1: Reference

D1 only exists as a Cloudflare binding — there's no local file to point
Drizzle at like there is with better-sqlite3. So this version runs through
the Cloudflare adapter and `wrangler` from the start, even for local dev.
Same counter as before, new backend.

## 1. New project

```bash
npm create astro@latest preact-d1-test -- --template minimal --typescript strict
cd preact-d1-test
npx astro add preact -y
npx astro add cloudflare -y
```

## 2. Create the D1 database

```bash
npx wrangler d1 create counter-db
```

Note the `database_id` it prints.

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "preact-d1-test",
  "compatibility_date": "2026-06-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "counter-db",
      "database_id": "<paste-the-id-here>"
    }
  ]
}
```

## 3. Install Drizzle

```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

## 4. Schema

`src/db/schema.ts`:

```ts
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const counter = sqliteTable('counter', {
  id: integer('id').primaryKey(),
  count: integer('count').notNull().default(0),
});
```

## 5. Drizzle config

D1 migrations are generated locally but applied through `wrangler`, not
`drizzle-kit migrate` — that's the main difference from the SQLite version.

`drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
```

```bash
echo "CLOUDFLARE_ACCOUNT_ID=..." >> .env
echo "CLOUDFLARE_D1_ID=..." >> .env
echo "CLOUDFLARE_API_TOKEN=..." >> .env
```

(account ID and API token from the Cloudflare dashboard; token needs D1 edit
permission)

## 6. Generate and apply the migration

```bash
npx drizzle-kit generate
npx wrangler d1 migrations apply counter-db --local   # for astro dev
npx wrangler d1 migrations apply counter-db --remote  # for the deployed site
```

## 7. Seed one row

D1's local mode is queryable straight through `wrangler`:

```bash
npx wrangler d1 execute counter-db --local --command "INSERT INTO counter (id, count) VALUES (1, 0)"
```

## 8. DB helper

Astro 6 reads Cloudflare bindings via `cloudflare:workers`, not
`Astro.locals.runtime.env`.

`src/lib/db.ts`:

```ts
import { drizzle } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import * as schema from '../db/schema';

export const db = drizzle(env.DB, { schema });
```

## 9. API route

`src/pages/api/count.ts`:

```ts
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../lib/db';
import { counter } from '../../db/schema';

export const GET: APIRoute = async () => {
  const row = await db.select().from(counter).where(eq(counter.id, 1)).get();
  return new Response(JSON.stringify({ count: row?.count ?? 0 }));
};

export const POST: APIRoute = async () => {
  const row = await db.select().from(counter).where(eq(counter.id, 1)).get();
  const next = (row?.count ?? 0) + 1;
  await db.update(counter).set({ count: next }).where(eq(counter.id, 1));
  return new Response(JSON.stringify({ count: next }));
};
```

## 10. Preact component

`src/components/Counter.tsx`:

```tsx
import { useState, useEffect } from 'preact/hooks';

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/count')
      .then((r) => r.json())
      .then((data) => setCount(data.count));
  }, []);

  async function increment() {
    const res = await fetch('/api/count', { method: 'POST' });
    const data = await res.json();
    setCount(data.count);
  }

  if (count === null) return <button disabled>Loading...</button>;

  return <button onClick={increment}>Clicked {count} times</button>;
}
```

`src/pages/index.astro`:

```astro
---
import Counter from '../components/Counter';
---
<html>
  <body>
    <h1>D1-backed counter</h1>
    <Counter client:load />
  </body>
</html>
```

## 11. Run it

```bash
npm run dev
```

`astro dev` runs through the Cloudflare adapter's local D1 proxy, so this
reads/writes the `--local` database from step 6 — no need for `wrangler dev`
separately during normal development.

Click the button, refresh — count persists, same as the SQLite version, but
now backed by D1.

## What changed vs. the local SQLite version

| SQLite (better-sqlite3) | D1 |
|---|---|
| `new Database('counter.db')` | Cloudflare binding via `wrangler.jsonc` |
| `drizzle-kit migrate` applies directly | `wrangler d1 migrations apply` (local and remote separately) |
| File lives in the project folder | Local: SQLite file under `.wrangler/`. Remote: Cloudflare's edge |
| No deploy step needed to test | Same code runs locally and in production through the same adapter |

## Worth poking at next

- `npx wrangler d1 execute counter-db --local --command "SELECT * FROM counter"`
  to peek at the row directly.
- Deploy with `npx wrangler pages deploy` and confirm the `--remote` database
  is what the live site reads from — it's a separate copy of the data from
  `--local`.
