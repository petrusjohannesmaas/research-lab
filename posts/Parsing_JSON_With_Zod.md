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

### 1. Install

```bash
npm install zod
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

```ts
const result = UserSchema.safeParse(data);

if (!result.success) {
  console.log(result.error.issues);
} else {
  console.log(result.data.name);
}
```

### 5. Nested and array shapes

```ts
const PostSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  author: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

const result = PostSchema.safeParse(JSON.parse(someApiResponse));
```

### Comparison

| Without Zod | With Zod |
|---|---|
| `JSON.parse(raw) as User` — unsafe | `UserSchema.parse(raw)` — validated |
| Manual type checks per field | One schema, one `.parse()` |
| Types and validation drift apart | Schema is single source of truth |

### Next Steps

- Break JSON intentionally and inspect `result.error.issues`.
- Compare `z.string().optional()` vs `z.string().nullable()`.

---

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
