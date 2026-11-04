import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const widths=[320,375,390,479,480,639,640,641,703,704,735,736,737,767,768,1024,1055,1056,1280,1440,1920];
const shots=fileURLToPath(new URL('../../.impeccable/review/context-map',import.meta.url));
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/treemap-chart-context-map${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('heading',{name:'Context map',exact:true,level:2})).toBeVisible({timeout:90000});
  await expect(page.locator('[data-slot="chart"]')).toHaveAttribute('data-state','ready');
  await expect(page.locator('svg.recharts-surface')).toBeVisible();
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const plot=page.locator('[data-slot="chart-plot"]');
  const demo=page.getByRole('region',{name:'Agent context map demo'});
  if(page.viewportSize()!.width<640 && await demo.count()) {
    const expected=(await demo.boundingBox())!.width;
    await expect.poll(async()=>Math.abs((await page.getByRole('button',{name:'Agent',exact:true}).boundingBox())!.width-expected)).toBeLessThanOrEqual(1);
  }
  expect(await plot.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;})).toBe(true);
  await expect.poll(()=>page.locator('button,footer').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  await expect.poll(()=>plot.locator('[data-chart-index] text').evaluateAll(nodes=>nodes.every(el=>{const text=el.getBoundingClientRect();const tile=el.parentElement!.querySelector('rect')!.getBoundingClientRect();return text.left>=tile.left-1&&text.right<=tile.right+1;}))).toBe(true);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const mode of ['light','dark'] as const)test(`context map responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths){await page.setViewportSize({width,height:1000});await contained(page);if([390,1280,1440].includes(width))await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});}
  await page.getByRole('button',{name:'Add tool result',exact:true}).click();await page.getByRole('button',{name:'Compact demo',exact:true}).click();
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:1000});await contained(page);if([390,1280].includes(width))await page.screenshot({path:`${shots}/${mode}-after-${width}.png`,fullPage:true});}
  expect(errors).toEqual([]);
});
test('keyboard and pointer inspect full names, available capacity and data',async({page})=>{
  await ready(page);const plot=page.getByRole('group',{name:'Invitation builder context allocation'});await plot.focus();await plot.press('Home');await plot.press('Enter');
  await expect(page.getByRole('heading',{name:'System instructions',exact:true})).toBeVisible();await plot.press('Escape');await expect(page.getByRole('button',{name:'Close details'})).toHaveCount(0);
  await plot.press('Home');for(let i=0;i<3;i++)await plot.press('ArrowRight');await plot.press('Space');await expect(page.getByRole('heading',{name:'src/invitations/create.ts',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Close details'}).click();await expect(plot).toBeFocused();
  await plot.press('End');await plot.press('Enter');await expect(page.getByRole('heading',{name:'Available capacity',exact:true})).toBeVisible();
  await page.locator('[data-chart-index="4"] rect').first().click();await expect(page.getByRole('heading',{name:'tests/invitations.spec.ts',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Show data'}).click();await expect(page.getByRole('table')).toBeVisible();await expect(page.getByRole('table')).toContainText('src/invitations/create.ts');await expect(page.getByRole('table')).toContainText('10,800');
});
test('compaction conserves capacity, keeps originals, and switches agent snapshots',async({page})=>{
  await ready(page);await page.getByRole('button',{name:'Add tool result'}).click();await expect(page.getByRole('status')).toHaveText('Search results added: 2,400 tokens.');await expect(page.getByRole('button',{name:'Add tool result'})).toBeDisabled();
  await page.getByRole('button',{name:'Compact demo'}).click();await expect(page.getByRole('heading',{name:'Session summary',exact:true})).toBeVisible();await expect(page.getByRole('status')).toContainText('8,600 tokens freed');
  await page.getByRole('radio',{name:'Before',exact:true}).click();await page.getByRole('button',{name:'Show data'}).click();await expect(page.getByRole('table')).toContainText('Search results');await expect(page.getByRole('table')).not.toContainText('Session summary');
  await page.getByRole('radio',{name:'After',exact:true}).click();await page.getByRole('button',{name:'Show data'}).click();await expect(page.getByRole('table')).toContainText('Session summary');await expect(page.getByRole('table')).not.toContainText('Search results');await expect(page.getByRole('table')).toContainText('17,000');
  await page.getByRole('button',{name:'Agent',exact:true}).click();await page.getByRole('option',{name:'Security reviewer',exact:true}).click();await expect(page.getByRole('group',{name:'Security reviewer context allocation'})).toBeVisible();await expect(page.getByRole('button',{name:'Compact demo'})).toBeEnabled();
  await page.getByRole('button',{name:'Clear context'}).click();await expect(page.getByText('Context cleared: the full capacity is available.')).toBeVisible();await expect(page.getByRole('button',{name:'Reset demo'})).toBeFocused();await page.getByRole('button',{name:'Show data'}).click();await expect(page.getByRole('table')).toContainText('24,000');await expect(page.getByRole('table')).not.toContainText('System instructions');
  await page.getByRole('button',{name:'Reset demo'}).click();await expect(page.getByRole('button',{name:'Compact demo'})).toBeEnabled();
});
test('touch RTL, spacing presets and open agent menu stay contained',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1000}});
  try{const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]){await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);for(const width of [320,390,639,640,641,767,768,1024,1280]){await page.setViewportSize({width,height:1000});await contained(page);}}
    await page.setViewportSize({width:320,height:1000});await page.getByRole('button',{name:'Agent',exact:true}).tap();const popup=page.getByRole('listbox');await expect(popup).toBeVisible();expect(await popup.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;})).toBe(true);await page.screenshot({path:`${shots}/rtl-menu-320.png`,fullPage:true});
    await page.getByRole('option',{name:'Security reviewer',exact:true}).tap();await page.getByRole('button',{name:'Compact demo'}).tap();await contained(page);await page.screenshot({path:`${shots}/rtl-after-320.png`,fullPage:true});
  }finally{await context.close();}
});
test('docs embed the local map and complete public source',async({page})=>{
  await page.goto('/docs/charts/treemap-chart#context-map',{waitUntil:'domcontentloaded',timeout:90000});const iframe=page.locator('iframe[title="Context map preview"]');await iframe.scrollIntoViewIfNeeded();await expect(iframe).toHaveAttribute('src','/preview/treemap-chart-context-map#dir=ltr');
  await expect(page.frameLocator('iframe[title="Context map preview"]').getByRole('button',{name:'Compact demo'})).toBeVisible({timeout:90000});const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/charts/TreemapChart');await expect(example.getByRole('tabpanel')).toContainText('const agents');
});

test('existing storage treemap keeps SVG labels inside tiles in RTL',async({page})=>{
  await page.goto('/preview/treemap-chart-storage-folders#dir=rtl',{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.locator('[data-slot="chart"]')).toHaveAttribute('data-state','ready');
  await expect(page.locator('svg.recharts-surface')).toBeVisible();
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:1000});await contained(page);}
});
