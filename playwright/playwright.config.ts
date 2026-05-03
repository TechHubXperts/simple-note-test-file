import { defineConfig, devices } from '@playwright/test';

// FRONTEND_URL is injected by Nomad via grader.hcl env block:
//   FRONTEND_URL = "http://${NOMAD_ADDR_frontend}"
// This resolves to the actual host:port Nomad assigned to the frontend port.
// Fallback to localhost:5173 for local development outside the grader.
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './',

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail the test suite immediately if you accidentally left test.only() in the code
  forbidOnly: !!process.env.CI,

  // No retries — each submission should be graded on first attempt only.
  // Retries would hide flaky student code and inflate scores.
  retries: 0,

  // Single worker inside the grading container.
  // Reason: the container has limited CPU (500 MHz in grader.hcl resources block).
  // Parallel workers would compete for CPU and cause flaky timing-based test failures.
  workers: 1,

  // JSON reporter so run-grader.sh can redirect output to results.json
  // Usage in run-grader.sh:
  //   npx playwright test --reporter=json > /tmp/results/results.json
  // Note: --reporter=json on the CLI overrides this setting.
  // This 'list' fallback is only used during local development.
  reporter: 'list',

  use: {
    // Use the Nomad-injected URL so the config is not hardcoded to a port.
    // Inside the grading container, this will be the actual Vite address.
    baseURL: BASE_URL,

    // How long a single action (click, fill, etc.) can take before failing.
    // 10s is generous enough for student apps without masking real slowness.
    actionTimeout: 10000,

    // Capture a trace on first retry — useful for debugging failed submissions.
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'milestone1',
      testMatch: 'milestone1.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // ─── webServer block intentionally removed ───────────────────────────────
  //
  // DO NOT add a webServer block here.
  //
  // Why: run-grader.sh (called by Nomad) already starts Vite BEFORE invoking
  // Playwright. Adding webServer would cause Playwright to either:
  //   a) Start a second Vite process → port conflict → both crash
  //   b) Ignore the existing Vite (when CI=true) and re-run the command anyway
  //
  // If you need to run tests locally without the grader:
  //   1. Start Vite manually: cd frontend && npm run dev
  //   2. Then run: npx playwright test
  // ─────────────────────────────────────────────────────────────────────────
});
