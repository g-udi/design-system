import { expect, test, type Page } from '@playwright/test';
import { readdirSync } from 'node:fs';

const themeIds = readdirSync(new URL('../../themes/presets/', import.meta.url)).filter((file) => file.endsWith('.json')).map((file) => file.slice(0, -5));

async function inspectPalette(page: Page) {
  return page.getByRole('dialog', { name: 'Search documentation' }).evaluate((dialog) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    const rgba = (value: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const blend = (front: number[], back: number[]) => {
      const alpha = front[3] / 255;
      return front.slice(0, 3).map((value, index) => value * alpha + back[index] * (1 - alpha)).concat(255);
    };
    const background = (element: Element | null): number[] => {
      if (!element) return [255, 255, 255, 255];
      const color = rgba(getComputedStyle(element).backgroundColor);
      return color[3] === 255 ? color : blend(color, background(element.parentElement));
    };
    const luminance = (color: number[]) => color.slice(0, 3).map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const contrast = (element: Element, color = getComputedStyle(element).color) => {
      const bg = background(element);
      const levels = [luminance(blend(rgba(color), bg)), luminance(bg)].sort((a, b) => b - a);
      return (levels[0] + 0.05) / (levels[1] + 0.05);
    };
    const input = dialog.querySelector('input')!;
    const text = [...dialog.querySelectorAll('[cmdk-group-heading], [role="option"], [data-slot="command-footer"], [data-slot="command-empty"]')];
    const parts = [dialog, ...dialog.querySelectorAll('[data-slot="command"], [data-slot="command-input-wrapper"], [data-slot="command-list"], [data-slot="command-footer"]')];
    const bounds = dialog.getBoundingClientRect();
    return {
      backgrounds: parts.map((element) => background(element).slice(0, 3).map(Math.round)),
      contrast: [...text.map((element) => ({ text: element.textContent?.trim(), ratio: contrast(element) })), { text: 'Input', ratio: contrast(input) }, { text: 'Placeholder', ratio: contrast(input, getComputedStyle(input, '::placeholder').color) }],
      bounds: { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom },
      viewport: { width: innerWidth, height: innerHeight },
      overflow: document.documentElement.scrollWidth - innerWidth,
      popupOverflow: dialog.scrollWidth - dialog.clientWidth
    };
  });
}

async function expectUnifiedPalette(page: Page) {
  const snapshot = await inspectPalette(page);
  for (const background of snapshot.backgrounds) expect(background).toEqual(snapshot.backgrounds[0]);
  for (const { text, ratio } of snapshot.contrast) expect(ratio, `${text} contrast`).toBeGreaterThanOrEqual(4.5);
  expect(snapshot.bounds.left).toBeGreaterThanOrEqual(0);
  expect(snapshot.bounds.right).toBeLessThanOrEqual(snapshot.viewport.width);
  expect(snapshot.bounds.top).toBeGreaterThanOrEqual(0);
  expect(snapshot.bounds.bottom).toBeLessThanOrEqual(snapshot.viewport.height);
  expect(snapshot.overflow).toBeLessThanOrEqual(1);
  expect(snapshot.popupOverflow).toBeLessThanOrEqual(1);
}

for (const theme of themeIds) {
  for (const mode of ['light', 'dark']) {
    test(`search uses one readable surface: ${theme} ${mode}`, async ({ page }, testInfo) => {
      await page.goto('/docs/components');
      await page.getByTestId('preset-menu').click();
      await page.getByTestId(`preset-${theme}`).click();
      await page.getByTestId('mode-menu').click();
      await page.getByRole('menuitemradio', { name: mode === 'dark' ? 'Dark' : 'Light', exact: true }).click();
      const trigger = page.getByTestId('search-trigger');
      const shortcut = await trigger.getByRole('img').getAttribute('aria-label');
      await trigger.press(shortcut?.startsWith('Command') ? 'Meta+k' : 'Control+k');
      const input = page.getByRole('combobox', { name: 'Search query' });
      await expect(input).toBeFocused();
      const widths = theme === 'gaudi' ? [320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920] : [320, 768, 1440];
      for (const width of widths) {
        await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
        await expectUnifiedPalette(page);
      }
      if (mode === 'dark') await page.screenshot({ path: testInfo.outputPath(`${theme}-dark.png`) });
      if (theme === 'gaudi') {
        const gray = (await inspectPalette(page)).backgrounds[0];
        expect(new Set(gray).size, 'Gaudi has a neutral gray background').toBe(1);
      }
      await input.fill('accordion');
      await expect(page.getByTestId('search-result').first()).toBeVisible();
      await expectUnifiedPalette(page);
      await input.press('ArrowDown');
      await expect(page.getByRole('option', { selected: true })).toBeVisible();
      await input.fill('no-such-component-zzzz');
      await expect(page.getByTestId('search-result')).toHaveCount(0);
      await expectUnifiedPalette(page);
      await input.press('Escape');
      await expect(trigger).toBeFocused();
    });
  }
}
