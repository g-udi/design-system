import { expect, test, type Page } from '@playwright/test';
const widths=[320,375,390,639,640,679,680,681,711,712,713,767,768,799,800,801,1024,1280,1440,1920];
const captures='../.impeccable/review/agent-graph';
async function ready(page:Page){
  await page.goto('/preview/flow-agent-graph',{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.locator('.react-flow__node[data-id="lead"]')).toBeVisible({timeout:90000});
  await expect(page.locator('.react-flow__node')).toHaveCount(7);
}
async function settledInspector(page:Page){
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeInViewport({ratio:1});
  await expect(dialog).toHaveCSS('opacity','1');
  await dialog.evaluate(async el=>{await Promise.allSettled(el.getAnimations({subtree:true}).filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished));});
}
async function contained(page:Page){
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="flow-inspector"], [role="dialog"]').evaluateAll(es=>Math.max(0,...es.filter(e=>e.clientWidth).map(e=>e.scrollWidth-e.clientWidth)))).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('.ds-flow').evaluate(el=>{
    const r=el.getBoundingClientRect();return [...el.querySelectorAll('.react-flow__node')].every(n=>{const b=n.getBoundingClientRect();return b.left>=r.left&&b.right<=r.right&&b.top>=r.top&&b.bottom<=r.bottom;});
  })).toBe(true);
}
for(const mode of ['light','dark'] as const)test(`graph and inspector responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);
  for(const width of widths){await page.setViewportSize({width,height:1100});await contained(page);}
  for(const width of [1440,390,1280]){
    await page.setViewportSize({width,height:1100});await contained(page);await page.mouse.move(0,0);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await page.screenshot({path:`${captures}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Publisher: Needs approval'}).click();
  for(const width of widths){await page.setViewportSize({width,height:1100});await contained(page);await expect(page.getByRole('dialog',{name:'Publisher'})).toBeVisible();}
  await page.setViewportSize({width:390,height:1100});await page.getByRole('dialog',{name:'Publisher'}).waitFor();await settledInspector(page);await page.screenshot({path:`${captures}/${mode}-inspector-390.png`,fullPage:true});
  expect(errors).toEqual([]);
});
test('calls, edge weight, approvals, retry, motion and empty states',async({page})=>{
  await ready(page);
  const running=page.locator('.ds-flow-edge-flow');await expect(running).not.toHaveCount(0);
  await page.getByRole('button',{name:'Animate calls',exact:true}).click();await expect(running).toHaveCount(0);
  await page.getByRole('button',{name:'Next update'}).click();await expect(page.getByText('8 calls',{exact:true})).toBeVisible();
  await expect(page.locator('[data-testid="rf__edge-research-library"] .ds-flow-edge')).toHaveCSS('stroke-width','2.25px');
  await page.getByRole('button',{name:'Web search: Failed'}).click();
  await page.getByRole('button',{name:'Retry search'}).click();await expect(page.getByText('Recent calls',{exact:true})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('.react-flow__node[data-id="search"]')).toBeFocused();
  await page.getByRole('button',{name:'Publisher: Needs approval'}).click();await page.getByRole('button',{name:'Approve',exact:true}).click();
  await expect(page.getByText('Approved. Running…',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Next update'}).click();await page.getByRole('button',{name:'Next update'}).click();
  await expect(page.getByRole('button',{name:'Next update'})).toBeDisabled();await expect(page.getByRole('button',{name:'Web search: Failed'})).toHaveCount(0);
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  const writer=page.locator('.react-flow__node[data-id="writer"]');await writer.press('Enter');
  await expect(page.getByRole('dialog',{name:'Writer'})).toBeVisible();await page.getByRole('button',{name:'Deny',exact:true}).click();
  await page.keyboard.press('Escape');await expect(writer).toBeFocused();
  await page.getByRole('button',{name:'Clear network'}).click();await expect(page.getByText('No agents connected')).toBeVisible();
  await page.getByRole('button',{name:'Start demo network'}).click();await expect(page.locator('.react-flow__node')).toHaveCount(7);
});
test('touch, RTL, reduced motion and spacing presets',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try{const page=await context.newPage();await page.goto('/preview/flow-agent-graph#dir=rtl');await expect(page.locator('.react-flow__node')).toHaveCount(7,{timeout:90000});
    for(const scale of [.75,.875,1,1.25,1.5]){
      await page.evaluate(v=>document.documentElement.style.setProperty('--ds-space-scale',String(v)),scale);
      for(const width of [320,390,679,680,711,712,713,767,768,799,800,801,1280]){await page.setViewportSize({width,height:1100});await contained(page);}
    }
    await page.setViewportSize({width:320,height:1100});await contained(page);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`${captures}/rtl-large-spacing-320.png`,fullPage:true});
    await page.getByRole('button',{name:'Publisher: Needs approval'}).tap();
    for(const scale of [.75,.875,1,1.25,1.5]){await page.evaluate(v=>document.documentElement.style.setProperty('--ds-space-scale',String(v)),scale);for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:1100});await contained(page);}}
    await page.getByRole('button',{name:'Approve',exact:true}).tap();await expect(page.getByText('Approved. Running…',{exact:true})).toBeVisible();
    await expect(page.locator('.ds-flow-edge-flow').first()).toHaveCSS('animation-name','none');
  }finally{await context.close();}
});
test('docs preview and public source',async({page})=>{
  await page.goto('/docs/components/flow#agent-graph');
  const iframe=page.locator('iframe[title="Agent graph preview"]');await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toHaveAttribute('src','/preview/flow-agent-graph#dir=ltr');
  await expect(page.frameLocator('iframe[title="Agent graph preview"]').getByRole('region',{name:'Agent call network'})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();
  await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/core/Flow');await expect(example.getByRole('tabpanel')).toContainText('const initialCalls');
});
