import { expect, test, type Page } from '@playwright/test';
const widths = [320,375,390,479,480,639,640,767,768,831,832,833,863,864,865,1023,1024,1279,1280,1440,1920];
const captures = '../.impeccable/review/agent-fleet';
async function ready(page:Page) {
  await page.goto('/preview/chat-delegation-agent-fleet',{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('tree',{name:'Research lead agents'})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('.fleet-example, [role="tree"], [role="treeitem"], [role="dialog"], .ds-accordion-trigger').evaluateAll(nodes=>Math.max(0,...nodes.filter(el=>el.clientWidth).map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
}
for(const mode of ['light','dark'] as const) test(`fleet responsive in ${mode}`,async({page})=>{
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);
  for(const lead of ['Research','Build','Verification']) {
    const trigger=page.getByRole('button',{name:`Show ${lead} lead`});
    if(await trigger.getAttribute('aria-expanded')!=='true') await trigger.click();
    await expect(page.getByRole('tree')).toHaveCount(1);
    for(const width of widths) { await page.setViewportSize({width,height:1100});await contained(page); }
  }
  await page.getByRole('button',{name:'Show Research lead'}).click();
  for(const width of [1440,390,1280]) {
    await page.setViewportSize({width,height:1000});await page.screenshot({path:`${captures}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('treeitem',{name:'Permissions, Needs you'}).click();
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.setViewportSize({width:390,height:1000});await page.screenshot({path:`${captures}/${mode}-dialog-390.png`,fullPage:true});
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Finish run'}).click();
  await expect(page.getByText('14 of 14 done')).toBeVisible();
  await expect(page.getByRole('button',{name:'Finish run'})).toBeDisabled();
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.getByRole('button',{name:'Clear fleet'}).click();
  await expect(page.getByText('No agents assigned')).toBeVisible();
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.getByRole('button',{name:'Start demo fleet'}).click();
  await expect(page.getByText('2 need you',{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
test('keyboard tree, single branch, approvals, retry and dismiss with focus restoration',async({page})=>{
  await ready(page);
  const research=page.getByRole('button',{name:'Show Research lead'});
  await research.press('ArrowDown');await expect(page.getByRole('button',{name:'Show Build lead'})).toBeFocused();
  await page.keyboard.press('End');await expect(page.getByRole('button',{name:'Show Verification lead'})).toBeFocused();
  await page.keyboard.press('Home');await expect(research).toBeFocused();
  await research.press('Space');await expect(page.getByRole('tree')).toHaveCount(0);
  await research.press('Enter');
  const inventory=page.getByRole('treeitem',{name:'Inventory, Done'});
  await inventory.press('ArrowDown');await expect(page.getByRole('treeitem',{name:'Permissions, Needs you'})).toBeFocused();
  await page.keyboard.press('End');await expect(page.getByRole('treeitem',{name:'Examples, Running'})).toBeFocused();
  await page.keyboard.press('Home');await expect(inventory).toBeFocused();
  await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('treeitem',{name:'Examples, Running'})).toHaveCount(0);
  await page.keyboard.press('Space');
  await expect(page.getByRole('treeitem',{name:'Examples, Running'})).toBeVisible();
  for(const action of ['Approve','Deny']) {
    await page.getByRole('treeitem').first().press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog',{name:'Permissions'})).toBeVisible();
    await page.getByRole('button',{name:action,exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('treeitem',{name:`Permissions, ${action==='Approve'?'Running':'Denied'}`})).toBeFocused();
    await page.getByRole('button',{name:'Reset',exact:true}).click();
  }
  for(const action of ['Retry agent','Dismiss failure']) {
    await page.getByRole('button',{name:'Show Build lead'}).click();
    await page.getByRole('treeitem').first().press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Space');
    await page.getByRole('button',{name:action,exact:true}).click();
    await expect(page.getByRole('treeitem',{name:`Importer, ${action==='Retry agent'?'Running':'Stopped'}`})).toBeFocused();
    await expect(page.getByText('1 needs you',{exact:true}).first()).toBeVisible();
    await page.getByRole('button',{name:'Reset',exact:true}).click();
  }
  await inventory.press('Home');await page.keyboard.press('Enter');await page.keyboard.press('Escape');await expect(inventory).toBeFocused();
});
test('touch RTL and all spacing scales',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try {
    const page=await context.newPage();await page.goto('/preview/chat-delegation-agent-fleet#dir=rtl');
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await page.getByRole('treeitem',{name:'Permissions, Needs you'}).tap();
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,863,864,865,1280]) {await page.setViewportSize({width,height:1100});await contained(page);}
    }
    await page.getByRole('button',{name:'Approve',exact:true}).tap();
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,768,863,864,865,1280]) {await page.setViewportSize({width,height:1100});await contained(page);}
    }
    await page.setViewportSize({width:320,height:1100});await page.screenshot({path:`${captures}/rtl-large-spacing-320.png`,fullPage:true});
  } finally {await context.close();}
});
test('docs include the native fleet preview and copyable source',async({page})=>{
  await page.goto('/docs/chat/chat-delegation#agent-fleet');
  const iframe=page.locator('iframe[title="Agent fleet preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/chat-delegation-agent-fleet#dir=ltr');
  await expect(page.frameLocator('iframe[title="Agent fleet preview"]').getByRole('tree',{name:'Research lead agents'})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/core/Tree');
  await expect(example.getByRole('tabpanel')).toContainText('const agents');
});
