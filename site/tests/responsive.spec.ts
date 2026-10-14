import { expect, test, type Page } from '@playwright/test';

const widths = [320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440, 1920];

async function expectContained(page: Page) {
  const bounds = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    header: document.querySelector('header')!.scrollWidth,
    headerWidth: document.querySelector('header')!.clientWidth,
    main: document.querySelector('main')!.getBoundingClientRect().toJSON()
  }));
  expect(bounds.document).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.header).toBeLessThanOrEqual(bounds.headerWidth + 1);
  expect(bounds.main.right).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.main.left).toBeGreaterThanOrEqual(0);
}

for (const route of ['/', '/themes', '/docs/components', '/docs/components/accordion', '/docs/blocks/app-shell', '/docs/charts/line-chart']) {
  test(`responsive containment: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await expectContained(page);
      if (width === 390 || width === 1440) {
        await page.screenshot({ path: testInfo.outputPath(`${width}.png`) });
      }
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await expectContained(page);
  });
}

test('phone documentation navigation scrolls, navigates, and releases its focus trap', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/docs/components/accordion');
  const trigger = page.getByRole('button', { name: 'Open documentation navigation' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Documentation' });
  await expect(dialog).toBeVisible();
  const scroll = dialog.locator('.ds-app-navigation-scroll');
  expect(await scroll.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  const lastLink = dialog.getByRole('link', { name: 'Kanban', exact: true });
  await lastLink.scrollIntoViewIfNeeded();
  const link = await lastLink.boundingBox();
  expect(link!.y + link!.height).toBeLessThanOrEqual(568);
  expect(link!.height).toBeGreaterThanOrEqual(44);
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('link', { name: 'Button', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button\/?$/);
  await expect(dialog).toBeHidden();
  await expect(page.locator('main h1')).toHaveText('Button');
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(100);
});

test('documentation section dropdown fits the drawer and rail and supports keyboard navigation', async ({ page }, testInfo) => {
  await page.goto('/docs/components/accordion');
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 768 ? 568 : 900 });
    const drawer = page.getByRole('dialog', { name: 'Documentation' });
    if (width < 1024) await page.getByRole('button', { name: 'Open documentation navigation' }).click();
    const switcher = page.getByRole('button', { name: 'Section: Components' });
    if (width >= 1280) {
      await expect(switcher).toHaveCount(0);
      await expectContained(page);
      continue;
    }
    const triggerBounds = (await switcher.boundingBox())!;
    await switcher.click();
    const menu = page.getByRole('menu', { name: 'Section: Components' });
    await expect(menu.getByRole('menuitem')).toHaveCount(7);
    await expect(menu.getByRole('menuitem', { name: 'Components', exact: true })).toHaveAttribute('aria-current', 'page');
    const menuBounds = (await menu.boundingBox())!;
    expect(Math.abs(menuBounds.width - triggerBounds.width)).toBeLessThanOrEqual(1);
    expect(menuBounds.x).toBeGreaterThanOrEqual(0);
    expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(width);
    expect(menuBounds.y).toBeGreaterThanOrEqual(0);
    expect(menuBounds.y + menuBounds.height).toBeLessThanOrEqual(width < 768 ? 568 : 900);
    for (const item of await menu.getByRole('menuitem').all()) {
      const bounds = (await item.boundingBox())!;
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.y).toBeGreaterThanOrEqual(menuBounds.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(menuBounds.y + menuBounds.height);
    }
    if (width === 390 || width === 1024) await page.screenshot({ path: testInfo.outputPath(`section-menu-${width}.png`) });
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(switcher).toBeFocused();
    if (width < 1024) {
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
    }
    await expectContained(page);
  }

  await page.setViewportSize({ width: 375, height: 667 });
  await page.getByRole('button', { name: 'Open documentation navigation' }).click();
  const switcher = page.getByRole('button', { name: 'Section: Components' });
  await switcher.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Docs', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Components', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Blocks', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/blocks\/?$/);
  await expect(page.getByRole('dialog', { name: 'Documentation' })).toBeHidden();
  await page.getByRole('button', { name: 'Open documentation navigation' }).click();
  await expect(page.getByRole('button', { name: 'Section: Blocks' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1279, height: 900 });
  await page.getByRole('button', { name: 'Section: Blocks' }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole('menu', { name: 'Section: Blocks' })).toBeHidden();
});

for (const width of widths) {
  test(`sidebar position survives navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/docs/components/accordion');
    const compact = width < 1024;
    const trigger = page.getByRole('button', { name: 'Open documentation navigation' });
    const openNavigation = async () => {
      await trigger.click();
      await page.getByRole('dialog', { name: 'Documentation' }).evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => {})));
      });
    };
    if (compact) await openNavigation();
    const scroller = page.locator(compact ? '.ds-app-navigation-scroll' : '.site-docs > .ds-app-rail');
    const target = scroller.getByRole('link', { name: 'DropdownMenu', exact: true });
    await target.evaluate((link) => {
      const container = link.closest('.ds-app-rail, .ds-app-navigation-scroll')!;
      container.scrollTop += link.getBoundingClientRect().top - container.getBoundingClientRect().top - 200;
    });
    const before = await scroller.evaluate((element) => element.scrollTop);
    expect(before).toBeGreaterThan(0);
    const bounds = (await target.boundingBox())!;
    // Click the visible row without the automation driver's own scroll-into-view behavior.
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await expect(page.locator('main h1')).toHaveText('DropdownMenu');
    if (compact) {
      await expect(page.getByRole('dialog', { name: 'Documentation' })).toBeHidden();
      await openNavigation();
    }
    await expect(target).toHaveAttribute('aria-current', 'page');
    await expect.poll(async () => Math.abs(await scroller.evaluate((element) => element.scrollTop) - before)).toBeLessThanOrEqual(1);
    if (compact) await page.keyboard.press('Escape');
    await expectContained(page);
  });
}

test('switching sidebar sections preserves open groups and scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/docs/components/accordion');
  const scroller = page.locator('.site-docs > .ds-app-rail');
  await scroller.getByRole('button', { name: 'Blocks 14', exact: true }).click();
  const target = scroller.getByRole('link', { name: 'App Shell', exact: true });
  await target.scrollIntoViewIfNeeded();
  const before = await scroller.evaluate((element) => element.scrollTop);
  const bounds = (await target.boundingBox())!;
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page.locator('main h1')).toHaveText('App Shell');
  await expect(scroller.getByRole('button', { name: 'Components 76', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => Math.abs(await scroller.evaluate((element) => element.scrollTop) - before)).toBeLessThanOrEqual(1);
});

test('touch users can scroll the documentation drawer without moving the page', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/docs/components/accordion');
    await page.getByRole('button', { name: 'Open documentation navigation' }).tap();
    const dialog = page.getByRole('dialog', { name: 'Documentation' });
    const scroll = dialog.locator('.ds-app-navigation-scroll');
    await dialog.getByRole('link', { name: 'Kanban', exact: true }).scrollIntoViewIfNeeded();
    const before = await scroll.evaluate((el) => el.scrollTop);
    const pageScroll = await page.evaluate(() => scrollY);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 160, y: 220 }] });
    for (const y of [270, 320, 370, 420, 470, 520]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => scroll.evaluate((el) => el.scrollTop)).toBeLessThan(before);
    expect(await page.evaluate(() => scrollY)).toBe(pageScroll);
    await dialog.getByRole('button', { name: 'Close', exact: true }).tap();
    await expect(dialog).toBeHidden();
  } finally {
    await context.close();
  }
});

test('site menu exposes all primary destinations and closes across its breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/themes');
  const trigger = page.getByRole('button', { name: 'Open site navigation' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Explore Gaudi' });
  for (const label of ['Docs', 'Components', 'Blocks', 'Chat & Agents', 'Charts', 'Hooks', 'Themes']) {
    await expect(dialog.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(dialog).toBeHidden();
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(dialog).toBeHidden();
});

test('mobile contents links jump to sections without leaving the disclosure open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/components/accordion');
  const toc = page.locator('.site-mobile-toc');
  await toc.locator('summary').click();
  await toc.getByRole('link', { name: 'API', exact: true }).click();
  await expect(toc).not.toHaveAttribute('open', '');
  await expect(page).toHaveURL(/#api$/);
  await expect(page.locator('#api')).toBeInViewport();
});

test('keyboard focus stays visible on the skip link and header controls', async ({ page }) => {
  await page.goto('/themes');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  for (let step = 0; step < 6; step++) {
    const focus = await page.locator(':focus').evaluate((el) => {
      const style = getComputedStyle(el);
      return { outline: style.outlineStyle, width: parseFloat(style.outlineWidth), shadow: style.boxShadow };
    });
    expect((focus.outline !== 'none' && focus.width >= 2) || focus.shadow !== 'none').toBe(true);
    await page.keyboard.press('Tab');
  }
});

test('tablet previews scroll inside the example and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/components/accordion');
  const example = page.getByTestId('example').first();
  await example.getByRole('radio', { name: 'Tablet (768px)', exact: true }).click();
  const stage = example.getByRole('region', { name: /preview viewport/ });
  expect(await stage.evaluate((el) => el.scrollWidth)).toBe(768);
  const frame = example.getByTestId('preview-frame');
  expect((await frame.boundingBox())!.width).toBe(768);
  await expectContained(page);
  expect(await stage.locator(':scope > div').evaluate((el) => getComputedStyle(el).transitionProperty)).toBe('none');
  await example.getByRole('radio', { name: 'Desktop', exact: true }).click();
  expect((await frame.boundingBox())!.width).toBeLessThan(320);
});

for (const route of ['/docs/blocks/app-shell', '/docs/charts/line-chart', '/docs/components/dropdown-menu']) {
  test(`live example fits its responsive frame: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    const example = page.getByTestId('example').first();
    const frame = page.frameLocator('[data-testid="preview-frame"]').first();
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await example.scrollIntoViewIfNeeded();
      await expect(frame.locator('[data-pattern][data-ready="true"]')).toBeVisible();
      const bounds = await frame.locator('html').evaluate((el) => ({ width: el.clientWidth, scroll: el.scrollWidth }));
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.width + 1);
      if (width === 320 || width === 1440) await example.screenshot({ path: testInfo.outputPath(`example-${width}.png`) });
    }
  });
}
