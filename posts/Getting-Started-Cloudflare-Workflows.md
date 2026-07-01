---
title: "Getting Started with Cloudflare Workflows"
description: "A minimal introduction to Cloudflare Workflows: how to scaffold a project, implement a Workflow from scratch, and make HTTP requests from inside a workflow step."
slug: "getting-started-with-cloudflare-workflows"
date: "2026-07-01"
tags: ['Cloudflare', 'Workflows', 'TypeScript']
author: "Petrus Johannes Maas"
---

# Getting Started with Cloudflare Workflows

## Overview

Cloudflare Workflows is a Workers feature that lets you write durable, multi-step processes. Each step is checkpointed — if something crashes mid-run the workflow resumes from where it left off rather than starting over.

This guide covers scaffolding a project, registering a Workflow, and making an HTTP request from inside a workflow step.

### File layout

```
src/
  index.ts          # Worker fetch handler + Workflow class
wrangler.jsonc      # Cloudflare Worker config
```

## 1. Scaffold the project

```bash
npm create cloudflare@latest my-worker
cd my-worker
```

Select **Worker only** when prompted for a template.

Then generate the TypeScript environment types:

```bash
npm run cf-typegen
```

This produces `worker-configuration.d.ts`, which gives you the typed `Env` interface that reflects your bindings from `wrangler.jsonc`. Re-run this whenever you add or change bindings.

## 2. Register the Workflow in Wrangler

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-07-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "workflows": [
    {
      "name": "my-workflow",
      "binding": "MY_WORKFLOW",
      "class_name": "MyWorkflow"
    }
  ]
}
```

Three fields matter in the `workflows` entry:

- `name` — the workflow's name in Cloudflare's system
- `binding` — how you reference it in code via `env.MY_WORKFLOW`
- `class_name` — must match the exported class name in your Worker

After editing `wrangler.jsonc`, re-run `npm run cf-typegen` to keep `Env` in sync.

## 3. Implement the Workflow

A Workflow is a class that extends `WorkflowEntrypoint`. Its `run` method receives the triggering event and a `step` object used to define durable steps.

`src/index.ts`:

```ts
import { WorkflowEntrypoint, WorkflowStep } from "cloudflare:workers";
import type { WorkflowEvent } from "cloudflare:workers";

type Params = { message?: string };

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {

    // Step 1: fetch from an external endpoint
    const firstResponse = await step.do("first fetch", async () => {
      const res = await fetch("https://example.com/api/health");
      const text = await res.text();
      console.log("Step 1 response:", text);
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    });

    // Step 2: pause before continuing
    await step.sleep("wait 5 seconds", "5 seconds");

    // Step 3: use the result from step 1
    const secondResponse = await step.do("second fetch", async () => {
      const res = await fetch("https://example.com/api/health");
      const text = await res.text();
      console.log("Step 2 response:", text);
      return JSON.parse(text);
    });

    console.log("Step 3: Done!");
    return secondResponse;
  }
}
```

### How `step.do` works

Each `step.do("name", async () => { ... })` call is a durable checkpoint. If the Worker crashes or is evicted mid-workflow, it resumes from the last completed step — it won't re-run steps that already finished. The return value of each step is serialized and stored so later steps can reference it.

`step.sleep("name", duration)` pauses the workflow for the given duration without consuming CPU — the workflow suspends entirely and is resumed by Cloudflare's scheduler.

### Passing parameters

`event.payload` contains whatever parameters were passed when the workflow was created (typed via `Params`). Use these to pass context from the trigger into the workflow, such as a user ID, a job type, or a message.

## 4. Add the HTTP trigger

The Worker's `fetch` handler is the entry point for incoming HTTP requests. Add a `POST /start` route that creates a workflow instance:

`src/index.ts` (continued, below the class):

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/start" && request.method === "POST") {
      const instance = await env.MY_WORKFLOW.create({
        params: { message: "triggered from HTTP" },
      });
      return Response.json({ instanceId: instance.id });
    }

    return new Response("POST to /start to trigger the workflow");
  },
};
```

`env.MY_WORKFLOW.create()` starts a new workflow instance asynchronously and returns an `instanceId`. The workflow runs in the background — the HTTP response comes back immediately without waiting for the workflow to finish.

## 5. Run it locally

```bash
npm run dev
```

In another terminal, trigger the workflow:

```bash
curl -X POST http://localhost:8787/start
```

You'll get back:

```json
{ "instanceId": "abc-123-def" }
```

Watch the terminal running `npm run dev` — console output from each step appears as the workflow progresses, with the 5-second gap visible between steps 1 and 2.

## 6. Inspect with the Workflow Explorer

Cloudflare provides a local visual debugger for Workflows. With `npm run dev` running, open:

```
http://localhost:8787/cdn-cgi/explorer/
```

This shows running and completed workflow instances, their current step, status, and output at each checkpoint. It's the fastest way to see what a workflow is doing without reading raw logs — especially useful once workflows have more than a few steps.

## Where to go from here

- Add retry config to `step.do` for unreliable operations: `{ retries: { limit: 3, delay: "5 seconds", backoff: "linear" } }`
- Pass richer `Params` to carry context through the whole workflow (user IDs, job type, input data)
- Add a `GET /status` route that calls `env.MY_WORKFLOW.get(instanceId)` to check on a running instance
- Bind D1, KV, or R2 in `wrangler.jsonc` and access them via `this.env` inside the Workflow class — the same `Env` interface covers both the fetch handler and the workflow

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
