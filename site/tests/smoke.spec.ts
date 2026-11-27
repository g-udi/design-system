import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('home page renders the hero, quick start and catalogue links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Gaudi Design System' })).toBeVisible();
  await expect(page.getByRole('tablist', { name: 'Quick start' })).toBeVisible();
  const audiences = page.getByRole('region', { name: 'One system for every kind of page' });
  const work = audiences.getByRole('listitem').filter({ hasText: 'Made for working' });
  await expect(work.getByRole('link', { name: 'DataTable' })).toHaveAttribute('href', '/docs/components/data-table');
  const feature = page.getByRole('region', { name: 'What you get' }).getByRole('link', { name: /^Themes/ });
  await expect(feature).toHaveAttribute('href', '/themes');
  await feature.focus();
  await expect(feature).toBeFocused();
  const primary = page.getByRole('navigation', { name: 'Primary' }).first();
  for (const label of ['Docs', 'Components', 'Blocks', 'Library']) {
    await expect(primary.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(primary.getByRole('link', { name: 'Themes', exact: true })).toBeVisible();
});

test('a component page shows a live preview, code tab and API table', async ({ page }) => {
  await page.goto('/docs/components/accordion');
  await expect(page.getByRole('heading', { level: 1, name: 'Accordion' })).toBeVisible();
  await page.getByRole('link', { name: 'View examples', exact: true }).click();
  await expect(page).toHaveURL(/#examples$/);
  await expect(page.locator('#examples')).toBeInViewport();
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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  await page.goto(`${basePath}/docs/components/accordion/`);
  const openPreview = page.getByRole('link', { name: 'Open Guided setup in a new tab' });
  const href = await openPreview.getAttribute('href');
  expect(href?.replace(/\/$/, '')).toBe(`${basePath}/preview/accordion-guided-setup`);
  expect((await page.request.get(href!)).ok()).toBe(true);
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

test('the artwork preview opens and downloads the rendered image', async ({ page }, testInfo) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  await page.goto(`${basePath}/preview/popover-rich/`);
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const image = page.getByRole('img', { name: 'Portfolio template preview' });
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  const artwork = `${basePath}/static/images/art/0.svg`;
  await expect(page.getByRole('link', { name: 'Open artwork' })).toHaveAttribute('href', artwork);
  const save = page.getByRole('link', { name: 'Save artwork' });
  await expect(save).toHaveAttribute('href', `${basePath}/static/images/art/portfolio-artwork.svg`);
  const transfer = page.waitForEvent('download');
  await save.click();
  const file = await transfer;
  expect(file.suggestedFilename()).toBe('portfolio-artwork.svg');
  const displayed = await page.request.get(artwork);
  expect(displayed.ok()).toBe(true);
  const saved = testInfo.outputPath('portfolio-artwork.svg');
  await file.saveAs(saved);
  expect(await readFile(saved)).toEqual(await displayed.body());
});

test('notification settings keep all digest days on screen and the matrix scrolls locally', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 880 });
  await page.goto('/preview/screens-notifications');
  const days = page.getByRole('toolbar', { name: 'Digest days' });
  await expect(days.getByRole('button')).toHaveCount(7);
  const monday = days.getByRole('button', { name: 'Mon' });
  await monday.click();
  await expect(monday).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('tab', { name: 'Slack' }).click();
  const matrix = page.getByRole('region', { name: 'Slack alerts by scope' });
  await expect(matrix.getByRole('table')).toBeVisible();
  expect(await matrix.evaluate((region) => region.scrollWidth > region.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
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

test('theme import announces a successful application and a failed import', async ({ page }) => {
  await page.goto('/themes');
  const region = page.getByRole('region', { name: 'Import', exact: true });
  const input = region.getByRole('textbox', { name: 'Theme CSS or JSON' });
  await region.getByRole('button', { name: 'Apply the sample' }).click();
  await expect(region.getByRole('status')).toContainText(/Applied.*Imported theme/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'imported');
  await input.fill('body { color: tomato; }');
  await region.getByRole('button', { name: 'Import and apply' }).click();
  await expect(region.getByRole('alert')).toContainText(/No :root or .dark custom properties/);
  await expect(region.getByRole('status')).toHaveCount(0);
  await expect(input).toHaveValue('body { color: tomato; }');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'imported');
});

test('search loads its corpus once and finds pages, headings and paragraphs', async ({ page }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const searchRequests: string[] = [];
  page.on('request', (request) => {
    const { pathname } = new URL(request.url());
    if (pathname.startsWith(`${basePath}/api/search`)) searchRequests.push(pathname);
  });
  await page.goto(`${basePath}/docs`);
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
  expect(searchRequests).toEqual([]);
  await input.fill('Custom readouts');
  await expect(page.getByTestId('search-result').getByText('Custom readouts', { exact: true })).toBeVisible();
  await input.fill('Adjust one value or a range with pointer and keyboard input');
  await expect(page.getByTestId('search-result').getByText('Adjust one value or a range with pointer and keyboard input.', { exact: true })).toBeVisible();
  await input.fill('accordion');
  const result = page.getByTestId('search-result').first();
  await expect(result.getByText('Accordion', { exact: true })).toBeVisible();
  expect(searchRequests).toEqual([`${basePath}/api/search-corpus.gz`]);
  await result.click();
  await expect(page).toHaveURL(/\/docs\/components\/accordion/);
});

for (const index of ['search-corpus.gz', 'search']) {
  test(`search can retry an interrupted ${index} download`, async ({ page }) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (index === 'search') {
      await page.addInitScript(() => Object.defineProperty(window, 'DecompressionStream', { value: undefined }));
    }
    await page.route(`**/api/${index}`, (route) => route.abort(), { times: 1 });
    await page.goto(`${basePath}/docs`);
    await page.getByTestId('search-trigger').click();
    await page.getByRole('combobox', { name: 'Search query' }).fill('slider');
    const retry = page.getByRole('option', { name: 'Retry search' });
    await expect(retry).toBeVisible();
    await retry.click();
    await expect(page.getByTestId('search-result').first().getByText('Slider', { exact: true })).toBeVisible();
  });
}
