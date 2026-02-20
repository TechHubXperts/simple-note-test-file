import { test, expect } from '@playwright/test';



async function waitForPageReady(page, label = 'Page') {
  const startTime = Date.now();
  
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body', { state: 'visible' });
  await page.waitForTimeout(50); // Stabilization
  const elapsed = Date.now() - startTime;
  console.log(`✅ ${label} ready in ${elapsed}ms`);
}

test.describe('Milestone 1: Frontend End-to-End Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await waitForPageReady(page, 'Initial load');
    // Clear localStorage for clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForPageReady(page, 'After localStorage clear');
  });

  // --------------------- Task 1: App loads and displays basic UI ---------------------
  test('I am changing the name here App loads and displays basic UI', { tag: ['@M1-T1'] }, async ({ page }) => {
    // Check app title exists (using heading role)
    const heading = page.getByRole('heading', { name: /simple notes/i });
    await expect(heading).toBeVisible();

    // Check input field exists (using textbox role)
    const input = page.getByRole('textbox');
    await expect(input).toBeVisible();

    // Check Submit button exists (using button role)
    const submitButton = page.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeVisible();
  });

  // --------------------- Task 2: Shows empty state when no notes exist ---------------------
  test('Shows empty state when no notes exist', { tag: ['@M1-T2'] }, async ({ page }) => {
    // Check empty state message (using text content)
    await expect(page.getByText(/no notes yet/i)).toBeVisible();
  });

  // --------------------- Task 3: Can create a new note ---------------------
  test('Can create a new note', { tag: ['@M1-T3'] }, async ({ page }) => {
    // Get initial state - check if empty message exists
    const emptyMessage = page.getByText(/no notes yet/i);
    const initiallyEmpty = await emptyMessage.isVisible().catch(() => false);

    // Type note in input (using role)
    const input = page.getByRole('textbox');
    await input.fill('My Test Note');

    // Click submit button (using role)
    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Verify note appears in list (using text content)
    await expect(page.getByText('My Test Note')).toBeVisible();
    
    // Verify empty state is gone
    if (initiallyEmpty) {
      await expect(emptyMessage).not.toBeVisible();
    }
  });

  // --------------------- Task 4: Can create multiple notes ---------------------
  test(' I am changing the name here as well Can create multiple notes', { tag: ['@M1-T4'] }, async ({ page }) => {
    const input = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /submit/i });

    // Create first note
    await input.fill('First Note');
    await submitButton.click();

    // Create second note
    await input.fill('Second Note');
    await submitButton.click();

    // Create third note
    await input.fill('Third Note');
    await submitButton.click();

    // Verify all notes are displayed (using text content)
    await expect(page.getByText('First Note')).toBeVisible();
    await expect(page.getByText('Second Note')).toBeVisible();
    await expect(page.getByText('Third Note')).toBeVisible();
  });

  // --------------------- Task 5: Input clears after submitting a note ---------------------
  test('Input clears after submitting a note', { tag: ['@M1-T5'] }, async ({ page }) => {
    const input = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /submit/i });

    // Type and submit
    await input.fill('Test Note');
    await submitButton.click();

    // Verify input is cleared
    await expect(input).toHaveValue('');
  });
});
