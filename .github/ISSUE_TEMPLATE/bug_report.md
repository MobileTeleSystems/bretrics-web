---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

## Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Install `bretrics` library version X.X.X
2. Initialize monitoring with configuration
3. Observe the behavior
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Request Sample

```typescript
// Example code that demonstrates the issue
import {bretrics} from "@mts-pjsc/bretrics";

bretrics
    .setup({apiPath: "/bretrics"})
    .useDefaultMonitoring();
```

## Configuration

```json
// Environment variables or configuration
```

## Environment

- **bretrics version**: [e.g., 1.0.6]
- **Node.js version**: [e.g., 20.10.0]
- **Browser**: [e.g., Chrome 120, Firefox 121, Safari 17]
- **Operating System**: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **Build tool**: [e.g., Webpack 5, Vite 5, Rollup 4]

## Additional Context

Add any other context, screenshots, or error messages here.

## Possible Solution

If you have ideas on how to fix this, please share them.
