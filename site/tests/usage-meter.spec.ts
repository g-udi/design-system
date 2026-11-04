import { expect, test, type Page } from '@playwright/test';
const widths = [320,375,390,399,400,639,640,730,767,768,1023,1024,1279,1280,1440,1920];
async function contained(page:Page) {
  await expect.poll(async()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(async()=>page.locator('[data-slot="card"], [data-slot="stat-meter"], [data-slot="chart"]').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
}
for(const mode of ['light','dark'] as const) {
  test(`usage meter responsive states in ${mode}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});
    await page.goto('/preview/stat-card-usage-meter');
    await expect(page.getByRole('meter',{name:'AI credits used'})).toHaveAttribute('aria-valuenow','7420');
    await expect(page.locator('[data-slot="chart"]')).toHaveAttribute('data-state','ready');
    await expect.poll(async()=>page.locator('.recharts-bar-rectangle').evaluateAll(bars=>bars.length > 0 && bars.every(bar=>bar.getBoundingClientRect().height > 0))).toBe(true);
    for(const state of ['Standard','Near limit','Limit reached','Empty']) {
      await page.getByRole('radio',{name:state,exact:true}).click();
      for(const width of widths) {
        await page.setViewportSize({width,height:1000});await contained(page);
        if(state==='Standard' && [390,730,1440].includes(width)) await page.screenshot({path:info.outputPath(`${mode}-${width}.png`),fullPage:true});
      }
    }
    expect(errors).toEqual([]);
  });
}
test('periods, chart keyboard, credit top-up and historical restriction',async({page})=>{
  await page.goto('/preview/stat-card-usage-meter');
  const credits=page.getByRole('meter',{name:'AI credits used'});
  await page.getByRole('radio',{name:'7 days',exact:true}).click();
  await expect(credits).toHaveAttribute('aria-valuenow','1820');
  const chart=page.getByRole('group',{name:'Daily credit usage, 7 days',exact:true});
  await chart.press('Home');
  await expect(page.locator('[data-slot="chart-readout"]')).toContainText('1 Nov');
  await chart.press('End');
  await expect(page.locator('[data-slot="chart-readout"]')).toContainText('7 Nov');
  await chart.press('Escape');
  await page.getByRole('radio',{name:'Near limit'}).click();
  await page.getByRole('button',{name:'Add credits',exact:true}).click();
  await page.getByRole('button',{name:'Add 2,000 demo credits'}).click();
  await expect(credits).toHaveAttribute('aria-valuemax','12000');
  await expect(page.getByRole('status')).toHaveText('2,600 credits available');
  await page.getByRole('radio',{name:'Last month'}).click();
  await expect(credits).toHaveAttribute('aria-valuemax','10000');
  await page.getByRole('button',{name:'Plan details',exact:true}).click();
  await expect(page.getByRole('button',{name:'Add 2,000 demo credits'})).toBeDisabled();
  await expect(page.getByText('Top-ups apply to the current cycle only.')).toBeVisible();
});
test('RTL density, open plan details, touch and existing meter consumers',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:900}});
  try {
    const page=await context.newPage();await page.goto('/preview/stat-card-usage-meter#dir=rtl');
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await page.getByRole('radio',{name:'Limit reached'}).tap();
    await page.getByRole('button',{name:'Add credits',exact:true}).tap();
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,1280]) { await page.setViewportSize({width,height:1000});await contained(page); }
    }
    await page.getByRole('button',{name:'Add 2,000 demo credits'}).tap();
    await expect(page.getByRole('meter',{name:'AI credits used'})).toHaveAttribute('aria-valuemax','12000');
    for(const slug of ['stat-card-lead-range','stat-card-breakdowns']) {
      await page.goto(`/preview/${slug}`);await expect(page.locator('[data-slot="stat-meter"]').first()).toBeVisible();
      for(const width of [320,390,768,1280,1920]) {await page.setViewportSize({width,height:1000});await contained(page);}
    }
  } finally {await context.close();}
});
test('assembled Stat Cards docs include the local meter and complete source',async({page})=>{
  await page.goto('/docs/blocks/stat-cards#usage-meter');
  const iframe=page.locator('iframe[title="Usage meter preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/stat-card-usage-meter#dir=ltr');
  const frame=page.frameLocator('iframe[title="Usage meter preview"]');
  await expect(frame.getByRole('meter',{name:'AI credits used'})).toHaveAttribute('aria-valuenow','7420');
  const example=page.getByTestId('example').filter({has:iframe});
  await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/blocks/StatCard');
  await expect(example.getByRole('tabpanel')).toContainText('const periods');
  await example.getByRole('tab',{name:'Preview',exact:true}).click();
  await expect(frame.getByRole('meter',{name:'AI credits used'})).toBeAttached();
});
