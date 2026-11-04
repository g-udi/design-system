import { expect, test, type Page } from '@playwright/test';

const widths = [320, 375, 390, 639, 640, 691, 692, 693, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920];

async function expectContained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  for (const item of await page.locator('[data-slot="attachment"]').all()) {
    const box = (await item.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    expect(await item.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  }
}

for (const mode of ['light', 'dark'] as const) {
  test(`delivered files share a responsive row and retain their actions: ${mode}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: mode });
    await page.goto('/preview/chat-file-delivered-files');
    await expect(page.locator('[data-pattern][data-ready="true"]')).toBeVisible();
    const group = page.getByRole('group', { name: 'Attachments', exact: true });
    const files = group.locator('[data-slot="attachment"]');
    await expect(files).toHaveCount(2);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await expectContained(page);
      const first = (await files.nth(0).boundingBox())!;
      const second = (await files.nth(1).boundingBox())!;
      expect(Math.abs(first.width - second.width)).toBeLessThanOrEqual(1);
      if (width >= 768) expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(1);
      if (width <= 390) expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
      if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`files-${mode}-${width}.png`) });
    }
    for (const name of ['september-report.pdf', 'subscribers-2026-09.csv']) {
      await page.getByRole('button', { name: `Preview ${name}`, exact: true }).click();
      await expect(page.getByRole('status')).toHaveText(`Opening ${name}`);
      await page.getByRole('button', { name: `Download ${name}`, exact: true }).click();
      await expect(page.getByRole('status')).toHaveText(`Downloading ${name}`);
    }
  });

  test(`team conversation uses the available width: ${mode}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: mode });
    await page.goto('/preview/message-team-conversation');
    await expect(page.locator('[data-pattern][data-ready="true"]')).toBeVisible();
    const thread = page.locator('[data-pattern] > div > div');
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1100 });
      await expectContained(page);
      if (width >= 768) expect((await thread.boundingBox())!.width).toBeGreaterThanOrEqual(640);
      if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`team-${mode}-${width}.png`) });
    }
    await expect(page.getByRole('img', { name: 'Trace waterfall for the slow confirm call' })).toBeVisible();
    expect(await page.getByRole('img', { name: 'Trace waterfall for the slow confirm call' }).evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  });
}

test('attachments and team messages fit every spacing preset in both directions', async ({ page }) => {
  for (const name of ['chat-file-delivered-files', 'message-team-conversation']) {
    await page.goto(`/preview/${name}`);
    await expect(page.locator('[data-pattern][data-ready="true"]')).toBeVisible();
    for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
      await page.evaluate((value) => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
      for (const width of [320, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: 1100 });
        await expectContained(page);
      }
    }
    await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
    await page.goto(`/preview/${name}#dir=rtl`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1100 });
      await expectContained(page);
    }
  }
});
