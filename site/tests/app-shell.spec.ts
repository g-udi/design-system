import { expect, test } from '@playwright/test';

const widths = [320, 390, 767, 768, 801, 802, 993, 994, 1023, 1024, 1279, 1280, 1440, 1920];

for (const width of widths) {
  test(`app shells expand without losing responsive controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/docs/blocks/app-shell/');
    const example = page.locator('[data-example="app-shell-crawler-control"]');
    const opener = example.getByRole('button', { name: 'Expand preview', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds?.width).toBe(width);
    const frame = dialog.locator('iframe');
    await expect(frame).toHaveJSProperty('clientWidth', width);
    const preview = frame.contentFrame();
    await expect(preview.locator('[data-ready="true"]')).toBeVisible();
    await dialog.getByRole('radio', { name: 'Mobile (375px)', exact: true }).click();
    await expect(frame).toHaveJSProperty('clientWidth', 375);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await dialog.getByRole('radio', { name: 'Desktop', exact: true }).click();
    await expect(frame).toHaveJSProperty('clientWidth', width);
    await dialog.getByRole('button', { name: 'RTL', exact: true }).click();
    await expect(preview.locator('#gaudi-preview-root')).toHaveAttribute('dir', 'rtl');
    await dialog.getByRole('button', { name: 'Close preview', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
}

test('capture navigation and all queue tabs fit a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto('/preview/app-shell-crawler-control');
  await page.getByRole('button', { name: 'Toggle Sidebar', exact: true }).click();
  const sheet = page.locator('[data-slot="sidebar"][data-mobile="true"]');
  await expect(sheet).toBeVisible();
  for (const tab of ['Digest', 'Queue', 'Shelves', 'Issues']) {
    const item = sheet.getByRole('tab', { name: tab, exact: true });
    const [itemBox, sheetBox] = await Promise.all([item.boundingBox(), sheet.boundingBox()]);
    expect(itemBox!.x + itemBox!.width).toBeLessThanOrEqual(sheetBox!.x + sheetBox!.width);
    await item.click();
    await expect(item).toHaveAttribute('aria-selected', 'true');
  }
  await sheet.getByRole('button', { name: 'Capture sections' }).click();
  await page.getByRole('menuitemradio', { name: 'Sources', exact: true }).click();
  await sheet.getByRole('button', { name: 'Close capture navigation' }).click();
  await expect(sheet).toBeHidden();
});

test('newsletter rows stay within the list and support phone reading navigation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto('/preview/app-shell-newsletter-reader');
  const messages = page.getByRole('region', { name: 'Unread messages' });
  await expect(messages).toBeVisible();
  for (const width of [320, 390, 802, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 850 });
    await expect.poll(() => messages.locator('ul').evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 320, height: 850 });
  await messages.getByRole('button', { name: /^The Margins / }).click();
  const reader = page.getByRole('region', { name: 'Reading pane' });
  await expect(reader).toBeVisible();
  for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
    await page.evaluate(value => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
    await expect.poll(() => reader.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
  await reader.getByRole('button', { name: 'Back to messages' }).click();
  await expect(messages).toBeVisible();
});

test('the reading plan follows available space until explicitly toggled', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1050 });
  await page.goto('/preview/app-shell-digest-inbox');
  const plan = page.getByRole('complementary', { name: 'Reading plan' });
  await expect(plan).toHaveAttribute('data-state', 'open');
  await page.setViewportSize({ width: 320, height: 850 });
  await expect(page.locator('aside[aria-label="Reading plan"]')).toHaveAttribute('data-state', 'closed');
  // On phones the reading pane (which owns the plan control) opens from a message.
  const show = page.getByRole('button', { name: 'Show reading plan', exact: true });
  if (!(await show.isVisible())) {
    await page.setViewportSize({ width: 1024, height: 850 });
  }
  await show.click();
  await page.setViewportSize({ width: 320, height: 850 });
  await expect(plan).toHaveAttribute('data-state', 'open');
  await expect.poll(() => plan.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  const close = plan.getByRole('button', { name: 'Close reading plan' });
  await close.click();
  await expect(page.locator('aside[aria-label="Reading plan"]')).toHaveAttribute('data-state', 'closed');
});


test('shell headers and sidebars fit at every spacing preset', async ({ page }) => {
  for (const name of ['app-shell-crawler-control', 'app-shell-notebook-tabs', 'app-shell-newsletter-reader', 'app-shell-topbar-collections']) {
    await page.goto(`/preview/${name}`);
    await expect(page.locator('[data-ready="true"]')).toBeVisible();
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 1050 });
      for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
        await page.evaluate(value => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
        await expect.poll(() => page.locator('header, [data-slot="sidebar-content"], [role="toolbar"]').evaluateAll(elements => elements.filter(el => el.clientWidth > 1 && el.scrollWidth > el.clientWidth + 1).map(el => el.getAttribute('aria-label') || el.getAttribute('data-slot') || el.tagName))).toEqual([]);
      }
    }
    await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
  }
});

test('capture queue keeps its lower sections above the footer and exposes overflow', async ({ page }) => {
  for (const width of [320, 390, 590, 639, 640, 767, 768, 993, 994, 995, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1120 });
    await page.goto('/preview/app-shell-crawler-control');
    await expect(page.locator('[data-ready="true"]')).toBeVisible();
    const frame = page.locator('[data-slot="app-shell-frame"]');
    await expect(frame).toHaveAttribute('data-compact', /true|false/);
    const compact = await frame.getAttribute('data-compact') === 'true';
    if (compact) {
      await page.getByRole('button', { name: 'Toggle Sidebar', exact: true }).click();
      await page.locator('[data-slot="sidebar"][data-mobile="true"]').evaluate(async el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
    }
    const queue = page.getByRole('region', { name: 'Capture queue runs', exact: true });
    const footer = page.getByRole('link', { name: 'Review all captures' }).locator('..');
    const bodyBox = (await queue.boundingBox())!;
    const footerBox = (await footer.boundingBox())!;
    expect(bodyBox.y + bodyBox.height).toBeLessThanOrEqual(footerBox.y + 1);
    expect(await queue.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    if (compact) {
      await expect(queue.locator('..').locator('[data-slot="scroll-area-thumb"]')).toBeVisible();
      await page.mouse.move(bodyBox.x + bodyBox.width / 2, bodyBox.y + bodyBox.height / 2);
      await page.mouse.wheel(0, 3000);
      await expect.poll(() => queue.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    } else {
      expect(await queue.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
    }
    const blocked = queue.getByRole('heading', { name: 'Blocked', exact: true });
    await expect(blocked).toBeInViewport();
    const blockedBox = (await blocked.boundingBox())!;
    expect(blockedBox.y + blockedBox.height).toBeLessThan(footerBox.y);
    if (width === 1280 || width === 390) await page.screenshot({ path: `/tmp/gaudi-capture-queue-${width}.png` });
    if (width === 320 || width === 1280) {
      for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
        await page.evaluate(value => document.documentElement.style.setProperty('--ds-space-scale', String(value)), scale);
        expect(await queue.evaluate(el => el.scrollWidth - el.clientWidth), `${width}px at spacing scale ${scale}`).toBeLessThanOrEqual(1);
        const [body, actions] = await Promise.all([queue.boundingBox(), footer.boundingBox()]);
        expect(body!.y + body!.height).toBeLessThanOrEqual(actions!.y + 1);
      }
      await page.evaluate(() => document.documentElement.style.removeProperty('--ds-space-scale'));
      for (const section of ['scheduled', 'paused', 'blocked']) {
        await queue.getByRole('button', { name: `Expand ${section}`, exact: true }).click();
      }
      await expect(queue.locator('..').locator('[data-slot="scroll-area-thumb"]')).toBeVisible();
      await queue.press('End');
      await expect.poll(() => queue.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThanOrEqual(1);
      const details = queue.getByText('Blocked sources wait for a curator to update their capture rules.');
      await expect(details).toBeInViewport();
      const [detailsBox, actionsBox] = await Promise.all([details.boundingBox(), footer.boundingBox()]);
      expect(detailsBox!.y + detailsBox!.height).toBeLessThan(actionsBox!.y);
    }
  }
});

test('capture queue supports touch scrolling inside its mobile drawer', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/preview/app-shell-crawler-control');
    await page.getByRole('button', { name: 'Toggle Sidebar', exact: true }).tap();
    const sheet = page.locator('[data-slot="sidebar"][data-mobile="true"]');
    await sheet.evaluate(async el => Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))));
    const queue = page.getByRole('region', { name: 'Capture queue runs', exact: true });
    const box = (await queue.boundingBox())!;
    const pageTop = await page.evaluate(() => scrollY);
    const cdp = await context.newCDPSession(page);
    const x = box.x + box.width / 2;
    const y = box.y + box.height - 30;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (const offset of [40, 80, 120, 160, 200]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - offset }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => queue.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(pageTop);
    await sheet.getByRole('button', { name: 'Close capture navigation' }).tap();
    await expect(sheet).toBeHidden();
  } finally {
    await context.close();
  }
});
