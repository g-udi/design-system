import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const shots=fileURLToPath(new URL('../../.impeccable/review/agent-panels',import.meta.url));
const widths=[320,375,390,479,480,639,640,767,768,895,896,1023,1024,1279,1280,1440,1920];
test('agent patterns index exposes four public panels and eight workflows across responsive widths',async({page})=>{
  await mkdir(shots,{recursive:true});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/docs/chat/agent-patterns',{waitUntil:'domcontentloaded',timeout:90000});
  const article=page.locator('article');
  await expect(article.getByRole('heading',{name:'Agent patterns',exact:true})).toBeVisible();
  for(const name of ['Agent findings','Agent checkpoints','Agent queue','Context window','Agent fleet','Agent handoff','Agent steering','Conflict radar','Agent graph','Context map','Usage meter','Cited answer']) await expect(article.getByRole('link',{name,exact:true})).toHaveCount(1);
  for(const width of widths) {
    await page.setViewportSize({width,height:1050});
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});
test('phone navigation opens the agent patterns section and restores focus on dismissal',async({page})=>{
  await page.setViewportSize({width:390,height:1000});
  await page.goto('/docs/chat/agent-patterns',{waitUntil:'networkidle'});
  const menu=page.getByRole('button',{name:'Open documentation navigation'});
  await expect(menu).toHaveAttribute('aria-haspopup','dialog');
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('a[href="/docs/chat/agent-patterns"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(menu).toBeFocused();
});
test('workflow pages expose native previews and links to their actual owners',async({page})=>{
  for(const [slug,preview,title] of [['fleet','chat-delegation-agent-fleet','Agent fleet'],['handoff','chat-delegation-handoff-relay','Agent handoff'],['steering','plan-agent-steering','Agent steering'],['conflict-radar','chat-delegation-conflict-radar','Conflict radar'],['graph','flow-agent-graph','Agent graph'],['context-map','treemap-chart-context-map','Context map'],['usage-meter','stat-card-usage-meter','Usage meter'],['cited-answer','chat-sources-linked-answer','Cited answer']]) {
    const response=await page.goto(`/docs/chat/agent-patterns/${slug}`,{waitUntil:'domcontentloaded',timeout:90000});
    expect(response?.status()).toBe(200);
    await expect(page.locator('article').getByRole('heading',{name:title,exact:true,level:1})).toBeVisible();
    await expect(page.locator(`iframe[src^="/preview/${preview}"]`)).toHaveCount(1);
    await expect(page.locator('article').getByRole('link',{name:/ API$/})).toHaveCount(1);
  }
});
test('extracted panels keep their desktop and phone compositions',async({browser,baseURL})=>{
  await mkdir(shots,{recursive:true});
  const cases=[...['findings','checkpoints','queue','context'].flatMap(name=>[390,1280,320].map(width=>({name,width}))),...[390,768,1280].map(width=>({name:'index',width}))];
  const routes:Record<string,string>={findings:'/preview/chat-delegation-agent-findings',checkpoints:'/preview/message-scroller-agent-checkpoints',queue:'/preview/chat-delegation-agent-queue',context:'/preview/prompt-composer-context-window',index:'/docs/chat/agent-patterns'};
  for(const {name,width} of cases) {
    const rtl=width===320;
    const context=await browser.newContext({baseURL,viewport:{width,height:2000},colorScheme:rtl?'dark':'light',reducedMotion:'reduce'});
    try {
      const page=await context.newPage();
      await page.goto(routes[name]+(rtl?'#dir=rtl':''),{waitUntil:'networkidle',timeout:90000});
      await expect(page.getByRole('heading',{name:name==='index'?'Agent patterns':name==='context'?'Context window':`Agent ${name}`,level:name==='index'?1:2,exact:true})).toHaveCount(1);
      await page.evaluate(()=>document.fonts.ready);
      // A fixed viewport avoids Chromium's captureBeyondViewport compositor artifacts.
      await page.screenshot({path:`${shots}/${name}-${rtl?'rtl-dark-':''}${width}.png`,fullPage:false,animations:'disabled'});
    } finally {await context.close();}
  }
});
