# Minimal Todo App

A small Vite + React task list for the current browser session. Add tasks with the **Add** button or Enter, mark them complete, and delete them individually. Tasks are held in React memory and intentionally do not survive a page reload.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```sh
cd frontend
npm install
npm run dev
```

## Verify

```sh
cd frontend
npm test
npm run build
npm run e2e
```

The component tests use Vitest and Testing Library. The browser journey uses Playwright and starts the Vite server automatically. On a fresh sandbox, install the Playwright Chromium browser with `node node_modules/@playwright/test/cli.js install chromium` from `frontend/` before running E2E.
