import { expect, test, type Page } from '@playwright/test';
const widths=[320,375,390,479,480,511,512,513,514,515,639,640,730,767,768,1023,1024,1279,1280,1440,1920];
async function ready(page:Page) {
  await page.goto('/preview/chat-delegation-agent-findings',{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('button',{name:'Filter by Security'})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="card"], [aria-label="Agent findings feed"], [data-slot="collapsible-content"], button[aria-pressed]').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
}
for(const mode of ['light','dark'] as const) test(`findings states responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);
  for(const state of ['Running','Completed','Error','Empty']) {
    await page.getByRole('radio',{name:state,exact:true}).click();
    if(state!=='Empty') await page.getByRole('button',{name:'Inspect Invites can grant owner access'}).click();
    for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  }
  expect(errors).toEqual([]);
});
test('agent and severity filters, evidence, reviewed state, updates and retry',async({page})=>{
  await ready(page);
  await page.getByRole('button',{name:'Filter by Security'}).press('Enter');
  await expect(page.getByRole('button',{name:'Filter by Security'})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Inspect Retry creates duplicate invitations'})).toHaveCount(0);
  await page.getByRole('button',{name:'Inspect Invites can grant owner access'}).press('Space');
  await expect(page.getByText('The invite handler accepts the requested role without checking whether the inviter may grant it.')).toBeVisible();
  await page.getByRole('button',{name:'Mark reviewed',exact:true}).click();
  await expect(page.getByText('Reviewed',{exact:true})).toBeVisible();
  await page.getByRole('radio',{name:'Warning',exact:true}).click();
  await expect(page.getByText('No matching findings')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters',exact:true}).last().click();
  await page.getByRole('button',{name:'Filter by Security'}).click();
  await page.getByRole('button',{name:'Filter by Testing'}).click();
  await expect(page.getByRole('button',{name:/^Inspect /})).toHaveCount(2);
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await page.getByRole('button',{name:'Next update'}).click();
  await expect(page.getByRole('button',{name:'Inspect Member rows repeat the same query'})).toBeVisible();
  await page.getByRole('button',{name:'Next update'}).click();
  await expect(page.getByText('56 of 56 checks')).toBeVisible();
  await expect(page.getByRole('button',{name:'Review complete'})).toBeDisabled();
  await expect(page.getByRole('button',{name:/^Inspect /})).toHaveCount(5);
  await page.getByRole('radio',{name:'Error',exact:true}).click();
  await expect(page.getByText('Connection lost. Findings preserved.')).toBeVisible();
  await page.getByRole('button',{name:'Retry agent'}).click();
  await expect(page.getByRole('button',{name:'Next update'})).toBeEnabled();
  await page.getByRole('radio',{name:'Empty',exact:true}).click();
  await page.getByRole('button',{name:'Start demo review'}).click();
  await expect(page.getByRole('button',{name:/^Inspect /})).toHaveCount(3);
});
test('touch, RTL and all spacing presets with expanded evidence',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try {
    const page=await context.newPage();await page.goto('/preview/chat-delegation-agent-findings#dir=rtl');
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await page.getByRole('button',{name:'Inspect Invites can grant owner access'}).tap();
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,479,480,511,512,513,514,515,768,1280]) {await page.setViewportSize({width,height:1100});await contained(page);if(scale===1.5 && width===320) await page.screenshot({path:'../.impeccable/review/agent-findings/rtl-large-spacing-320.png',fullPage:true});}
    }
    await page.getByRole('button',{name:'Mark reviewed',exact:true}).tap();
    await expect(page.getByText('Reviewed',{exact:true})).toBeVisible();
  } finally {await context.close();}
});
test('docs show local findings preview and full source',async({page})=>{
  await page.goto('/docs/chat/chat-agent-findings#agent-findings');
  const iframe=page.locator('iframe[title="Agent findings preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/chat-delegation-agent-findings#dir=ltr');
  const frame=page.frameLocator('iframe[title="Agent findings preview"]');
  await expect(frame.getByRole('button',{name:'Next update'})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatAgentFindings');
  await expect(example.getByRole('tabpanel')).toContainText('const findings');
});
