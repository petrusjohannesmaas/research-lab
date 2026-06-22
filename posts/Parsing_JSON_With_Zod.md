---
title: "Parsing JSON with Zod"
description: "A practical guide to validating JSON data in TypeScript using Zod schemas."
slug: "zod-json-parsing"
date: "2026-06-21"
tags: ['TypeScript', 'Zod', 'Validation', 'JSON']
author: "Petrus Johannes Maas"
---

# Parsing JSON with Zod

## Overview

Zod solves a critical gap in TypeScript development: `JSON.parse()` returns
`any`, which can lead to silent type mismatches. Zod enforces runtime
validation and guarantees that parsed data conforms to the expected shape.
This guide demonstrates installation, schema definition, parsing, error
handling, and nested structures.

### 1. Configuration

To test your Zod setup, you’ll want a minimal TypeScript project with a clean structure. Here’s a practical way to spin it up:

#### Initialize the project
```bash
mkdir zod-test && cd zod-test
npm init -y
```

#### Add dependencies
```bash
npm install zod
npm install -D typescript tsx @types/node
```

#### Configure TypeScript
Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

#### Project structure
```
zod-test/
  ├── schema.ts       # Zod schemas
  ├── main.ts         # Entry point
  ├── tsconfig.json
  └── package.json
```

### 2. Define a schema

`schema.ts`:

```ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
});

export type User = z.infer<typeof UserSchema>;
```

### 3. Parse JSON safely

`main.ts`:

```ts
import { UserSchema } from './schema';

const raw = '{"id": 1, "name": "Petrus", "email": "petrus@example.com"}';
const data = JSON.parse(raw);

const user = UserSchema.parse(data);
console.log(user.name);
```

Run:

```bash
npx tsx main.ts
```

### 4. Handle invalid data

You can incorporate the `safeParse` block directly into your `main.ts` so that your project gracefully handles invalid JSON. Here’s how to wire it in:

#### Updated `main.ts`
```ts
import { UserSchema } from './schema';

const raw = '{"id": 1, "name": "Petrus", "email": "petrus@example.com"}';
const data = JSON.parse(raw);

// Use safeParse instead of parse
const result = UserSchema.safeParse(data);

if (!result.success) {
  console.log("Validation failed:");
  console.log(result.error.issues);
  // Example output: [{ path: ['email'], message: 'Invalid email', ... }]
} else {
  console.log("Validation succeeded:");
  console.log(result.data.name); // typed as string
}
```

- **safeParse** returns an object with a `success` flag.
- If `success` is `false`, you get a structured list of issues (`path`, `message`, etc.).
- If `success` is `true`, `result.data` is guaranteed to match your schema type.

#### Typical workflow
1. Define schema in `schema.ts`.
2. Parse JSON with `safeParse` in `main.ts`.
3. Branch logic:
   - On failure: log or return a 400 response in an API.
   - On success: safely use `result.data`.

This pattern is especially useful when building APIs or CLI tools where you don’t want the program to crash on bad input. You can now extend your project to test invalid cases by deliberately breaking the JSON (e.g., wrong type for `email`) and observing the error output.

#### 5. Nested and array shapes

Define a schema with nested objects and arrays in `schema.ts`:

```ts
import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  author: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type Post = z.infer<typeof PostSchema>;
```

Update `main.ts` to test it:

```ts
import { PostSchema } from './schema';

const raw = `{
  "title": "First Post",
  "tags": ["zod", "typescript"],
  "author": { "id": 1, "name": "Petrus" }
}`;

const data = JSON.parse(raw);

const result = PostSchema.safeParse(data);

if (!result.success) {
  console.log("Validation failed:");
  console.log(result.error.issues);
} else {
  console.log("Validation succeeded:");
  console.log(result.data.author.name); // typed as string
}
```

Run it:

```bash
npx tsx main.ts
```

This way you can confirm Zod correctly validates both arrays and nested objects. 

### Comparison

| Without Zod | With Zod |
|---|---|
| `JSON.parse(raw) as User` — unsafe | `UserSchema.parse(raw)` — validated |
| Manual type checks per field | One schema, one `.parse()` |
| Types and validation drift apart | Schema is single source of truth |

### Next Steps

- Break JSON intentionally and inspect `result.error.issues`.
- Compare `z.string().optional()` vs `z.string().nullable()`.

**Disclaimer & Intent**:  
This project was developed for research and portfolio purposes. The primary
goal is to explore architectural patterns and software systems. It is
provided for educational and demonstration purposes.

**License**:  
Copyright © 2026 Petrus Johannes Maas [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Fpetrusjohannesmaas")  
Licensed under the Apache License, Version 2.0.  
`http://www.apache.org/licenses/LICENSE-2.0` [(apache.org in Bing)](https://www.bing.com/search?q="http%3A%2F%2Fwww.apache.org%2Flicenses%2FLICENSE-2.0")

**Third-Party Attribution**:  
All included dependencies and libraries are the property of their respective
owners and are used according to their original licensing terms.
