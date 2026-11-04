import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const widths=[320,375,390,479,480,511,512,639,640,767,768,895,896,959,960,961,1024,1280,1440,1920];
const shots='../.impeccable/review/agent-queue';
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/chat-delegation-agent-queue${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('button',{name:'Add demo job',exact:true})).toBeVisible({timeout:90000});
  await expect(page.locator('[data-slot="agent-mark"] svg')).toHaveCount(2);
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-queue-layout], [data-queue-layout] section, [data-slot="popover-content"],button').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="chart-plot"] svg text').evaluateAll(nodes=>nodes.filter(el=>{const box=el.getBoundingClientRect();const plot=el.closest('[data-slot="chart-plot"]')?.getBoundingClientRect();return plot && (box.left<plot.left-1 || box.right>plot.right+1);}).map(el=>el.textContent))).toEqual([]);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const mode of ['light','dark'] as const) test(`queue responsive and popovers in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths) {
    await page.setViewportSize({width,height:1100});await contained(page);
    if([390,1280,1440].includes(width)) await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Simulate rate limit'}).click();
  for(const width of [320,390,768,959,960,961,1440]) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.setViewportSize({width:390,height:1100});
  await page.getByRole('button',{name:'Inspect Fetch the reference notes'}).click();
  const popup=page.getByRole('dialog');await expect(popup).toBeInViewport({ratio:1});await contained(page);
  await page.screenshot({path:`${shots}/${mode}-details-390.png`,fullPage:true});
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'Empty queue'}).click();
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  expect(errors).toEqual([]);
});
test('priority, cancellation, retries and popover focus',async({page})=>{
  await ready(page);
  const waiting=page.getByRole('region',{name:'Waiting jobs'});
  const source=page.getByRole('button',{name:'Inspect Build the source index'});
  await source.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');await expect(source).toBeFocused();
  await source.click();await page.getByRole('button',{name:'Move to front'}).click();
  await expect(waiting.getByRole('button').first()).toHaveAccessibleName('Inspect Build the source index');
  await expect(page.getByRole('button',{name:'Add demo job',exact:true})).toBeFocused();
  await source.click();await expect(page.getByRole('button',{name:'Move to front'})).toBeDisabled();
  await page.getByRole('button',{name:'Cancel job'}).click();
  await expect(waiting.getByRole('button',{name:'Inspect Build the source index'})).toHaveCount(0);
  await expect(page.getByRole('region',{name:'Recent results'}).getByRole('button').first()).toHaveAccessibleName('Inspect Build the source index');
  await page.getByRole('button',{name:'Inspect Fetch the reference notes'}).click();await page.getByRole('button',{name:'Retry job'}).click();
  await expect(waiting.getByRole('button',{name:'Inspect Fetch the reference notes'})).toContainText('Attempt 2');
  await expect(page.getByRole('button',{name:'Add demo job',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Next update'}).click();
  await page.getByRole('button',{name:'Inspect Check source availability'}).click();
  await page.getByRole('button',{name:'Retry job'}).click();
  await expect(waiting.getByRole('button').last()).toHaveAccessibleName('Inspect Check source availability');
});
test('pause, rate limits, capacity, draining and empty recovery',async({page})=>{
  await ready(page);
  const progress=page.getByRole('progressbar',{name:'Summarize the research brief progress'});
  await page.getByRole('button',{name:'Pause queue'}).click();await page.getByRole('button',{name:'Add demo job',exact:true}).click();
  await page.getByRole('button',{name:'Next update'}).click();await expect(progress).toHaveAttribute('aria-valuenow','50');
  await page.getByRole('button',{name:'Resume queue'}).click();await page.getByRole('button',{name:'Simulate rate limit'}).click();
  for(let i=0;i<3;i++) await page.getByRole('button',{name:'Next update'}).click();
  await expect(progress).toHaveAttribute('aria-valuenow','50');await expect(page.getByRole('status').filter({hasText:'Rate limit ended'})).toBeVisible();
  await page.getByRole('button',{name:'Next update'}).click();await expect(progress).toHaveAttribute('aria-valuenow','75');
  await expect(page.getByRole('region',{name:'Recent results'}).getByRole('button',{name:'Inspect Check source availability'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Remove idle worker'})).toBeDisabled();
  await page.getByRole('button',{name:'Add worker',exact:true}).click();await page.getByRole('button',{name:'Remove idle worker'}).click();
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Add worker',exact:true}).click();
  await expect(page.getByRole('button',{name:'Add worker',exact:true})).toBeDisabled();
  for(let i=0;i<10;i++) await page.getByRole('button',{name:'Next update'}).click();
  await expect(page.getByRole('region',{name:'Waiting jobs'}).getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await page.getByRole('button',{name:'Empty queue'}).click();
  await expect(page.getByRole('button',{name:'Play demo',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Add demo job',exact:true}).click();await page.getByRole('button',{name:'Next update'}).click();
  await expect(page.getByRole('region',{name:'Agent workers'}).getByRole('button',{name:'Inspect Review archive note 1'})).toBeVisible();
});
test('play advances jobs and inspecting stops playback; chart exposes data',async({page})=>{
  await ready(page);await page.getByRole('button',{name:'Play demo',exact:true}).click();
  await expect(page.getByRole('region',{name:'Recent results'}).getByRole('button',{name:'Inspect Check source availability'})).toBeVisible({timeout:10000});
  await page.getByRole('button',{name:'Inspect Check source availability'}).click();
  await expect(page.getByRole('button',{name:'Play demo',exact:true})).toHaveAttribute('aria-pressed','false');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:/Show data/})).toBeVisible();
  await page.getByRole('button',{name:/Show data/}).click();await expect(page.getByRole('table')).toBeVisible();
});
test('touch, RTL and density including an open job',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try {
    const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,959,960,961,1280]) {await page.setViewportSize({width,height:1100});await contained(page);}
      await page.setViewportSize({width:320,height:1100});
      await page.getByRole('button',{name:'Inspect Draft the archive introduction'}).tap();await contained(page);await expect(page.getByRole('dialog')).toBeInViewport({ratio:1});
      await page.getByRole('button',{name:'Close job details'}).tap();
    }
    await contained(page);await mkdir(shots,{recursive:true});await page.screenshot({path:`${shots}/rtl-large-spacing-320.png`,fullPage:true});
  } finally {await context.close();}
});
test('docs embed queue and complete public source',async({page})=>{
  await page.goto('/docs/chat/chat-agent-queue#agent-queue',{waitUntil:'domcontentloaded',timeout:90000});
  const iframe=page.locator('iframe[title="Agent queue preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/chat-delegation-agent-queue#dir=ltr');
  await expect(page.frameLocator('iframe[title="Agent queue preview"]').getByRole('button',{name:'Add demo job',exact:true})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/charts/AreaChart');
  await expect(example.getByRole('tabpanel')).toContainText('function advanceQueue');
});
