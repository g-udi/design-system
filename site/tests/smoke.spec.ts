import { expect, test } from '@playwright/test';

test('home page renders the hero, quick start and catalogue links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Gaudi Design System' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Quick start' })).toBeVisible();
  const primary = page.getByRole('navigation', { name: 'Primary' }).first();
  for (const label of ['Docs', 'Components', 'Blocks', 'Charts', 'Hooks', 'Themes']) {
    await expect(primary.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
});

test('a component page shows a live preview, code tab and API table', async ({ page }) => {
  await page.goto('/docs/components/accordion');
  await expect(page.getByRole('heading', { level: 1, name: 'Accordion' })).toBeVisible();
  const example = page.getByTestId('example').first();
  await example.scrollIntoViewIfNeeded();
  // The preview frame renders the real fixture.
  const frame = page.frameLocator('[data-testid="preview-frame"]').first();
  await expect(frame.locator('[data-pattern]')).toBeVisible();
  await expect(frame.getByRole('button').first()).toBeVisible();
  // Code tab: copyable source rewritten to public imports.
  await example.getByRole('tab', { name: 'Code' }).click();
  await expect(example.getByText("@gaudi/design-system/core/Accordion").first()).toBeVisible();
  await expect(page.getByTestId('props-table')).toBeVisible();
});

test('theme preset and colour mode switch and persist', async ({ page }) => {
  await page.goto('/themes');
  await page.getByTestId('preset-menu').click();
  await page.getByTestId('preset-folio').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'folio');
  await page.getByTestId('mode-menu').click();
  await page.getByRole('menuitemradio', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'folio');
  await expect(page.locator('html')).toHaveClass(/dark/);
  // Reset for other tests.
  await page.evaluate(() => window.localStorage.clear());
});

test('search finds component pages from the static index', async ({ page }) => {
  await page.goto('/docs');
  await page.getByTestId('search-trigger').first().click();
  await page.getByRole('combobox', { name: 'Search query' }).fill('accordion');
  const result = page.getByTestId('search-result').first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/docs\/components\/accordion/);
});
