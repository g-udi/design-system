import { expect, test } from '@playwright/test';

test('documentation server content renders without React key warnings', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (/Each child in a list|same key|unique.*key.*prop/i.test(message.text())) warnings.push(message.text());
  });
  for (const route of ['/docs/components', '/docs/components/accordion', '/docs']) {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    await page.getByTestId('search-trigger').click();
    await expect(page.getByRole('combobox', { name: 'Search query' })).toBeFocused();
    await page.keyboard.press('Escape');
    for (const width of [320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
  }
  expect(warnings).toEqual([]);
});
