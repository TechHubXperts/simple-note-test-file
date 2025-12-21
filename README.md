# Simple Note App - Test Files

This repository contains **only Playwright E2E tests** for the Simple Note App.

**Note:** Subtask tests (unit tests) are included in the starter files repository. This repository is used in CI/CD to run E2E tests against student implementations.

## Project Structure

```
simple-note-test-file/
└── playwright/       # End-to-end tests
    ├── milestone1.test.ts  # E2E tests
    ├── playwright.config.ts
    └── package.json
```

## Usage

This repository is checked out in CI/CD workflows. The Playwright tests are copied into student repositories and run against their implementations.

## Running Tests Locally

**Note:** To run these tests locally, you need a student repository with the frontend implementation.

```bash
cd playwright
npm install
npm test
```

**Run Individual E2E Tests:**
```bash
cd playwright

# Run specific test by name
npm test -- --grep "App loads and displays basic UI"

# Run all milestone1 tests (default)
npm test
```

## Test Configuration

The Playwright configuration expects:
- Frontend to be in `../frontend` directory (relative to playwright directory)
- Frontend dev server to run on `http://localhost:5173`

When copied to student repos, the structure should be:
```
student-repo/
├── frontend/     # Student's implementation
└── playwright/   # Copied from this repo
```

## CI/CD Integration

These tests are used in GitHub Actions workflows:
1. Tests are checked out from this private repository
2. Copied to student repositories
3. Run against student implementations
