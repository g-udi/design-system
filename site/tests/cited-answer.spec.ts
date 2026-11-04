import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const widths=[320,375,390,479,480,639,640,671,672,703,704,735,736,737,767,768,1024,1280,1440,1920];
const shots=fileURLToPath(new URL('../../.impeccable/review/cited-answer',import.meta.url));
const names=['Source 1: What readers asked for in the September issue','Source 2: Writing an opening that earns the next paragraph','Source 3: September issue: editorial review'];
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/chat-sources-linked-answer${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('region',{name:'Answer with citations'})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="cited-answer"], [data-slot="toggle-group"], button, blockquote').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const mode of ['light','dark'] as const) test(`cited answer responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths) {
    await page.setViewportSize({width,height:1000});await contained(page);
    if([390,1280,1440].includes(width)) await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:names[0],exact:true}).first().click();
  for(const width of widths) {
    await page.setViewportSize({width,height:1000});await contained(page);
    if([390,1280,1440].includes(width)) await page.screenshot({path:`${shots}/${mode}-open-${width}.png`,fullPage:true});
  }
  expect(errors).toEqual([]);
});
test('source focus, hover, disclosure, keyboard navigation and Escape focus return',async({page})=>{
  await ready(page);const markers=page.getByRole('button',{name:names[0],exact:true});const chip=page.getByRole('radio',{name:names[0],exact:true});
  await markers.first().hover();await expect(page.locator('[data-slot="cited-answer-segment"][data-highlighted]')).toHaveCount(2);await expect(page.getByRole('region',{name:'Source passage'})).toBeHidden();
  await page.mouse.move(0,0);await expect(page.locator('[data-slot="cited-answer-segment"][data-highlighted]')).toHaveCount(0);
  await markers.first().focus();await expect(page.locator('[data-slot="cited-answer-segment"][data-highlighted]')).toHaveCount(2);
  await markers.first().press('Enter');await expect(markers.first()).toBeFocused();await expect(markers.first()).toHaveAttribute('aria-expanded','true');
  const preview=page.getByRole('region',{name:'Source passage'});await expect(preview.locator('blockquote')).toContainText('the practical example before the background');await expect(preview.locator('blockquote .bg-accent-muted')).toHaveCount(2);
  await expect(preview.getByRole('link',{name:/Open source/})).toHaveAttribute('href','https://example.com/editorial/reader-notes');
  await page.keyboard.press('Escape');await expect(preview).toBeHidden();await expect(chip).toBeFocused();
  await chip.press('ArrowRight');const second=page.getByRole('radio',{name:names[1],exact:true});await expect(second).toBeFocused();
  await second.press('Space');await expect(preview).toContainText('one concrete example');
  await second.press('End');const last=page.getByRole('radio',{name:names[2],exact:true});await expect(last).toBeFocused();await last.press('Enter');
  await expect(preview).toContainText('not a controlled comparison');await expect(preview.getByRole('link')).toHaveCount(0);
  await page.getByRole('button',{name:'Close source',exact:true}).click();await expect(last).toBeFocused();await expect(preview).toBeHidden();
  await last.press('Home');await expect(chip).toBeFocused();
});
test('copy quote announces success and failure without changing the original quote',async({page})=>{
  await ready(page);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as unknown as {copiedQuote:string}).copiedQuote=text;}}}));
  await page.getByRole('radio',{name:names[0],exact:true}).click();
  await page.getByRole('button',{name:'Copy quote',exact:true}).click();await expect(page.getByRole('status')).toHaveText('Quote copied.');
  expect(await page.evaluate(()=>(window as unknown as {copiedQuote:string}).copiedQuote)).toBe('Readers wanted the practical example before the background. Several said they saved the issue to return to the checklist, rather than reading it in one sitting.');
  await page.getByRole('radio',{name:names[1],exact:true}).click();await expect(page.getByRole('status')).not.toHaveText('Quote copied.');
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied');}}});document.execCommand=()=>false;});
  await page.getByRole('button',{name:'Copy quote',exact:true}).click();await expect(page.getByRole('status')).toContainText('Could not copy');
});
test('touch, RTL and five spacing presets keep source passages contained',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1000}});
  try {
    const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,639,640,703,704,735,736,737,768,1280]) {
        await page.setViewportSize({width,height:1000});await page.getByRole('radio',{name:names[1],exact:true}).tap();await contained(page);
        await page.getByRole('button',{name:'Close source',exact:true}).tap();await contained(page);
      }
    }
    await page.setViewportSize({width:320,height:1000});await page.getByRole('radio',{name:names[1],exact:true}).tap();await contained(page);
    await mkdir(shots,{recursive:true});await page.screenshot({path:`${shots}/rtl-large-spacing-320.png`,fullPage:true});
    await page.keyboard.press('Escape');await expect(page.getByRole('radio',{name:names[1],exact:true})).toBeFocused();
  } finally {await context.close();}
});
test('docs provide local preview and copyable public source',async({page})=>{
  await page.goto('/docs/chat/chat-sources#answer-linked-to-evidence',{waitUntil:'domcontentloaded',timeout:90000});
  const iframe=page.locator('iframe[title="Answer linked to evidence preview"]');await iframe.scrollIntoViewIfNeeded();await expect(iframe).toHaveAttribute('src','/preview/chat-sources-linked-answer#dir=ltr');
  await expect(page.frameLocator('iframe[title="Answer linked to evidence preview"]').getByRole('region',{name:'Answer with citations'})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatSources');await expect(example.getByRole('tabpanel')).toContainText('const segments');
});
