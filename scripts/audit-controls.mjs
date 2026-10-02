// Control audit: every Playground control must visibly change the rendered preview.
// Run against a running Storybook: `node scripts/audit-controls.mjs [http://localhost:6007]`.
// A control whose effect only shows during interaction (for example scroll smoothing)
// is declared on the story: parameters.controlAudit.interaction = ['smooth'].
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:6007';
const index = await (await fetch(`${base}/index.json`)).json();
const ids = Object.values(index.entries).filter((entry) => entry.type === 'story' && entry.name === 'Playground').map((entry) => entry.id);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failures = {};

for (const id of ids) {
  // A dev server compiles each story on first visit; retry once so a slow compile is not reported as a crash.
  try {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { timeout: 60000 });
  } catch {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { timeout: 90000 });
  }
  await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.storyStoreValue, null, { timeout: 30000 });
  await page.waitForTimeout(2500);
  const dead = await page.evaluate(async (storyId) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
    const story = await window.__STORYBOOK_PREVIEW__.storyStoreValue.loadStory({ storyId });
    const interaction = story.parameters.controlAudit?.interaction || [];
    // Compare the whole body so portalled dialogs, popovers and menus count; ignore generated IDs.
    const signature = () => [...document.body.children]
      .filter((element) => !['SCRIPT', 'STYLE'].includes(element.tagName) && element.id !== 'storybook-docs')
      .map((element) => element.outerHTML).join('')
      .replace(/\s(id|aria-controls|aria-labelledby|aria-describedby|for|data-radix-[\w-]+)="[^"]*"/g, '');
    const initial = signature();
    const found = [];
    for (const [name, arg] of Object.entries(story.argTypes)) {
      const control = typeof arg.control === 'string' ? arg.control : arg.control?.type;
      if (!control || arg.control?.disable || arg.table?.disable || interaction.includes(name) || !(name in story.initialArgs)) continue;
      const current = story.initialArgs[name];
      let values = [];
      if (control === 'boolean') values = [!current];
      else if (['select', 'radio', 'inline-radio'].includes(control)) values = (arg.options || []).filter((value) => value !== current);
      else if (control === 'text') values = [`${current ?? ''} Zq`];
      else if (control === 'number' || control === 'range') values = [Number(current ?? 0) + (arg.control?.step || 1)];
      for (const value of values) {
        channel.emit('updateStoryArgs', { storyId, updatedArgs: { [name]: value } });
        await sleep(500);
        if (signature() === initial) found.push(`${name}=${JSON.stringify(value)}`);
        channel.emit('resetStoryArgs', { storyId, argNames: [name] });
        await sleep(300);
      }
    }
    return found;
  }, id);
  if (dead.length) failures[id] = dead;
}

await browser.close();
const count = Object.keys(failures).length;
if (count) {
  for (const [id, dead] of Object.entries(failures)) console.log(`${id}: ${dead.join(', ')}`);
  console.error(`${count} of ${ids.length} playgrounds have controls that do not change the preview.`);
  process.exit(1);
}
console.log(`Every control changes the preview across ${ids.length} playgrounds.`);
