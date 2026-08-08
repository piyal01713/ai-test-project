import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the locally running application
    await page.goto('/');
  });

  test('should display the header and initial columns', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Project Board');

    // Check all 5 columns are present by checking their rename inputs
    const backlogInput = page.locator('data-testid=column-title-input-col-1');
    const todoInput = page.locator('data-testid=column-title-input-col-2');
    const inProgressInput = page.locator('data-testid=column-title-input-col-3');
    const reviewInput = page.locator('data-testid=column-title-input-col-4');
    const doneInput = page.locator('data-testid=column-title-input-col-5');

    await expect(backlogInput).toHaveValue('Backlog');
    await expect(todoInput).toHaveValue('To Do');
    await expect(inProgressInput).toHaveValue('In Progress');
    await expect(reviewInput).toHaveValue('Review');
    await expect(doneInput).toHaveValue('Done');
  });

  test('should allow renaming a column', async ({ page }) => {
    const input = page.locator('data-testid=column-title-input-col-1');
    await input.focus();
    await input.fill('Backlog Tasks');
    await input.press('Enter');

    // Verify rename persists after blur
    await expect(input).toHaveValue('Backlog Tasks');
  });

  test('should allow adding a card and then deleting it', async ({ page }) => {
    // Add a card to the 'Review' column (col-4)
    await page.locator('data-testid=add-card-btn-col-4').click();
    
    const titleInput = page.locator('data-testid=new-card-title-col-4');
    const detailsInput = page.locator('data-testid=new-card-details-col-4');
    const submitBtn = page.locator('data-testid=submit-card-col-4');

    await titleInput.fill('E2E Review Task');
    await detailsInput.fill('Verify the Playwright suite runs cleanly');
    await submitBtn.click();

    // Verify card is added
    const card = page.locator('text=E2E Review Task');
    await expect(card).toBeVisible();
    await expect(page.locator('text=Verify the Playwright suite runs cleanly')).toBeVisible();

    // Delete the card
    // Hover the card to make the delete button visible
    await card.hover();
    await page.locator('[aria-label="Delete E2E Review Task"]').click();

    // Verify card is deleted
    await expect(card).not.toBeVisible();
  });

  test('should support drag and drop of a card to another column', async ({ page }) => {
    const card = page.locator('data-testid=card-card-3'); // "Design Glassmorphism Theme" (in Progress, col-3)
    const destination = page.locator('data-testid=droppable-col-4'); // "Review" column (col-4)

    // Check count of cards in In Progress (col-3) and Review (col-4)
    const col3Count = page.locator('data-testid=column-col-3').locator('span');
    const col4Count = page.locator('data-testid=column-col-4').locator('span');

    await expect(col3Count).toHaveText('2'); // Initial cards: card-3, card-4
    await expect(col4Count).toHaveText('0');

    // Drag and drop card-3 to col-4
    await card.hover();
    await page.mouse.down();
    // Hover destination and wiggle slightly to trigger drag over handlers
    const box = await destination.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
    }
    await page.mouse.up();

    // Verify counts updated
    await expect(col3Count).toHaveText('1');
    await expect(col4Count).toHaveText('1');
  });
});
