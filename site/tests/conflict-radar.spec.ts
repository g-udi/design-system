import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const widths=[320,375,390,479,480,639,640,703,704,735,736,737,767,768,1024,1055,1056,1057,1280,1440,1920];
const shots=fileURLToPath(new URL('../../.impeccable/review/conflict-radar',import.meta.url));
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/chat-delegation-conflict-radar${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('heading',{name:'Conflict radar',exact:true,level:2})).toBeVisible({timeout:90000});
  await expect(page.getByRole('radio',{name:'Security',exact:true})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('button:not([role="radio"]),[data-slot="radio-group"],footer').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  const viewport=page.getByRole('region',{name:'Files by agent scrollable table'});
  await expect(viewport).toBeVisible();
  expect(await viewport.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;})).toBe(true);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const mode of ['light','dark'] as const) test(`conflict radar responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths) {
    await page.setViewportSize({width,height:1000});await contained(page);
    if([390,1280,1440].includes(width))await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('radio',{name:'Security',exact:true}).click();await page.getByRole('button',{name:'mail.ts',exact:true}).click();await page.getByRole('radio',{name:'Retries',exact:true}).click();
  await page.getByRole('button',{name:'Next update',exact:true}).click();await page.getByRole('button',{name:'Next update',exact:true}).click();await page.getByRole('button',{name:'Merge demo changes',exact:true}).click();
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:1000});await contained(page);}
  await page.screenshot({path:`${shots}/${mode}-merged-1280.png`,fullPage:true});expect(errors).toEqual([]);
});
test('choices and completed agents both gate merging; reset and empty restore focus',async({page})=>{
  await ready(page);const merge=page.getByRole('button',{name:'Merge demo changes',exact:true});await expect(merge).toBeDisabled();
  const tests=page.getByRole('row').filter({hasText:'tests/invitations.spec.ts'});await expect(tests).toContainText('Separate ranges');await expect(tests).not.toContainText('Overlapping edits');
  await page.getByRole('radio',{name:'Security',exact:true}).click();await page.getByRole('button',{name:'mail.ts',exact:true}).click();await page.getByRole('radio',{name:'Retries',exact:true}).click();await expect(merge).toBeDisabled();
  await expect(page.getByText('Choices saved. Waiting for agents to finish.')).toBeVisible();
  await page.getByRole('button',{name:'Next update',exact:true}).click();await expect(merge).toBeDisabled();await page.getByRole('button',{name:'Next update',exact:true}).click();await expect(merge).toBeEnabled();
  await page.getByRole('button',{name:'Clear choice',exact:true}).click();await expect(merge).toBeDisabled();await expect(page.getByRole('radio',{name:'Delivery',exact:true})).toBeFocused();
  await page.getByRole('radio',{name:'Delivery',exact:true}).click();await merge.click();await expect(page.getByRole('status')).toHaveText('Demo merged: six files with your two chosen approaches. No repository was changed.');
  await expect(page.getByRole('radio',{name:'Delivery',exact:true})).toBeDisabled();await expect(page.getByRole('radio',{name:'Delivery',exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Reset demo'}).click();await expect(page.getByRole('radio',{name:'Security',exact:true})).not.toBeChecked();
  await page.getByRole('button',{name:'Empty snapshot'}).click();await expect(page.getByText('No edits to compare',{exact:true})).toBeVisible();await expect(page.getByRole('table')).toHaveCount(0);await expect(page.getByRole('button',{name:'Reset demo'})).toBeFocused();
  await page.getByRole('button',{name:'Start demo'}).click();await expect(page.getByRole('table',{name:'Files by agent'})).toBeVisible();
});
test('disconnect blocks merging but preserves selected approaches and progress',async({page})=>{
  await ready(page);await page.getByRole('radio',{name:'Security',exact:true}).click();await page.getByRole('button',{name:'mail.ts',exact:true}).click();await page.getByRole('radio',{name:'Retries',exact:true}).click();
  await page.getByRole('button',{name:'Next update'}).click();await page.getByRole('button',{name:'Simulate disconnect'}).click();await expect(page.getByRole('button',{name:'Next update'})).toBeDisabled();await expect(page.getByRole('button',{name:'Merge demo changes'})).toBeDisabled();
  await expect(page.getByRole('radio',{name:'Retries',exact:true})).toBeChecked();await page.getByRole('button',{name:'Retry connection'}).click();await expect(page.getByRole('radio',{name:'Retries',exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Next update'}).click();await expect(page.getByRole('button',{name:'Merge demo changes'})).toBeEnabled();
});
test('keyboard comparison and contained horizontal scrolling',async({page})=>{
  await ready(page);await page.setViewportSize({width:320,height:1000});
  const viewport=page.getByRole('region',{name:'Files by agent scrollable table'});await viewport.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Compare src/lib/mail.ts',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('radiogroup',{name:'Approaches for src/lib/mail.ts'})).toBeVisible();
  await page.getByRole('radio',{name:'Delivery',exact:true}).focus();await page.keyboard.press('ArrowDown',{delay:80});await expect(page.getByRole('radio',{name:'Retries',exact:true})).toBeChecked();await expect(page.getByRole('radio',{name:'Retries',exact:true})).toBeFocused();await contained(page);
});
test('touch RTL and density presets preserve comparison and table bounds',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1000}});
  try {
    const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,639,640,703,704,735,736,737,768,1055,1056,1057,1280,...[704,1024].flatMap(base=>[-1,0,1].map(offset=>base+32*scale+offset))]){await page.setViewportSize({width,height:1000});await contained(page);}
    }
    await page.setViewportSize({width:320,height:1000});await page.getByRole('button',{name:'mail.ts',exact:true}).tap();await page.getByRole('radio',{name:'Retries',exact:true}).tap();await contained(page);
    await mkdir(shots,{recursive:true});await page.screenshot({path:`${shots}/rtl-large-spacing-320.png`,fullPage:true});
  }finally{await context.close();}
});
test('docs embed the local conflict radar and include its complete source',async({page})=>{
  await page.goto('/docs/chat/chat-delegation#conflict-radar',{waitUntil:'domcontentloaded',timeout:90000});
  const iframe=page.locator('iframe[title="Conflict radar preview"]');await iframe.scrollIntoViewIfNeeded();await expect(iframe).toHaveAttribute('src','/preview/chat-delegation-conflict-radar#dir=ltr');
  await expect(page.frameLocator('iframe[title="Conflict radar preview"]').getByRole('radio',{name:'Security',exact:true})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/core/DataTable');await expect(example.getByRole('tabpanel')).toContainText('const files');
});
