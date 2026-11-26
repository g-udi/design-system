import { expect, test } from '@playwright/test';

const examples = [
  ['sortable-row-controls', 'Product photo'],
  ['sortable-media-grid', 'hero-banner.jpg'],
  ['sortable-nested', 'group Colors'],
  ['sortable-persisted', 'Outline the essay']
] as const;

test.describe('tap-to-reorder examples', () => {
  test.use({ hasTouch: true, reducedMotion: 'reduce' });

  for (const [slug, label] of examples) {
    test(`${slug} preserves the focused item when moving it in RTL`, async ({ page }) => {
      await page.goto(`/preview/${slug}#dir=rtl`);
      const picker = page.getByRole('combobox', { name: `Position of ${label}`, exact: true });
      const handle = page.getByRole('button', { name: `Drag ${label}`, exact: true });
      await expect(picker).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(handle).toHaveCSS('opacity', '1');
      await expect(picker.locator('option:checked')).toHaveText('1');
      await expect(picker.getByRole('option', { name: 'Move earlier' })).toBeDisabled();
      for (const width of [320, 375, 390, 639, 640, 641, 767, 768, 769, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        const bounds = await handle.boundingBox();
        expect(bounds?.width).toBeGreaterThanOrEqual(44);
        expect(bounds?.height).toBeGreaterThanOrEqual(44);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        if (width === 320 && (slug === 'sortable-row-controls' || slug === 'sortable-persisted')) {
          const text = slug === 'sortable-row-controls' ? 'Specification sheet' : 'Share it in the newsletter';
          const title = page.getByText(text, { exact: true });
          expect(await title.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
        }
      }
      await picker.focus();
      await picker.selectOption({ label: 'Move later' });
      await expect(picker.locator('option:checked')).toHaveText('2');
      await expect(picker).toBeFocused();
      if (slug === 'sortable-persisted') {
        await expect(picker).not.toHaveAttribute('aria-disabled', 'true');
      }
      await picker.selectOption({ label: 'Move earlier' });
      await expect(picker.locator('option:checked')).toHaveText('1');
      await expect(picker).toBeFocused();
      if (slug === 'sortable-row-controls') {
        await handle.focus();
        // The sensor attaches its document listener after the activating keydown.
        await page.keyboard.press('Space', { delay: 50 });
        const lifted = page.locator('[data-slot="sortable-item"][aria-hidden="true"]');
        await expect(lifted.locator('select:disabled option:checked')).toHaveText('1');
        await page.keyboard.press('ArrowDown', { delay: 50 });
        await expect(page.locator('[role="status"][aria-live="assertive"]')).toContainText('moved over droppable area 2');
        await page.keyboard.press('Escape');
        await expect(lifted).toHaveCount(0);
        await expect(picker.locator('option:checked')).toHaveText('1');
      }
      if (slug === 'sortable-nested') {
        const color = page.getByRole('combobox', { name: 'Position of White', exact: true });
        await color.selectOption({ label: 'Move later' });
        await expect(color.locator('option:checked')).toHaveText('2');
        await expect(picker.locator('option:checked')).toHaveText('1');
      }
    });
  }
});

test('a failed save restores the picker order and keeps focus', async ({ page }) => {
  await page.goto('/preview/sortable-persisted');
  const picker = page.getByRole('combobox', { name: 'Position of Outline the essay' });
  await page.getByRole('switch', { name: 'Simulate a failed save' }).click();
  await picker.focus();
  await picker.selectOption({ label: 'Move later' });
  await expect(page.getByText('Could not save the new order. Restored.')).toBeVisible();
  await expect(picker.locator('option:checked')).toHaveText('1');
  await expect(picker).toBeFocused();
});
