import { expect, test } from '@playwright/test';

test('home page renders the hero, quick start and catalogue links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Gaudi Design System' })).toBeVisible();
  await expect(page.getByRole('tablist', { name: 'Quick start' })).toBeVisible();
  const primary = page.getByRole('navigation', { name: 'Primary' }).first();
  for (const label of ['Docs', 'Components', 'Blocks', 'Library']) {
    await expect(primary.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(primary.getByRole('link', { name: 'Themes', exact: true })).toBeVisible();
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

test('guided setup loads its bundled QR image inside nested documentation previews', async ({ page }) => {
  await page.goto('/docs/components/accordion/');
  const preview = page.frameLocator('iframe[title="Guided setup preview"]');
  const qr = preview.getByRole('img', { name: 'QR code for the Gaudi setup guide' });
  await expect(qr).toBeVisible();
  await expect.poll(() => qr.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await qr.evaluate((image: HTMLImageElement) => new URL(image.currentSrc).pathname)).toMatch(/\/static\/images\/setup-guide\.svg$/);
  for (const width of [320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(qr).toBeVisible();
    expect(await qr.evaluate((image: HTMLImageElement) => {
      const box = image.getBoundingClientRect();
      return image.naturalWidth > 0 && box.width === 96 && box.height === 96
        && box.left >= 0 && box.right <= document.documentElement.clientWidth;
    }), `QR image fits at ${width}px`).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await preview.getByRole('button', { name: 'Mark guide as read' }).click();
  await expect(preview.getByRole('textbox', { name: 'Display name' })).toBeFocused();
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
  const trigger = page.getByTestId('search-trigger');
  const input = page.getByRole('combobox', { name: 'Search query' });
  await trigger.click();
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(trigger).toBeFocused();
  const shortcutLabel = await trigger.getByRole('img').getAttribute('aria-label');
  expect(shortcutLabel).toMatch(/^(Command|Control) plus K$/);
  await trigger.press(shortcutLabel?.startsWith('Command') ? 'Meta+k' : 'Control+k');
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await input.fill('accordion');
  const result = page.getByTestId('search-result').first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/docs\/components\/accordion/);
});
