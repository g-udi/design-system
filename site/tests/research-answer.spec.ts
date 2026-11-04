import { expect, test, type Page } from '@playwright/test';

const widths = [320, 375, 390, 639, 640, 730, 767, 768, 823, 1023, 1024, 1279, 1280, 1440, 1920];
const preview = '/preview/message-research-answer';

async function expectContained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const bounds = await page.locator('section[aria-label="Research answer"] button, [data-slot="popover-content"]').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, overflow: element.scrollWidth - element.clientWidth };
  }));
  for (const box of bounds) {
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    expect(box.overflow).toBeLessThanOrEqual(1);
  }
}

for (const mode of ['light', 'dark'] as const) {
  test(`cited answer and open sources fit all viewport classes: ${mode}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ colorScheme: mode });
    await page.goto(preview);
    await expect(page.getByRole('status')).toHaveText('Answer ready');
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1100 });
      await expectContained(page);
      const cards = page.getByRole('group', { name: 'Source records' }).getByRole('button');
      const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { y: rect.y, height: rect.height };
      }));
      if (width <= 390) expect(boxes[1].y).toBeGreaterThanOrEqual(boxes[0].y + boxes[0].height);
      if (width >= 768) expect(boxes.every((box) => Math.abs(box.y - boxes[0].y) <= 1)).toBe(true);
      if ([390, 823, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath(`answer-${mode}-${width}.png`), fullPage: true });
      await cards.nth(2).click();
      await expect(page.getByRole('dialog', { name: 'Incident review', exact: true })).toBeVisible();
      await expect(page.getByRole('dialog')).toHaveCSS('border-top-width', '1px');
      await expectContained(page);
      if (width === 390) {
        await page.getByRole('dialog').evaluate(async (element) => { await Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)); });
        await page.screenshot({ path: testInfo.outputPath(`source-${mode}-${width}.png`) });
      }
      await page.keyboard.press('Escape');
      await expect(cards.nth(2)).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

test('citations, copy, feedback, streaming and prepared follow-ups work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(preview);
  await expect(page.getByRole('status')).toHaveText('Answer ready');
  const citation = page.getByRole('button', { name: 'Source 1: Checkout traces, and 1 more', exact: true });
  await citation.press('Enter');
  await expect(page.getByRole('dialog')).toContainText('Database connection wait remained below 5ms.');
  await page.getByRole('button', { name: 'Next source', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Tax client 1.9.0 reached eu-west');
  await page.keyboard.press('Escape');
  await expect(citation).toBeFocused();
  await page.getByRole('button', { name: 'Copy answer', exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Why did checkout latency spike?\n\n# A retry loop');
  expect(copied).toContain('\n\nSources (sample incident)\n[1] Checkout traces:');
  expect(copied).toContain('\n[3] Incident review:');
  const rating = page.getByRole('button', { name: 'Good reply', exact: true });
  await rating.click();
  await expect(rating).toHaveAttribute('aria-pressed', 'true');
  await rating.click();
  await expect(rating).toHaveAttribute('aria-pressed', 'false');
  const regenerate = page.getByRole('button', { name: 'Regenerate answer', exact: true });
  await regenerate.click();
  await expect(page.locator('[data-slot="message-markdown"]')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'Writing answer' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Copy answer|Copied/, exact: true })).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'Answer ready' })).toBeVisible();
  await expect(regenerate).toBeFocused();
  for (const [label, heading] of [
    ['Rollback checklist', 'How should we verify the rollback?'],
    ['Prevent recurrence', 'How can we prevent this happening again?'],
    ['Overview', 'Why did checkout latency spike?']
  ]) {
    const followUp = page.getByRole('button', { name: label, exact: true });
    await followUp.click();
    await expect(page.getByRole('status').filter({ hasText: 'Answer ready' })).toBeVisible();
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(followUp).toBeFocused();
    await expect(followUp).toHaveAttribute('aria-pressed', 'true');
    await expectContained(page);
  }
});

test('reduced motion, spacing presets and RTL remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${preview}#dir=rtl`);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Regenerate answer', exact: true }).click();
  await expect(page.locator('[data-slot="message-markdown"]')).toHaveAttribute('aria-busy', 'false');
  await expect(page.getByRole('status')).toHaveText('Answer ready');
  for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
    await page.evaluate((value) => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 1100 });
      await expectContained(page);
    }
  }
  await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
});

test('the assembled docs expose a copyable story and touch source previews', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto('/docs/chat/chat-message');
    const frame = page.frameLocator('iframe[title="Research answer preview"]');
    const example = page.getByTestId('example').filter({ has: page.locator('iframe[title="Research answer preview"]') });
    await example.scrollIntoViewIfNeeded();
    await expect(frame.getByRole('heading', { name: 'Why did checkout latency spike?', exact: true })).toBeVisible();
    await frame.getByRole('button', { name: 'Read source 1: Checkout traces', exact: true }).tap();
    await expect(frame.getByRole('dialog', { name: 'Checkout traces', exact: true })).toBeVisible();
    await frame.getByRole('dialog').press('Escape');
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    const code = example.getByRole('tabpanel', { name: 'Code', exact: true });
    await expect(code).toContainText('@gaudi/design-system/chat/ChatMessageList');
    await expect(code).toContainText('const SOURCES');
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
    await expect(frame.getByRole('status')).toHaveText('Answer ready');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally {
    await context.close();
  }
});
