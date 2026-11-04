import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const widths=[320,375,390,465,466,467,479,480,639,640,671,672,703,704,735,736,737,767,768,1024,1280,1440,1920];
const shots='../.impeccable/review/agent-steering';
async function ready(page:Page,suffix='') {
  await page.goto(`/preview/plan-agent-steering${suffix}`,{waitUntil:'domcontentloaded',timeout:90000});
  await expect(page.getByRole('textbox',{name:'Steer the agent',exact:true})).toBeVisible({timeout:90000});
}
async function contained(page:Page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect.poll(()=>page.locator('[data-slot="chat-plan"], [data-slot="timeline-item"], [data-slot="prompt-queue"], [data-slot="prompt-queue"] li,button,textarea').evaluateAll(nodes=>Math.max(0,...nodes.map(el=>el.scrollWidth-el.clientWidth)))).toBeLessThanOrEqual(1);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const mode of ['light','dark'] as const) test(`steering responsive in ${mode}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await ready(page);await mkdir(shots,{recursive:true});
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);if([390,1280,1440].includes(width)) await page.screenshot({path:`${shots}/${mode}-${width}.png`,fullPage:true});}
  await page.getByRole('textbox',{name:'Steer the agent',exact:true}).fill('Keep every existing source citation and preserve the examples, including https://example.test/'+ 'long-source-name-'.repeat(18));
  await page.getByRole('button',{name:'Queue for next step',exact:true}).click();
  await page.getByRole('button',{name:'Next step',exact:true}).click();
  for(const width of widths) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.getByRole('button',{name:'Pause run',exact:true}).click();
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:1100});await contained(page);}
  await page.getByRole('button',{name:'Resume run',exact:true}).click();await page.getByRole('button',{name:'Next step',exact:true}).click();await page.getByRole('button',{name:'Finish run',exact:true}).click();
  for(const width of [320,390,768,1280]) {await page.setViewportSize({width,height:1100});await contained(page);}
  expect(errors).toEqual([]);
});
test('queue, edit, remove and apply instructions with stable focus',async({page})=>{
  await ready(page);const input=page.getByRole('textbox',{name:'Steer the agent',exact:true});
  await page.getByRole('button',{name:'Edit: Keep the opening under 150 words.'}).click();
  const edit=page.getByRole('textbox',{name:'Edit queued message 1'});await edit.fill('Keep the opening under 120 words.');await edit.press('Enter');
  await page.getByRole('button',{name:'Next step',exact:true}).click();
  const write=page.locator('[data-slot="timeline-item"]').filter({has:page.getByRole('heading',{name:/Write the new opening/})});
  await expect(write).toContainText('Keep the opening under 120 words.');await expect(write).toContainText('Picked up at step start');await expect(write).toHaveAttribute('aria-current','step');
  await input.fill('Use a concrete example.');await input.press('Enter');await expect(input).toBeFocused();
  await page.getByRole('button',{name:'Apply now: Use a concrete example.'}).click();await expect(input).toBeFocused();await expect(write).toContainText('Applied immediately');
  await input.fill('Remove this note.');await input.press('Enter');await page.getByRole('button',{name:'Remove: Remove this note.'}).click();await expect(input).toBeFocused();
  await expect(page.getByText('Remove this note.',{exact:true})).toHaveCount(0);
});
test('shortcuts, IME, paused behavior and final-step drafts',async({page})=>{
  await ready(page);const input=page.getByRole('textbox',{name:'Steer the agent',exact:true});
  await input.fill('Keep this draft while composing.');
  await input.evaluate(el=>el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true,cancelable:true})));
  await expect(input).toHaveValue('Keep this draft while composing.');
  await input.press('Escape');await expect(input).toHaveValue('');
  await input.fill('First line');await input.press('Shift+Enter');await input.pressSequentially('Second line');await input.press('Control+Enter');
  await expect(page.getByRole('list',{name:'Step notes'}).getByText('First line\nSecond line',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Pause run',exact:true}).click();await input.fill('Wait for the next step.');await expect(page.locator('[data-slot="timeline-item"][aria-current="step"]')).toContainText('Outline the rewrite');
  await expect(page.getByRole('button',{name:'Apply now',exact:true})).toBeDisabled();await input.press('Meta+Enter');await expect(input).toHaveValue('Wait for the next step.');
  await input.press('Enter');await expect(page.locator('[data-slot="prompt-queue"]').getByText('Wait for the next step.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Next step',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Resume run',exact:true}).click();await page.getByRole('button',{name:'Next step',exact:true}).click();await page.getByRole('button',{name:'Next step',exact:true}).click();
  await input.fill('Do not remove the citations.');await expect(page.getByRole('button',{name:'Queue for next step',exact:true})).toBeDisabled();await expect(page.getByRole('button',{name:'Finish run',exact:true})).toBeDisabled();
  await input.press('Meta+Enter');await page.getByRole('button',{name:'Finish run',exact:true}).click();await expect(page.getByRole('textbox')).toBeDisabled();await expect(page.getByRole('list',{name:'Step notes'}).getByText('Do not remove the citations.',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Reset demo'}).click();await expect(page.getByText('1 of 4 done',{exact:true})).toBeVisible();
});
test('touch, RTL, densities, editing and collapsed plan',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,hasTouch:true,reducedMotion:'reduce',viewport:{width:390,height:1100}});
  try {
    const page=await context.newPage();await ready(page,'#dir=rtl');await expect(page.locator('html')).toHaveAttribute('dir','rtl');await mkdir(shots,{recursive:true});
    for(const scale of [.75,.875,1,1.25,1.5]) {
      await page.evaluate(value=>document.documentElement.style.setProperty('--ds-space-scale',String(value)),scale);
      for(const width of [320,390,639,640,704,736,768,1280,...[-1,0,1].map(offset=>418+48*scale+offset)]) {await page.setViewportSize({width,height:1100});await contained(page);}
      await page.setViewportSize({width:320,height:1100});await page.getByRole('button',{name:/^Edit: /}).tap();await contained(page);await page.getByRole('button',{name:'Cancel',exact:true}).tap();
    }
    await contained(page);await page.screenshot({path:`${shots}/rtl-large-spacing-320.png`,fullPage:true});
    await page.getByRole('button',{name:/Revision plan/}).tap();await expect(page.getByRole('list',{name:'Revision plan',exact:true})).toBeHidden();await contained(page);
    await page.getByRole('button',{name:/Revision plan/}).tap();await page.getByRole('button',{name:/^Apply now: /}).tap();await expect(page.getByRole('textbox',{name:'Steer the agent',exact:true})).toBeFocused();
  } finally {await context.close();}
});
test('docs have local steering preview and complete public source',async({page})=>{
  await page.goto('/docs/chat/chat-plan-panel#agent-steering',{waitUntil:'domcontentloaded',timeout:90000});
  const iframe=page.locator('iframe[title="Agent steering preview"]');await iframe.scrollIntoViewIfNeeded();await expect(iframe).toHaveAttribute('src','/preview/plan-agent-steering#dir=ltr');
  await expect(page.frameLocator('iframe[title="Agent steering preview"]').getByRole('textbox',{name:'Steer the agent',exact:true})).toBeVisible({timeout:90000});
  const example=page.getByTestId('example').filter({has:iframe});await example.getByRole('tab',{name:'Code',exact:true}).click();await expect(example.getByRole('tabpanel')).toContainText('@gaudi/design-system/chat/ChatPlanPanel');await expect(example.getByRole('tabpanel')).toContainText('function initialRun');
});
