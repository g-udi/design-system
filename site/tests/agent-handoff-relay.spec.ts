import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const widths = [320,375,390,639,640,767,768,895,896,897,927,928,929,959,960,961,1024,1280,1440,1920];
const shots = '../.impeccable/review/agent-handoff-relay';
async function ready(page:Page, suffix='') {
  await page.goto(`/preview/chat-delegation-handoff-relay${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('button',{name:'Restore context',exact:true})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('ol[aria-label="Agent handoff relay"],ol[aria-label="Agent handoff relay"] li,button').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for (const mode of ['light','dark'] as const) test(`relay responds across sizes and states in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths) {
    await page.setViewportSize({width,height:1000});await contained(page);
    const columns=await page.locator('ol[aria-label="Agent handoff relay"]').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width>=960?3:1);
    if([390,1280,1440].includes(width)) await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Simulate disconnect'}).click();
  for(const width of [320,390,768,928,1440]) {await page.setViewportSize({width,height:1000});await contained(page);}
  await page.getByRole('button',{name:'Retry connection'}).click();
  await page.getByRole('button',{name:'Restore context',exact:true}).click();
  await page.getByRole('button',{name:'Finish review'}).click();
  for(const width of widths) {await page.setViewportSize({width,height:1000});await contained(page);}
  await page.getByRole('button',{name:'Reset demo'}).click();
  await expect(page.getByRole('button',{name:/^Inspect /})).toHaveCount(0);
  for(const width of [320,390,768,928,1440]) {await page.setViewportSize({width,height:1000});await contained(page);}
  expect(errors).toEqual([]);
});
test('context restoration, keyboard disclosures, replay and reconnect preserve state',async({page})=>{
  await ready(page);
  await expect(page.getByRole('button',{name:'Finish review'})).toBeDisabled();
  const disclosure=page.getByRole('button',{name:'Inspect Writer to Reviewer'});
  await disclosure.press('Enter');await expect(disclosure).toHaveAttribute('aria-expanded','false');
  await disclosure.press('Space');await expect(disclosure).toHaveAttribute('aria-expanded','true');
  await page.getByRole('button',{name:'Simulate disconnect'}).click();
  await expect(page.getByRole('status')).toContainText('All handoffs are preserved');
  await page.getByRole('button',{name:'Restore context',exact:true}).press('Enter');
  await expect(page.getByRole('button',{name:'Context restored',exact:true})).toBeFocused();
  await expect(page.getByRole('button',{name:'Finish review'})).toBeDisabled();
  await page.getByRole('button',{name:'Retry connection'}).click();
  await page.getByRole('button',{name:'Finish review'}).click();
  await expect(page.getByText('Ready for your review')).toBeVisible();
  await expect(page.getByRole('button',{name:'Review complete',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Reset demo'}).click();
  await expect(page.getByRole('status')).toContainText('No handoffs yet');
  await page.getByRole('button',{name:'Next step'}).click();
  await expect(page.getByText('4 items passed')).toBeVisible();
  await expect(page.getByRole('button',{name:'Inspect Writer to Reviewer'})).toHaveCount(0);
  await page.getByRole('button',{name:'Next step'}).click();
  await expect(page.getByRole('button',{name:'Restore context',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Finish review'})).toBeDisabled();
});
test('touch and RTL at all spacing presets',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1000}});
  try {
    const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,927,928,929,959,960,961,1280]) {await page.setViewportSize({width,height:1000});await contained(page);}
    }
    await page.setViewportSize({width:320,height:1000});await contained(page);await mkdir(shots,{recursive:true});
    await page.screenshot({path:`${shots}/rtl-large-spacing-320.png`,fullPage:true});
    await page.getByRole('button',{name:'Restore context',exact:true}).tap();await page.getByRole('button',{name:'Finish review'}).tap();
    await expect(page.getByText('Ready for your review')).toBeVisible();
  } finally {await context.close();}
});
test('docs include local relay and copyable source',async({page})=>{
  await page.goto('/docs/chat/chat-delegation#agent-handoff-relay',{waitUntil:'domcontentloaded',timeout:90000});
  const iframe=page.locator('iframe[title="Agent handoff relay preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/chat-delegation-handoff-relay#dir=ltr');
  await expect(page.frameLocator('iframe[title="Agent handoff relay preview"]').getByRole('button',{name:'Restore context',exact:true})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatAgentMark');
  await expect(example.getByRole('tabpanel')).toContainText('const handoffs');
});
