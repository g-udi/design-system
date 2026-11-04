import { expect, test } from '@playwright/test';
const widths = [320, 375, 390, 639, 640, 730, 767, 768, 823, 1023, 1024, 1279, 1280, 1440, 1920];

for (const mode of ['light', 'dark'] as const) {
  test(`compact thinking phases fit every viewport in ${mode}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ colorScheme: mode });
    await page.clock.install({ time: '2026-01-01T00:00:00Z' });
    await page.clock.pauseAt('2026-01-01T00:01:00Z');
    await page.goto('/preview/reasoning-mini-thinking');
    const indicator = page.locator('[data-slot="activity-indicator"]');
    await expect(indicator).toBeVisible();
    expect(await indicator.evaluate(el => getComputedStyle(el).borderTopWidth)).toBe('1px');
    for (const [index, label] of ['Thinking', 'Reading the draft', 'Comparing headlines', 'Ready to reply'].entries()) {
      if (index) await page.clock.runFor(2200);
      await expect(indicator).toHaveText(label);
      if (index < 3) {
        const geometry = await indicator.locator('[data-slot="loader"]').evaluate(svg => {
          const bounds = svg.getBoundingClientRect();
          return [...svg.querySelectorAll('path')].every(path => {
            const ray = path.getBoundingClientRect();
            return ray.left >= bounds.left && ray.right <= bounds.right && ray.top >= bounds.top && ray.bottom <= bounds.bottom;
          });
        });
        expect(geometry).toBe(true);
      }
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        expect(await indicator.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
        const bounds = await indicator.boundingBox();
        expect(bounds!.height).toBeLessThan(40);
        if (index === 1 && [390,1280].includes(width)) await page.screenshot({ path: info.outputPath(`${mode}-${width}.png`), fullPage:true });
      }
    }
    await expect(indicator.locator('[data-slot="loader"]')).toHaveCount(0);
    await expect(indicator.locator('[data-active]')).toHaveCount(0);
    await page.getByRole('button',{name:'How this was checked'}).click();
    await expect(page.getByText(/Compared both headlines/)).toBeVisible();
    const replay = page.getByRole('button', {name:'Replay thinking'});
    await replay.press('Enter');
    await expect(indicator).toHaveText('Thinking');
    await expect(replay).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test('RTL density, reduced motion, long labels and touch replay', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch:true, reducedMotion:'reduce', viewport:{width:390,height:844} });
  try {
    const page = await context.newPage();
    await page.clock.install({ time: '2026-01-01T00:00:00Z' });
    await page.clock.pauseAt('2026-01-01T00:01:00Z');
    await page.goto('/preview/reasoning-mini-thinking#dir=rtl');
    const indicator = page.locator('[data-slot="activity-indicator"]');
    await expect(indicator).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    const motion = await indicator.evaluate(el => [...el.querySelectorAll('.ds-loader, .ds-loader-motion, .ds-part-activity-indicator-phase, .shimmer')].map(node=>getComputedStyle(node).animationName));
    expect(motion.every(name=>name==='none')).toBe(true);
    // Stress host-supplied translated copy without changing the component's geometry.
    await indicator.locator('[data-slot="shimmer"]').evaluate(el=>{el.textContent='Checking all reference documents and comparing the revised newsletter headline with the original draft';});
    for (const scale of [0.75,0.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale', String(value)),scale);
      for (const width of [320,390,768,1280]) {
        await page.setViewportSize({width,height:900});
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
        expect(await indicator.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
      }
    }
    await page.clock.runFor(6600);
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'Replay thinking'}).tap();
    await expect(indicator).toHaveText('Thinking');
  } finally { await context.close(); }
});

test('Mini thinking is available in Reasoning with copyable public source', async ({page})=>{
  await page.goto('/docs/chat/chat-reasoning#mini-thinking');
  const iframe = page.locator('iframe[title="Mini thinking preview"]');
  await iframe.scrollIntoViewIfNeeded();
  const frame = page.frameLocator('iframe[title="Mini thinking preview"]');
  await expect(frame.getByRole('status')).toBeVisible();
  const example = page.getByTestId('example').filter({has:iframe});
  await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatActivityIndicator');
  await expect(example.getByRole('tabpanel')).toContainText('const phases');
  await example.getByRole('tab',{name:'Preview',exact:true}).click();
  await expect(frame.getByRole('status')).toBeVisible();
});


test('Activity Indicator docs use local interactive frames across screen sizes', async ({page}, info) => {
  const storybookRequests: string[] = [];
  page.on('request',request=>{ if(request.url().includes(':6006')) storybookRequests.push(request.url()); });
  await page.goto('/docs/chat/chat-activity-indicator#examples');
  await expect(page.locator('iframe')).toHaveCount(2);
  for (const [name,title] of [['activity-indicator-playground','Playground'],['activity-indicator-reply-lifecycle','A reply from thinking to done']]) {
    const iframe=page.locator(`iframe[title="${title} preview"]`);
    await expect(iframe).toHaveAttribute('src',`/preview/${name}#dir=ltr`);
    await iframe.scrollIntoViewIfNeeded();
    await expect(page.frameLocator(`iframe[title="${title} preview"]`).getByRole('status')).toBeVisible();
    const example=page.getByTestId('example').filter({has:iframe});
    await example.getByRole('tab',{name:'Code',exact:true}).click();
    await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatActivityIndicator');
    await example.getByRole('tab',{name:'Preview',exact:true}).click();
  }
  for (const width of widths) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(storybookRequests).toEqual([]);
  await page.goto('/preview/activity-indicator-reply-lifecycle');
  await expect(page.getByRole('status')).toHaveText('Done');
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  await expect(page.getByRole('status')).toHaveText('Thinking');
  for (const width of [320,390,768,1280,1920]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({width:390,height:700});
  await page.screenshot({path:info.outputPath('activity-lifecycle-390.png')});
});
