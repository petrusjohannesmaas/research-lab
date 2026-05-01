---
title: "How to Set Up a Gemini CLI Agent Skill"
description: "A concise guide to creating and testing a custom Gemini CLI agent skill using a simple JavaScript function example."
slug: "setup-gemini-cli-agent-skill"
date: "2026-05-01"
tags: ['Gemini CLI', 'Agent Skills', 'JavaScript', 'Tutorial']
author: "Petrus Johannes Maas"
---
# How to Set Up a Gemini CLI Agent Skill

## Overview
This guide walks you through creating a custom agent skill for Gemini CLI using a minimal JavaScript function. Skills extend Gemini CLI with task-specific logic, enabling reusable, scoped expertise. We'll build a `string-utils` skill that formats and analyzes text—a practical, beginner-friendly example.

Follow the steps below to scaffold, configure, and test your skill. All commands assume you're working in a project root with Gemini CLI installed.

### Prerequisites
- Gemini CLI installed and authenticated
- Node.js 18+ (for executing JavaScript skills)
- Basic familiarity with terminal commands and YAML frontmatter

### Step 1: Create the Skill Directory
Skills live in `.gemini/skills/` (workspace) or `~/.gemini/skills/` (user). For this example, we'll use the workspace location:

```bash
mkdir -p .gemini/skills/string-utils/scripts
```

### Step 2: Define the Skill (`SKILL.md`)
Create `.gemini/skills/string-utils/SKILL.md` with YAML frontmatter and instructions:

```markdown
---
name: string-utils
description:
  Utilities for string manipulation: count words, reverse text, or format case.
  Trigger when the user asks to "format", "count", "reverse", or "analyze" text.
---

# String Utils Instructions

You are a text-processing assistant. When this skill is active:

1. **Identify** the requested operation (word count, reverse, case format).
2. **Execute** the corresponding script from `scripts/` with the user's input.
3. **Return** the result clearly, noting any input constraints.

Use only the bundled scripts—do not invent new operations.
```

> **Note**: The `description` field is critical. Gemini uses it to match user queries to skills. Be specific about trigger keywords.

### Step 3: Add the JavaScript Logic
Create `.gemini/skills/string-utils/scripts/format.js`:

```javascript
// .gemini/skills/string-utils/scripts/format.js
const [operation, input] = process.argv.slice(2);

if (!operation || !input) {
  console.error('Usage: node format.js <operation> <text>');
  console.error('Operations: count, reverse, upper, lower');
  process.exit(1);
}

const ops = {
  count: (str) => `Word count: ${str.trim().split(/\s+/).length}`,
  reverse: (str) => str.split('').reverse().join(''),
  upper: (str) => str.toUpperCase(),
  lower: (str) => str.toLowerCase(),
};

if (!ops[operation]) {
  console.error(`Unknown operation: ${operation}`);
  process.exit(1);
}

console.log(ops[operation](input));
```

This script handles four deterministic operations. It validates input, executes the requested transformation, and outputs the result—ideal for skill-based automation.

### Step 4: Test the Skill
1. Start a Gemini CLI session.
2. Prompt: *"Can you reverse the string 'hello world'?"*
3. Gemini matches the query to `string-utils` (via `description`), requests activation approval.
4. Upon approval, it executes:
   ```bash
   node .gemini/skills/string-utils/scripts/format.js reverse "hello world"
   ```
5. Output: `dlrow olleh`

To verify skill registration anytime:
```bash
/skills
```

### Step 5: Optional – Share or Reuse
- **Workspace**: Commit `.gemini/skills/string-utils/` to your repo for team use.
- **User-wide**: Move to `~/.gemini/skills/` for global availability.
- **Distribute**: Package as a Git repo and install via:
  ```bash
  gemini skills install https://github.com/yourname/gemini-skill-string-utils
  ```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Skill not triggering | Verify `description` includes relevant keywords; restart CLI session |
| Script fails to run | Ensure Node.js is in PATH; check script permissions (`chmod +x` if needed) |
| `/skills` doesn't list skill | Confirm directory structure matches `.gemini/skills/<skill-name>/SKILL.md` |

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
