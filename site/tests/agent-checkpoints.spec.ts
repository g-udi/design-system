import { expect, test, type Page } from '@playwright/test';
const widths = [320,375,390,399,400,639,640,730,767,768,1023,1024,1279,1280,1440,1920];
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="card"], [aria-label="Checkpoint history"]').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
}
for(const mode of ['light','dark'] as const) test(`checkpoint modes responsive in ${mode}`,async({page})=>{
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});
  await page.goto('/preview/message-scroller-agent-checkpoints');
  await expect(page.getByRole('button',{name:'Finish step'})).toBeVisible({timeout:90000});
  for(const state of ['Interactive','Read-only','Empty']) {
    await page.getByRole('radio',{name:state,exact:true}).click();
    for(const width of widths) {await page.setViewportSize({width,height:1000}); await contained(page);}
    if(state==='Read-only') await expect(page.getByRole('button',{name:/Rewind to/})).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
test('rewind preserves history, stops running work and supports switching and outcomes',async({page})=>{
  await page.goto('/preview/message-scroller-agent-checkpoints');
  const rewind=page.getByRole('button',{name:'Rewind to Mapped the checkout flow'});
  await rewind.focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('region',{name:'Attempt 3',exact:true})).toBeAttached();
  await expect(page.getByText('Stopped',{exact:true})).toBeAttached();
  await expect(page.locator('[aria-current="step"]')).toHaveText('Retry from “Mapped the checkout flow”');
  await expect(page.getByText('6 checkpoints · 3 attempts')).toBeVisible();
  await page.getByRole('button',{name:'Finish step'}).click();
  await expect(page.getByText('All 12 checks passed. Workspace snapshot saved.')).toBeAttached();
  await page.getByRole('button',{name:'Switch to attempt 1'}).click();
  await expect(page.locator('[aria-current="step"]')).toHaveText('Validation failed');
  await expect(page.getByRole('region',{name:'Attempt 3',exact:true})).toBeAttached();
  await page.getByRole('button',{name:'Reset demo'}).click();
  await page.getByRole('button',{name:'Fail step'}).click();
  await expect(page.getByText('The retry check failed. Rewind to a saved checkpoint to try again.')).toBeAttached();
  await page.getByRole('radio',{name:'Empty',exact:true}).click();
  await page.getByRole('button',{name:'Load demo run'}).click();
  await expect(page.getByRole('button',{name:'Finish step'})).toBeEnabled();
});
test('touch, RTL, spacing presets and long retained history',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:900}});
  try {
    const page=await context.newPage();await page.goto('/preview/message-scroller-agent-checkpoints#dir=rtl');
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:1000});await contained(page);}
    }
    await page.evaluate(()=>document.documentElement.style.removeProperty('--ds-space-scale'));
    for(let i=0;i<15;i++) await page.getByRole('button',{name:'Rewind to Mapped the checkout flow'}).tap();
    await expect(page.getByText('20 checkpoints · 17 attempts')).toBeVisible();
    const history=page.getByRole('region',{name:'Checkpoint history'});
    expect(await history.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
    await contained(page);
    await page.getByRole('button',{name:'Finish step'}).tap();
    await expect(page.getByText('All 12 checks passed. Workspace snapshot saved.')).toBeAttached();
  } finally {await context.close();}
});
test('docs embed a local preview and complete copyable source',async({page})=>{
  await page.goto('/docs/chat/chat-agent-checkpoints#agent-checkpoints');
  const iframe=page.locator('iframe[title="Agent checkpoints preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/message-scroller-agent-checkpoints#dir=ltr');
  const frame=page.frameLocator('iframe[title="Agent checkpoints preview"]');
  await expect(frame.getByRole('button',{name:'Finish step'})).toBeVisible();
  const example=page.getByTestId('example').filter({has:iframe});
  await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatAgentCheckpoints');
  await expect(example.getByRole('tabpanel')).toContainText('initialCheckpoints');
});
