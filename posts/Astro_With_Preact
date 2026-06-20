---
title: "Astro, Preact, & Selective Hydration"
description: "A short hands-on guide to wiring Preact into an Astro project and seeing island hydration in action."
slug: "astro-preact-selective-hydration"
date: "2026-06-20"
tags: ['Astro', 'Preact', 'Hydration']
author: "Petrus Johannes Maas"
---
# Astro, Preact, & Selective Hydration

## Overview

Astro ships zero JS by default and only hydrates the components you mark as
interactive — these are called islands. This post walks through setting up
Preact as the island framework, building a small counter component, and
confirming it actually ships less JS than the React equivalent would.

### 1. New project

```bash
npm create astro@latest preact-test -- --template minimal --typescript strict
cd preact-test
npx astro add preact -y
```

That installs `@astrojs/preact` and wires it into `astro.config.mjs`
automatically.

### 2. Make a Preact component

`src/components/Counter.tsx`:

```tsx
import { useState } from 'preact/hooks';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### 3. Drop it into a page

`src/pages/index.astro`:

```astro
---
import Counter from '../components/Counter';
---
<html>
  <body>
    <h1>Static HTML around me</h1>
    <Counter client:load />
  </body>
</html>
```

`client:load` is what hydrates it — without it, Astro renders the component
to static HTML and ships zero JS for it.

### 4. Run it

```bash
npm run dev
```

Open `http://localhost:4321` and click the button.

**What to check in devtools:** look at the Network tab — you should see a
tiny JS chunk (a few KB) rather than a React-sized bundle. That's the whole
point of using Preact here.

### Things worth poking at next

- Try `client:visible` instead of `client:load` on the Counter — it'll only
  hydrate when scrolled into view.
- Try importing a second Preact component into the same page to see islands
  work independently.

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
