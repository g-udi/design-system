import { expect, test, type Page } from '@playwright/test';

const widths = [320, 375, 390, 639, 640, 730, 767, 768, 823, 1023, 1024, 1279, 1280, 1440, 1920];
const examples = [
  ['reasoning-playground', 'Playground'],
  ['reasoning-thinking-then-answer', 'Thinking, then the answer'],
  ['reasoning-agent-run', 'Agent run'],
  ['reasoning-ai-message-with-steps', 'AI message with steps'],
  ['reasoning-mini-thinking', 'Mini thinking']
];
async function contained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const overflow = await page.locator('[data-slot="message-reasoning"]').evaluateAll((elements) => elements.map((element) => element.scrollWidth - element.clientWidth));
  for (const value of overflow) expect(value).toBeLessThanOrEqual(1);
}

for (const mode of ['light', 'dark'] as const) {
  for (const [name] of examples) {
    test(`${name} renders locally across viewport classes in ${mode}`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.emulateMedia({ colorScheme: mode });
      await page.goto(`/preview/${name}`);
      await expect(page.locator('[data-pattern][data-ready="true"]')).toBeVisible();
      await expect(page.locator('[data-slot="message-reasoning"]').first()).toBeVisible();
      if (name === 'reasoning-agent-run') await expect(page.getByRole('group', { name: 'Allow publish_note?' })).toBeVisible();
      if (name === 'reasoning-thinking-then-answer' || name === 'reasoning-mini-thinking') await expect(page.getByText(/Go with/)).toBeVisible();
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await contained(page);
        if ([390, 1280].includes(width)) await page.screenshot({ path: info.outputPath(`${name}-${mode}-${width}.png`), fullPage: true });
      }
      expect(errors).toEqual([]);
    });
  }
}

test('all assembled docs frames load without Storybook and expose complete source', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => { if (request.url().includes(':6006')) requests.push(request.url()); });
  await page.setViewportSize({ width: 730, height: 1100 });
  await page.goto('/docs/chat/chat-reasoning');
  await expect(page.locator('iframe')).toHaveCount(examples.length);
  for (const [name, title] of examples) {
    const iframe = page.locator(`iframe[title="${title} preview"]`);
    await expect(iframe).toHaveAttribute('src', `/preview/${name}#dir=ltr`);
    await iframe.scrollIntoViewIfNeeded();
    const frame = page.frameLocator(`iframe[title="${title} preview"]`);
    await expect(frame.locator('[data-slot="message-reasoning"]').first()).toBeVisible();
    const example = page.getByTestId('example').filter({ has: iframe });
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatReasoning');
    await expect(example.getByRole('tabpanel')).toContainText('export function Pattern');
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
    await expect(frame.locator('[data-slot="message-reasoning"]').first()).toBeVisible();
  }
  expect(requests).toEqual([]);
  await contained(page);
});

test('disclosures, replay, approval, checkpoint restore and denial still work', async ({ page }) => {
  await page.goto('/preview/reasoning-playground');
  const trail = page.getByRole('button', { name: 'Thought for 6s', exact: true });
  await trail.click();
  await expect(trail).toHaveAttribute('aria-expanded', 'false');
  await trail.press('Enter');
  await expect(page.getByText('Suggest a tighter opening')).toBeVisible();

  await page.goto('/preview/reasoning-thinking-then-answer');
  await expect(page.getByText(/Go with/)).toBeVisible();
  const finished = page.getByRole('button', { name: 'Thought for 2s', exact: true });
  await expect(finished).toHaveAttribute('aria-expanded', 'false');
  await finished.click();
  await expect(page.getByText(/Comparing the two headline/)).toBeVisible();
  await page.getByRole('button', { name: 'Ask again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Thinking…', exact: true })).toBeVisible();
  await expect(page.getByText(/Go with/)).toBeVisible();

  await page.goto('/preview/reasoning-agent-run');
  const approval = page.getByRole('group', { name: 'Allow publish_note?' });
  await approval.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(page.getByText(/Published the follow-up note and emailed/)).toBeVisible();
  await page.getByRole('button', { name: 'Restore checkpoint', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Restore', exact: true }).click();
  await expect(page.getByText(/Restored “Before the agent run”/)).toBeVisible();
  await approval.getByRole('button', { name: 'Deny', exact: true }).click();
  await expect(page.getByText(/the note stays a draft/)).toBeVisible();

  await page.goto('/preview/reasoning-ai-message-with-steps');
  const read = page.getByRole('button', { name: /Read 3 sources/ });
  await read.click();
  await expect(page.getByText(/Analytics for the last 90 days/)).toBeVisible();
  const image = page.getByRole('img', { name: /Reading-time chart/ });
  expect(await image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await read.click();
  await expect(read).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: /Drafting the new section/ })).toHaveAttribute('aria-expanded', 'true');
});

test('reasoning previews fit RTL, every spacing preset and phone touch', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    for (const [name] of examples) {
      await page.goto(`/preview/${name}#dir=rtl`);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('[data-slot="message-reasoning"]').first()).toBeVisible();
      for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
        await page.evaluate((value) => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
        for (const width of [320, 390, 768, 1280]) {
          await page.setViewportSize({ width, height: 1000 });
          await contained(page);
        }
      }
      await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const read = page.getByRole('button', { name: /Read 3 sources/ });
    await read.tap();
    await expect(page.getByText(/Analytics for the last 90 days/)).toBeVisible();
  } finally { await context.close(); }
});
