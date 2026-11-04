import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const widths=[320,375,390,479,480,511,512,513,639,640,641,703,704,735,736,737,767,768,1024,1280,1440,1920];
const shots=fileURLToPath(new URL('../../.impeccable/review/context-window',import.meta.url));
const meter=(page:Page)=>page.getByRole('button',{name:/^Context:/});
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/prompt-composer-context-window${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('heading',{name:'Context window',exact:true,level:2})).toBeVisible({timeout:90000});
  await expect(page.locator('[data-context-cells] > span')).toHaveCount(100);
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('button').evaluateAll(nodes=>Math.max(0,...nodes.filter(el=>el.getBoundingClientRect().width>0).map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  const cells=page.locator('[data-context-cells]');
  expect(await cells.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;})).toBe(true);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
async function popoverBounds(page:Page) {
  const popup=page.getByRole('dialog',{name:'Context window',exact:true});await expect(popup).toBeVisible();
  expect(await popup.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&el.scrollWidth<=el.clientWidth+1;})).toBe(true);
}
for(const mode of ['light','dark'] as const)test(`context window responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths){await page.setViewportSize({width,height:1100});await contained(page);if([390,1280,1440].includes(width))await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});}
  await page.getByRole('button',{name:'Compact conversation',exact:true}).click();await expect(page.locator('p[role="status"]')).toContainText('Freed 7,600 tokens');
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:1100});await contained(page);if([390,1280].includes(width))await page.screenshot({path:`${shots}/${mode}-compacted-${width}.png`,fullPage:true});}
  await meter(page).click();await popoverBounds(page);await expect(page.getByRole('dialog',{name:'Context window'})).toContainText('21,400');await page.screenshot({path:`${shots}/${mode}-meter-1280.png`,fullPage:true});expect(errors).toEqual([]);
});
test('file disclosure, removal, highlighting and meter share prepared values',async({page})=>{
  await ready(page);const files=page.getByRole('button',{name:/^Files/});await files.focus();await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Remove src/invitations/create.ts'})).toHaveCount(0);await page.keyboard.press('Enter');await expect(files).toHaveAttribute('aria-expanded','true');
  await page.getByRole('button',{name:'Remove src/invitations/create.ts'}).click();await expect(files).toBeFocused();await expect(meter(page)).toHaveAccessibleName(/21,400 of 32,000/);await expect(page.locator('p[role="status"]')).toContainText('original file unchanged');
  const system=page.getByRole('button',{name:'System instructions 1,600',exact:true});await system.click();await expect(system).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Reset demo'}).focus();await page.mouse.move(0,0);await expect(page.locator('[data-part="system"]').first()).toHaveCSS('opacity','1');await expect(page.locator('[data-part="tools"]').first()).toHaveCSS('opacity','0.25');
  await meter(page).click();await popoverBounds(page);await page.keyboard.press('Escape');await expect(meter(page)).toBeFocused();
});
test('failed compaction preserves context, retry succeeds and busy actions stay blocked',async({page})=>{
  await ready(page);await page.getByRole('checkbox',{name:'Fail the next compaction'}).check();await page.getByRole('button',{name:'Compact conversation',exact:true}).click();
  await expect(page.getByRole('button',{name:'Compacting…',exact:true})).toHaveAttribute('aria-disabled','true');await expect(page.getByRole('button',{name:'Remove src/invitations/create.ts'})).toBeDisabled();await expect(page.getByRole('button',{name:'New demo chat'})).toBeDisabled();
  await expect(page.locator('p[role="status"]')).toContainText('Compaction failed');await expect(meter(page)).toHaveAccessibleName(/29,000 of 32,000/);await expect(page.getByRole('button',{name:'Retry compaction'})).toBeFocused();await page.screenshot({path:`${shots}/failed-1280.png`,fullPage:true});
  await page.getByRole('button',{name:'Retry compaction'}).click();await expect(page.locator('p[role="status"]')).toContainText('Freed 7,600 tokens');await expect(meter(page)).toHaveAccessibleName(/21,400 of 32,000/);await expect(page.getByRole('button',{name:'Compacted',exact:true})).toBeFocused();await expect(page.getByRole('button',{name:'Compacted',exact:true})).toHaveAttribute('aria-disabled','true');
});
test('full context preserves draft, recovery allows send, new chat retains baseline',async({page})=>{
  await ready(page);const prompt=page.getByRole('combobox',{name:'Message',exact:true});await prompt.fill('Review invitation permissions');await page.getByRole('button',{name:'Fill demo window'}).click();await expect(prompt).toBeDisabled();await expect(prompt).toHaveValue('Review invitation permissions');await expect(page.getByRole('button',{name:'Send',exact:true})).toBeDisabled();await expect(meter(page)).toHaveAccessibleName(/100% used, 32,000 of 32,000/);
  await page.getByRole('button',{name:'Remove docs/invitation-requirements.md'}).click();await expect(prompt).toBeEnabled();await expect(prompt).toHaveValue('Review invitation permissions');await page.getByRole('button',{name:'Send',exact:true}).click();await expect(page.locator('p[role="status"]')).toContainText('800 tokens');await expect(meter(page)).toHaveAccessibleName(/27,200 of 32,000/);await expect(prompt).toHaveValue('');
  await page.getByRole('button',{name:'New demo chat'}).click();await expect(page.getByText('No files in this context.')).toBeVisible();await expect(meter(page)).toHaveAccessibleName(/5,400 of 32,000/);await expect(page.getByRole('button',{name:'Compact conversation'})).toHaveAttribute('aria-disabled','true');await page.screenshot({path:`${shots}/new-chat-1280.png`,fullPage:true});
  await page.getByRole('button',{name:'Reset demo'}).click();await expect(meter(page)).toHaveAccessibleName(/29,000 of 32,000/);await expect(page.getByRole('button',{name:'Remove src/invitations/create.ts'})).toBeVisible();
});
test('touch RTL and all spacing presets keep cells, file names and meter contained',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try {const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]){await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);for(const width of [320,390,479,480,511,512,513,639,640,641,768,1024,1280]){await page.setViewportSize({width,height:1100});await contained(page);}}
    await page.setViewportSize({width:320,height:1100});await page.screenshot({path:`${shots}/rtl-large-320.png`,fullPage:true});await meter(page).tap();await popoverBounds(page);const summary=page.getByText('29,000 of 32,000 tokens',{exact:true});
    expect(await summary.evaluate(el=>{const node=el.firstChild!;const first=document.createRange();first.setStart(node,0);first.setEnd(node,6);const second=document.createRange();second.setStart(node,10);second.setEnd(node,16);return first.getBoundingClientRect().left<second.getBoundingClientRect().left;})).toBe(true);
    await page.screenshot({path:`${shots}/rtl-meter-320.png`,fullPage:true});
  }finally{await context.close();}
});
test('docs embed the context window and complete copied source',async({page})=>{
  await page.goto('/docs/chat/chat-context-window#context-window',{waitUntil:'domcontentloaded',timeout:90000});const iframe=page.locator('iframe[title="Context window preview"]');await iframe.scrollIntoViewIfNeeded();await expect(iframe).toHaveAttribute('src','/preview/prompt-composer-context-window#dir=ltr');
  await expect(page.frameLocator('iframe[title="Context window preview"]').getByRole('button',{name:'Compact conversation',exact:true})).toBeVisible({timeout:90000});const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatInput');await expect(example.getByRole('tabpanel')).toContainText('const categories');
});
