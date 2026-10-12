// Exercise the actual Docs control widgets, one component and value at a time.
// Stable rendered changes are evidence; timing, canvas and interaction-only results
// are reported for owner-specific checks, never silently counted as visual passes.
// Run: node scripts/audit-controls.mjs http://localhost:6006 [--inventory] [--filter=id]
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.argv[2] || 'http://localhost:6006';
const index = await (await fetch(`${base}/index.json`)).json();
const output = resolve(process.env.GAUDI_CONTROLS_REPORT_DIR || `.storybook/verification/${new Date().toISOString().slice(0, 10)}/controls`);
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// Inspect the copy payload in this isolated audit page without changing the OS clipboard.
await page.addInitScript(() => {
  // Track real programs without changing rendering, including geometry/simulation passes.
  window.__gaudiRenderPrograms = new WeakMap();
  for (const Context of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) {
    const useProgram = Context.prototype.useProgram;
    Context.prototype.useProgram = function (program) {
      if (program) {
        const programs = window.__gaudiRenderPrograms.get(this.canvas) || new Set();
        programs.add(program);
        window.__gaudiRenderPrograms.set(this.canvas, programs);
      }
      return useProgram.call(this, program);
    };
  }
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: async text => { window.__gaudiCopiedSource = String(text); }
  } });
});

if (process.argv.includes('--inventory')) {
  const entries = Object.values(index.entries).filter((entry) => entry.type === 'story');
  await page.goto(`${base}/iframe.html?id=${entries[0].id}&viewMode=story`);
  await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.storyStoreValue);
  const inventory = [];
  for (const entry of entries) {
    const metadata = await page.evaluate(async (storyId) => {
      const story = await window.__STORYBOOK_PREVIEW__.storyStoreValue.loadStory({ storyId });
      const { acceptsPreviewArgs, previewArgTypes, displayedPreviewArgs } = await import('/src/docs/components/docsContract.js');
      const argNames = Object.keys(story.initialArgs).filter(name => typeof story.initialArgs[name] !== 'function');
      const rows = previewArgTypes(story, argNames.length ? argNames : undefined);
      const displayed = displayedPreviewArgs(rows, story.initialArgs);
      const controls = Object.entries(story.argTypes).filter(([, arg]) => arg.control && !arg.control.disable && !arg.table?.disable)
        .map(([name, arg]) => ({ name, control: arg.control, options: arg.options, initial: story.initialArgs[name], hasInitial: name in story.initialArgs, condition: arg.if }));
      const preview = acceptsPreviewArgs(story) ? Object.entries(rows).map(([name, arg]) => ({name, control: arg.control, options: arg.options, initial: displayed[name], condition: arg.if})) : [];
      return { controls, preview, disabled: story.parameters.controls?.disable === true, include: story.parameters.controls?.include, exclude: story.parameters.controls?.exclude, interaction: story.parameters.controlAudit?.interaction || [] };
    }, entry.id);
    inventory.push({ ...entry, ...metadata });
    if (inventory.length % 50 === 0) console.log(`Inventoried ${inventory.length}/${entries.length} stories`);
  }
  await writeFile(`${output}/inventory.json`, JSON.stringify(inventory, null, 2));
  console.log(`Saved ${inventory.length} stories to ${output}/inventory.json`);
  await browser.close();
  process.exit(0);
}


const idsOnly = process.argv.includes('--ids-only');
const sourcesOnly = process.argv.includes('--sources-only');
const controlsOnly = process.argv.includes('--controls-only');
const pendingPath = process.argv.find(arg => arg.startsWith('--pending-from='))?.slice(15);
const pendingReport = pendingPath ? JSON.parse(await readFile(pendingPath, 'utf8')) : null;
const pendingNames = new Map(pendingReport?.components.map(component => [component.id, new Set(component.controls.filter(control => control.cases.some(result => ['needs-interaction-check', 'check-error', 'update-failed', 'runtime-error'].includes(result.status))).map(control => control.name))]));
const filter = process.argv.find(arg => arg.startsWith('--filter='))?.slice(9);
const entries = Object.values(index.entries).filter(entry => entry.type === 'docs' && (!filter || new RegExp(filter).test(entry.id)) && (!pendingReport || pendingNames.get(entry.id)?.size));
const report = { base, mode: idsOnly ? 'visible-ids' : sourcesOnly ? 'visible-sources' : controlsOnly ? 'targeted-controls' : 'controls-and-sources', startedAt: new Date().toISOString(), expectedPageIds: entries.map(entry => entry.id), components: [] };
let interrupted = false;
process.once('SIGINT', () => { interrupted = true; });
const errors = [];
const consoleIssues = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (['warning', 'error'].includes(message.type())) consoleIssues.push({ level: message.type(), text: message.text(), location: message.location() });
});
page.setDefaultTimeout(6000);

// Retain data shape and IDs when sampling JSON controls; never invent application data.
function changedObject(value) {
  if (Array.isArray(value)) {
    if (!value.length) return undefined;
    const first = changedObject(value[0]);
    return first === undefined ? undefined : [first, ...value.slice(1)];
  }
  if (value && typeof value === 'object') {
    if ('$$typeof' in value || ('type' in value && 'props' in value)) return undefined;
    const key = ['label', 'title', 'name', 'text', 'description', 'question', 'header', 'content', 'value'].find(key => typeof value[key] === 'string');
    if (key) return { ...value, [key]: `${value[key]} audit` };
    const numeric = Object.keys(value).find(key => typeof value[key] === 'number' && !/id|key/i.test(key));
    if (numeric) return { ...value, [numeric]: value[numeric] + 1 };
    if (typeof value.locale === 'string') return { ...value, locale: value.locale === 'de-DE' ? 'en-US' : 'de-DE' };
    for (const key of Object.keys(value)) {
      const next = changedObject(value[key]);
      if (next !== undefined) return { ...value, [key]: next };
    }
    return undefined;
  }
  if (typeof value === 'number') return value + 1;
  if (typeof value === 'boolean') return !value;
  if (typeof value === 'string') return value.startsWith('#') ? '#d946ef' : `${value} audit`;
}

function samples(name, arg, current) {
  const type = typeof arg.control === 'string' ? arg.control : arg.control?.type;
  if (type === 'boolean') return [!current];
  if (['select', 'radio', 'inline-radio', 'check', 'inline-check', 'multi-select'].includes(type)) return (arg.options || []).filter(value => value !== current);
  if (type === 'color' || /^(color|background)$/.test(name) || (type === 'text' && /^#[0-9a-f]{3,8}$/i.test(current))) return ['#d946ef'];
  if (type === 'text') {
    if (name === 'className') return ['size-24 rounded-control'];
    if (name === 'locale') return [current === 'de-DE' ? 'en-US' : 'de-DE'];
    if (/highlightedLines/i.test(name)) return ['2'];
    if (/^(start|end)$/.test(name) && /^\d{2}:\d{2}$/.test(current)) return [name === 'start' ? '10:00' : '16:00'];
    if (/href/i.test(name)) return ['#control-preview'];
    if (/^src$|image|thumbnail/i.test(name)) return ['/static/images/art/1.svg'];
    if (/url/i.test(name)) return [];
    if (name === 'chart' && typeof current === 'string') return [current.replace(/\[([^\]]+)\]/, '[$1 audit]')].filter(value => value !== current);
    return [`${current ?? ''} audit`];
  }
  if (name === 'bins' && type === 'number' && Number(current) >= 4) return [Math.floor(Number(current) / 2)];
  if (type === 'number' || type === 'range') {
    const value = Number(current ?? 0), step = arg.control?.step || (Math.abs(value) > 20 ? Math.max(1, Math.round(Math.abs(value) / 4)) : 1);
    const next = value + step <= (arg.control?.max ?? Infinity) ? value + step : value - step;
    return next >= (arg.control?.min ?? -Infinity) ? [next] : [];
  }
  if (type === 'object') {
    const next = changedObject(current);
    return next === undefined ? [] : [next];
  }
  if (type === 'date') return [Number(current ?? Date.UTC(2026, 0, 1)) + 86400000];
  return [];
}

// Compare only visible output and actual form/ARIA state. Ignore generated IDs/classes,
// unrelated example stories, and fields that changed during the baseline observation.
async function renderedState(preview) {
  return preview.evaluate(root => {
    const state = {};
    const nodes = [root, ...root.querySelectorAll('*')];
    for (const [i, el] of nodes.entries()) {
      const style = getComputedStyle(el), box = el.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if ((!box.width || !box.height) && !(el instanceof SVGElement && (box.width || box.height || el.closest('defs,pattern')))) continue;
      const prefix = `${i}:${el.tagName}`;
      state[`${prefix}:text`] = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim();
      for (const attr of ['data-side','data-align','aria-label','aria-expanded','aria-checked','aria-valuenow','aria-valuetext','aria-disabled','disabled','required','placeholder','src','href','d','points','x','y','x1','y1','x2','y2','cx','cy','r','width','height','viewBox','patternUnits','patternTransform']) {
        const value = el.getAttribute(attr);
        if (value !== null) state[`${prefix}:${attr}`] = value;
      }
      if ('value' in el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) state[`${prefix}:value`] = el.value;
      for (const property of ['color','backgroundColor','backgroundImage','borderColor','borderWidth','borderRadius','fontSize','fontWeight','opacity','padding','gap','width','height','display','direction','order','margin','flexDirection','gridTemplateColumns','animationDuration','maskImage','maskSize','filter','boxShadow','transform','cursor','stroke','strokeWidth','strokeDasharray','strokeDashoffset','fill','objectFit','textAlign','lineHeight','letterSpacing','overflow','justifyContent','alignItems','alignSelf','counterReset','counterIncrement','fillOpacity','left','right','top','bottom']) state[`${prefix}:${property}`] = style[property];
      for (const pseudo of ['::before', '::after']) {
        const paint = getComputedStyle(el, pseudo);
        if (paint.content === 'none' || paint.content === 'normal' || paint.display === 'none') continue;
        for (const property of ['content', 'color', 'backgroundColor', 'borderColor', 'boxShadow', 'width', 'height', 'transform', 'opacity']) {
          state[`${prefix}:${pseudo}:${property}`] = paint[property];
        }
      }
      if (el.tagName === 'CANVAS') {
        const gl = el.getContext('webgl') || el.getContext('webgl2');
        const programs = window.__gaudiRenderPrograms?.get(el) || new Set([gl?.getParameter(gl.CURRENT_PROGRAM)]);
        for (const [p, program] of [...programs].entries()) if (program && gl.isProgram(program)) for (let u = 0; u < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); u++) {
          const uniform = gl.getActiveUniform(program, u);
          if (/time|pointer|^uTrail\[|click|pressed|travel/i.test(uniform.name)) continue;
          const value = gl.getUniform(program, gl.getUniformLocation(program, uniform.name));
          state[`${prefix}:uniform:${p}:${uniform.name}`] = JSON.stringify(ArrayBuffer.isView(value) ? Array.from(value) : value);
        }
      }
    }
    return state;
  });
}

async function updateControl(row, arg, value) {
  const type = typeof arg.control === 'string' ? arg.control : arg.control?.type;
  const initialize = row.getByRole('button', { name: /^Set (string|number|object|boolean|date)$/i });
  if (await initialize.count()) await initialize.click();
  if (type === 'boolean') {
    const input = row.locator('input[type="checkbox"]');
    if (await input.isChecked() !== value) await row.locator('label[aria-label]').click();
  } else if (type === 'select') {
    await row.locator('select').selectOption({ label: arg.control?.labels?.[value] || String(value) });
  } else if (type === 'radio' || type === 'inline-radio') {
    await row.getByLabel(String(value), { exact: true }).check();
  } else if (type === 'object') {
    const edit = row.getByRole('switch', { name: /^Edit .* as JSON$/ });
    if (await edit.count() && await edit.getAttribute('aria-checked') !== 'true') await edit.click();
    const input = row.locator('textarea');
    if (!await input.count()) throw new Error('Object editor needs owner-specific input');
    await input.fill(JSON.stringify(value, null, 2));
    await input.press('Tab');
  } else {
    const input = row.locator('input:not([type="checkbox"]):not([type="radio"]),textarea').first();
    await input.fill(String(value));
    await input.press('Tab');
  }
}

// These six controls reveal their effect only after a real pointer/focus action.
// Keep the owner-specific outcomes explicit instead of treating accepted args as proof.
async function verifyInteractiveControl({ page, preview, row, arg, name, value, initial, id, controls }) {
  const previewId = await preview.getAttribute('id');
  const hoverPreview = async locator => {
    await preview.scrollIntoViewIfNeeded();
    await locator.hover();
  };
  if (id === 'animations-backgrounds-liquid-ether--docs' && ['speed', 'interactive'].includes(name)) {
    const evidencePath = resolve('.storybook/verification/2026-10-12/full-ds/matrix-full/reports/liquid-ether-independent-controls-light.json');
    const evidence = JSON.parse(await readFile(evidencePath, 'utf8'));
    assert.equal(evidence.completed, true, 'The current owner renderer contract completed');
    const check = evidence.checks.find(check => check.control === name);
    assert.ok(check?.meanChannelDifference > 0.01, 'The actual simulation changes pixels for this control');
    return { kind: 'owner-rendering', evidencePath, check, outcome: 'The Docs widget reaches this exact owner argument; the independent owner test measures its retained simulation pixels with identical timing and input', limitation: 'Fluid simulation has no public pointer uniform, so this effect is proved by its renderer contract rather than a uniform snapshot in the native Docs page' };
  }
  if ((id.startsWith('animations-backgrounds-') || id === 'layout-borealis--docs') && ['speed', 'interactive'].includes(name)) {
    const background = preview.locator('[data-effect][data-renderer="webgl"]').first();
    if (!await background.count()) return null;
    const read = () => background.locator('canvas').first().evaluate(canvas => {
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      const result = {};
      for (const [p, program] of [...(window.__gaudiRenderPrograms.get(canvas) || [])].entries()) {
        if (!gl.isProgram(program)) continue;
        for (let index = 0; index < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); index++) {
          const uniform = gl.getActiveUniform(program, index);
          if (!/^u(Time|Pointer|PointerActive)$|^u(Trail|Clicks)\[/.test(uniform.name)) continue;
          const current = gl.getUniform(program, gl.getUniformLocation(program, uniform.name));
          result[`${p}:${uniform.name}`] = ArrayBuffer.isView(current) ? Array.from(current) : current;
        }
      }
      return result;
    });
    await background.scrollIntoViewIfNeeded();
    if (name === 'speed') {
      await updateControl(row, arg, 0);
      await background.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      assert.equal(await background.getAttribute('data-animated'), 'false');
      const paused = await read();
      await page.waitForTimeout(180);
      assert.deepEqual(await read(), paused, 'Zero speed retains the rendered phase');
      await updateControl(row, arg, value);
      await background.scrollIntoViewIfNeeded();
      await page.waitForFunction(id => document.getElementById(id).querySelector('[data-effect]')?.dataset.animated === 'true', previewId);
      await page.waitForTimeout(180);
      const resumed = await read();
      assert.equal(await background.getAttribute('data-animated'), 'true');
      assert.ok(Object.keys(paused).some(key => key.endsWith(':uTime') && resumed[key] > paused[key]), 'Positive speed advances the rendered shader phase');
      return { outcome: 'Actual zero speed pauses the shader; selected positive speed resumes its retained phase', paused, resumed };
    }
    const set = async enabled => {
      await updateControl(row, arg, enabled);
      await background.scrollIntoViewIfNeeded();
      await page.waitForFunction(id => document.getElementById(id).querySelector('[data-effect]')?.dataset.animated === 'true', previewId);
      const box = await background.boundingBox();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.85);
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.85, { steps: 4 });
      if (id === 'animations-backgrounds-pixel-blast--docs') await page.mouse.click(box.x + box.width * 0.8, box.y + box.height * 0.85);
      await page.waitForTimeout(160);
      return read();
    };
    const selected = await set(true);
    const opposite = await set(false);
    await updateControl(row, arg, value);
    const enabled = value ? selected : opposite;
    const disabled = value ? opposite : selected;
    const activeKeys = Object.keys(enabled).filter(key => !key.endsWith(':uTime'));
    assert.ok(activeKeys.length && activeKeys.some(key => JSON.stringify(enabled[key]) !== JSON.stringify(disabled[key])), 'Interactive rendering responds to the native pointer only while enabled');
    return { outcome: 'Native pointer input reaches the shader when interactive is enabled and is reset when disabled', enabled, disabled };
  }
  if (id === 'blocks-forms--docs' && ['showSummary', 'summaryTitle'].includes(name)) {
    await preview.getByRole('button', { name: 'Send', exact: true }).click();
    assert.ok(await preview.locator('[aria-invalid="true"]').count() >= 3);
    const summary = preview.locator('[data-slot="form-error-summary"]');
    if (name === 'showSummary') {
      assert.equal(await summary.count(), 0);
      await updateControl(row, arg, true);
      await summary.waitFor({ state: 'visible' });
      assert.ok((await summary.innerText()).includes('Fix 3 problems'));
      await updateControl(row, arg, false);
      await summary.waitFor({ state: 'detached' });
      return { outcome: 'Failed submit retains inline errors while the summary control toggles the error summary' };
    }
    await summary.waitFor({ state: 'visible' });
    assert.ok((await summary.innerText()).includes(value.trim()));
    return { outcome: 'Custom summary title appears after an actual failed submit', title: await summary.innerText() };
  }
  if (id === 'blocks-scheduling--docs' && name === 'duration' && value === '15') {
    const endRow = controls.locator('tbody tr').filter({ has: page.getByText('end', { exact: true }) });
    await updateControl(endRow, { control: 'text' }, '16:45');
    const last = preview.locator('[data-slot="toggle-group-item"]').filter({ hasText: /^16:30$/ });
    await last.waitFor({ state: 'visible' });
    await updateControl(row, arg, initial);
    await last.waitFor({ state: 'detached' });
    await updateControl(row, arg, value);
    await last.waitFor({ state: 'visible' });
    await updateControl(endRow, { control: 'text' }, '17:00');
    return { outcome: 'A 15-minute meeting fits the final 16:30 slot before 16:45; the original 30-minute meeting does not' };
  }
  if (id === 'core-accordion--docs' && name === 'type') {
    const triggers = preview.locator('button[aria-expanded]:not(:disabled)');
    for (let index = 0; index < await triggers.count(); index++) if (await triggers.nth(index).getAttribute('aria-expanded') === 'true') await triggers.nth(index).click();
    await triggers.nth(0).click();
    await triggers.nth(1).click();
    assert.equal(await triggers.nth(0).getAttribute('aria-expanded'), 'true');
    assert.equal(await triggers.nth(1).getAttribute('aria-expanded'), 'true');
    await updateControl(row, arg, initial);
    for (let index = 0; index < await triggers.count(); index++) if (await triggers.nth(index).getAttribute('aria-expanded') === 'true') await triggers.nth(index).click();
    await triggers.nth(0).click();
    await triggers.nth(1).click();
    assert.equal(await triggers.nth(0).getAttribute('aria-expanded'), 'false');
    assert.equal(await triggers.nth(1).getAttribute('aria-expanded'), 'true');
    await updateControl(row, arg, value);
    return { outcome: 'Multiple mode retains two expanded items; single mode closes the preceding item' };
  }
  if (id === 'core-floatingmenu--docs' && ['revealOn', 'threshold'].includes(name)) {
    const frame = preview.getByTestId('scroll-page');
    const nav = preview.getByRole('navigation', { name: 'Quick navigation' });
    const scroll = async top => {
      await frame.evaluate((el, top) => { el.scrollTop = top; el.dispatchEvent(new Event('scroll')); }, top);
      await page.waitForTimeout(100);
      return nav.getAttribute('data-state');
    };
    await scroll(0);
    if (name === 'revealOn') {
      assert.equal(await scroll(400), 'visible');
      assert.equal(await scroll(500), 'visible');
      await updateControl(row, arg, initial);
      await scroll(0);
      assert.equal(await scroll(400), 'hidden');
      assert.equal(await scroll(300), 'visible');
    } else {
      await scroll(400);
      assert.equal(await scroll(value - 1), 'hidden');
      await scroll(400);
      assert.equal(await scroll(value + 1), 'visible');
    }
    await updateControl(row, arg, value);
    await scroll(0);
    return { outcome: name === 'revealOn' ? 'Scroll mode remains revealed on downward movement; scroll-up mode reveals only on upward movement' : 'Upward scrolling reveals the menu only past the selected threshold' };
  }
  if (id === 'core-scrollarea--docs' && ['smooth', 'type'].includes(name)) {
    const viewport = preview.getByRole('region', { name: 'Changelog', exact: true });
    if (name === 'smooth') {
      await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="scroll-area-viewport"]').classList.contains('lenis'), previewId);
      await viewport.hover();
      await page.mouse.wheel(0, 180);
      await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="scroll-area-viewport"]').scrollTop > 0, previewId);
      const moved = await viewport.evaluate(el => el.scrollTop);
      await updateControl(row, arg, false);
      assert.equal(await viewport.evaluate(el => el.classList.contains('lenis')), false);
      await updateControl(row, arg, true);
      await viewport.press('Home');
      await viewport.evaluate(el => el.scrollTo({ top: 0, behavior: 'instant' }));
      return { outcome: 'Smooth mode installs the shared wheel engine, moves the viewport, and removes it when disabled', moved };
    }
    const scrollbar = preview.locator('[data-slot="scroll-area-scrollbar"]').first();
    await scrollbar.waitFor({ state: 'visible' });
    const originalHeight = await viewport.evaluate(el => el.style.height);
    await viewport.evaluate(el => { el.style.height = `${el.scrollHeight + 10}px`; });
    await scrollbar.waitFor({ state: 'hidden' });
    await viewport.evaluate((el, height) => { el.style.height = height; }, originalHeight);
    await scrollbar.waitFor({ state: 'visible' });
    return { outcome: 'Auto scrollbars show for real overflow and disappear when the viewport fits its content' };
  }
  if (id === 'post-postseriesbox--docs' && name === 'series') {
    const trigger = preview.getByRole('button', { name: new RegExp(value[0].series) });
    if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
    await preview.getByRole('link', { name: value[0].title, exact: true }).waitFor({ state: 'visible' });
    assert.equal(await preview.getByRole('link', { name: value[0].title, exact: true }).getAttribute('href'), value[0].href);
    return { outcome: 'Edited series entry is visible with its original destination after the reading path is expanded', title: value[0].title };
  }
  if (id === 'mdx-imagemodal--docs' && name === 'isOpen') {
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    const image = await dialog.getByRole('img').getAttribute('src');
    assert.ok(image);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await updateControl(row, arg, false);
    await updateControl(row, arg, true);
    await dialog.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    return { outcome: 'The controlled image portal opens with the image and closes when disabled', image };
  }
  if (id === 'mdx-tooltip--docs' && name === 'message') {
    const trigger = preview.getByRole('button', { name: 'More information', exact: true }).nth(1);
    await trigger.hover();
    const tooltip = page.getByRole('tooltip');
    await tooltip.waitFor({ state: 'visible' });
    assert.equal((await tooltip.innerText()).trim(), value);
    await page.keyboard.press('Escape');
    await page.mouse.move(0, 0);
    return { outcome: 'The hovered inline term displays the edited explanation', text: value };
  }
  if (id === 'mdx-video--docs' && name === 'animationStyle') {
    await preview.getByRole('button', { name: 'Play video', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    const motion = await dialog.locator('[data-open]').evaluateAll(elements => elements.map(el => ({ className: el.className, animation: getComputedStyle(el).animationName })));
    const expected = { fade: 'opacity-0', 'from-bottom': 'translate-y-8', 'from-left': '-translate-x-8', 'from-right': 'translate-x-8', 'from-top': '-translate-y-8', 'left-in-right-out': '-translate-x-8', 'top-in-bottom-out': '-translate-y-8' }[value];
    assert.ok(motion.some(el => el.className.includes(expected)), 'The opened video panel uses its selected motion variant');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    return { outcome: 'Opening the video applies the selected entrance/exit animation', motion };
  }
  if (id === 'blocks-stat-cards--docs' && name === 'tone' && value === 'accent') {
    const icon = preview.locator('[data-slot="stat-icon"]').first();
    const tokens = await icon.evaluate(el => {
      const style = getComputedStyle(el);
      return { accent: style.getPropertyValue('--ds-color-accent').trim(), info: style.getPropertyValue('--ds-color-info').trim(), accentSubtle: style.getPropertyValue('--ds-color-accent-subtle').trim(), infoSubtle: style.getPropertyValue('--ds-color-info-subtle').trim(), className: el.className };
    });
    assert.equal(tokens.accent, tokens.info);
    assert.equal(tokens.accentSubtle, tokens.infoSubtle);
    assert.ok(tokens.className.includes('bg-accent-subtle'));
    return { kind: 'equivalent-tokens', rationale: 'The selected accent icon style and initial info style resolve to the same foreground/background tokens', tokens };
  }
  if (id === 'core-scrollspy--docs' && name === 'smooth') {
    const viewport = preview.getByRole('region', { name: 'Guide', exact: true });
    await viewport.evaluate(el => {
      const original = el.scrollTo.bind(el);
      el.scrollTo = options => { el.dataset.auditScrollBehavior = options.behavior; return original(options); };
      el.scrollTo({ top: 0, behavior: 'instant' });
    });
    await preview.getByRole('button', { name: 'API', exact: true }).click();
    assert.equal(await viewport.getAttribute('data-audit-scroll-behavior'), 'auto');
    await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="scroll-area-viewport"]').scrollTop > 0, previewId);
    await updateControl(row, arg, true);
    await preview.getByRole('button', { name: 'Overview', exact: true }).click();
    assert.equal(await viewport.getAttribute('data-audit-scroll-behavior'), 'smooth');
    await updateControl(row, arg, value);
    await viewport.evaluate(el => { delete el.scrollTo; delete el.dataset.auditScrollBehavior; el.scrollTo({ top: 0, behavior: 'instant' }); });
    return { outcome: 'Section navigation passes auto versus smooth to native scrolling and changes the actual section viewport' };
  }
  if (id === 'animations-backgrounds-shape-waves--docs' && name === 'textSize') {
    const textRow = controls.locator('tbody tr').filter({ has: page.getByText('text', { exact: true }) });
    await updateControl(textRow, { control: 'text' }, 'Hi');
    const label = preview.locator('[data-slot="shape-waves"]');
    await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="shape-waves"] canvas')?.style.maskImage.includes('data:image/svg'), previewId);
    const current = await label.locator('canvas').evaluate(el => el.style.maskImage);
    await updateControl(row, arg, initial);
    await page.waitForFunction(({ id, current }) => document.getElementById(id).querySelector('[data-slot="shape-waves"] canvas')?.style.maskImage !== current, { id: previewId, current });
    const original = await label.locator('canvas').evaluate(el => el.style.maskImage);
    assert.notEqual(current, original, 'Text size changes the actual canvas text cutout after text is supplied');
    await updateControl(row, arg, value);
    await updateControl(textRow, { control: 'text' }, '');
    return { outcome: 'The selected text size changes the supplied text; the default empty text has no glyphs to resize', selectedMask: current, initialMask: original };
  }
  const intervalOwners = {
    'animations-text-glyphinspector--docs': '.gaudi-glyph-inspector__letter[data-focused="true"]',
    'animations-text-phrasecycle--docs': '.gaudi-phrase-cycle__value',
    'animations-text-wordspotlight--docs': '.gaudi-word-spotlight__word[data-focused="true"]',
  };
  if (intervalOwners[id] && name === 'interval') {
    await preview.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const selector = intervalOwners[id];
    const readIndex = () => preview.locator(selector).evaluate((el, glyph) => glyph ? Array.from(el.parentElement.children).indexOf(el) : el.textContent, id === 'animations-text-glyphinspector--docs');
    const before = await readIndex();
    await page.waitForFunction(({ id, selector, before }) => {
      const el = document.getElementById(id)?.querySelector(selector);
      return el && (selector.includes('glyph-inspector') ? Array.from(el.parentElement.children).indexOf(el) : el.textContent) !== before;
    }, { id: previewId, selector, before }, { timeout: value + 5000 });
    const after = await readIndex();
    assert.notEqual(after, before);
    return { outcome: 'The selected interval continues the actual visible cycle without pointer interference', interval: value, before, after };
  }
  if (id === 'animations-text-phrasecycle--docs' && name === 'direction') {
    const phrase = preview.locator('[data-slot="phrase-cycle"]');
    assert.equal(await phrase.getAttribute('data-direction'), value);
    const cycle = phrase.locator('.gaudi-phrase-cycle__value');
    const animation = await cycle.evaluate(el => getComputedStyle(el).getPropertyValue('--cycle-from').trim() || '100%');
    await updateControl(row, arg, initial);
    const original = await cycle.evaluate(el => getComputedStyle(el).getPropertyValue('--cycle-from').trim() || '100%');
    assert.notEqual(animation, original);
    await updateControl(row, arg, value);
    return { outcome: 'The phrase transition uses the selected directional animation', animation, original };
  }
  if (id === 'animations-text-cipherreveal--docs' && ['duration', 'direction', 'trigger'].includes(name)) {
    const cipher = preview.locator('[data-slot="cipher-reveal"]');
    await cipher.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    if (name === 'trigger') {
      await page.waitForTimeout(1400);
      assert.equal(await cipher.getAttribute('data-animated'), 'false');
    }
    await cipher.hover();
    await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="cipher-reveal"]').dataset.animated === 'true', previewId);
    await page.waitForTimeout(200);
    const progression = await cipher.locator('[aria-hidden="true"] > span').evaluateAll(letters => letters.map(el => ({ text: el.textContent, cipher: el.classList.contains('gaudi-cipher-reveal__cipher') })));
    assert.ok(progression.some(letter => letter.cipher));
    if (name === 'direction') {
      const middle = Math.floor(progression.length / 2);
      assert.equal(progression[middle].cipher, false);
      assert.equal(progression[0].cipher, true);
    }
    await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="cipher-reveal"]').dataset.animated === 'false', previewId, { timeout: 6000 });
    await page.mouse.move(0, 0);
    return { outcome: name === 'trigger' ? 'Hover starts the resting cipher and it resolves completely' : name === 'direction' ? 'The center resolves before the outer characters' : 'The edited duration runs the scramble and reaches the readable final phrase', progression };
  }
  if (id === 'animations-typewriterwriter--docs' && name === 'repeat') {
    const owned = property => controls.locator('tbody tr').filter({ has: page.getByText(property, { exact: true }) });
    await updateControl(owned('texts'), { control: 'object' }, ['A', 'B']);
    for (const [property, delay] of [['typeDelay', 16], ['eraseDelay', 16], ['holdDelay', 100]]) await updateControl(owned(property), { control: 'number' }, delay);
    await preview.scrollIntoViewIfNeeded();
    const read = () => preview.locator('.gaudi-typewriter__value').evaluate(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(''));
    await page.waitForFunction(id => {
      const el = document.getElementById(id).querySelector('.gaudi-typewriter__value');
      return [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent === 'B');
    }, previewId);
    await page.waitForTimeout(400);
    assert.equal(await read(), 'B', 'Nonrepeating typing retains the final phrase beyond the hold period');
    await updateControl(row, arg, true);
    await page.waitForFunction(id => {
      const el = document.getElementById(id).querySelector('.gaudi-typewriter__value');
      return ![...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent === 'B');
    }, previewId);
    await updateControl(row, arg, false);
    return { outcome: 'Nonrepeating mode retains the last phrase, and enabling repeat resumes erasing/cycling', compactFixture: ['A', 'B'] };
  }
  if (id === 'animations-text-warptext--docs' && name === 'speed') {
    const canvas = preview.locator('[data-slot="warp-text"] canvas');
    await canvas.scrollIntoViewIfNeeded();
    const read = () => canvas.evaluate(el => {
      const gl = el.getContext('webgl');
      const program = gl.getParameter(gl.CURRENT_PROGRAM);
      return gl.getUniform(program, gl.getUniformLocation(program, 'time'));
    });
    await updateControl(row, arg, 0);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);
    const paused = await read();
    await page.waitForTimeout(150);
    assert.equal(await read(), paused);
    await updateControl(row, arg, value);
    await page.waitForTimeout(250);
    const resumed = await read();
    assert.ok(resumed > paused);
    return { outcome: 'Zero speed preserves the warped text phase; positive speed advances it', paused, resumed };
  }
  const sameTone = value === 'info' && ((id === 'core-button--docs' || id === 'core-link--docs' || id === 'core-banner--docs') && name === 'tone' || id === 'core-icon--docs' && name === 'color');
  const sameMarker = id === 'core-texthighlight--docs' && name === 'tone' && value === 'indigo';
  if (sameTone || sameMarker) {
    const tokens = await preview.evaluate(root => {
      const style = getComputedStyle(root);
      return Object.fromEntries(['accent', 'info', 'accent-foreground', 'info-foreground', 'accent-muted', 'info-muted', 'info-border'].map(name => [name, style.getPropertyValue(`--ds-color-${name}`).trim()]));
    });
    const pair = sameMarker ? ['accent-muted', 'info-muted'] : ['accent', 'info'];
    assert.ok(tokens[pair[0]]);
    assert.equal(tokens[pair[0]], tokens[pair[1]]);
    const element = id === 'core-button--docs' ? preview.getByRole('button', { name: 'Publish article', exact: true })
      : id === 'core-link--docs' ? preview.getByRole('link', { name: 'Read the release notes', exact: true })
      : id === 'core-banner--docs' ? preview.locator('.bg-info').first() : id === 'core-icon--docs' ? preview.locator('svg').first() : preview.locator('h3 span').first();
    const expectedClass = sameMarker ? 'from-info-muted' : ['core-button--docs', 'core-banner--docs'].includes(id) ? 'bg-info' : 'text-info';
    assert.equal(await element.evaluate((el, className) => el.classList.contains(className), expectedClass), true);
    const evidence = { kind: 'equivalent-tokens', rationale: sameMarker ? 'blue→accent and indigo→info share the default muted token and info-border gradient endpoint' : 'Default accent and info tokens have equal resting paint; the selected semantic class is applied', tokens, appliedClass: expectedClass };
    if (id === 'core-button--docs' || id === 'core-link--docs') {
      const paint = el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor, filter: getComputedStyle(el).filter });
      await hoverPreview(element);
      await page.waitForTimeout(250);
      const infoHover = await element.evaluate(paint);
      await updateControl(row, arg, 'accent');
      await hoverPreview(element);
      await page.waitForTimeout(250);
      const accentHover = await element.evaluate(paint);
      assert.notDeepEqual(infoHover, accentHover, 'Distinct semantic hover rules must render after changing the control');
      await updateControl(row, arg, value);
      evidence.hover = { info: infoHover, accent: accentHover };
    }
    return evidence;
  }
  if (id === 'chat-agentmark--docs' && ['motif', 'hue'].includes(name) && initial === 'auto') {
    const mark = preview.locator('[data-slot="agent-mark"]').first();
    const explicit = await mark.getAttribute(`data-agent-${name}`);
    await updateControl(row, arg, initial);
    const automatic = await mark.getAttribute(`data-agent-${name}`);
    assert.equal(explicit, value);
    assert.equal(automatic, value);
    await updateControl(row, arg, value);
    return { kind: 'equivalent-preview', rationale: 'The automatic seed already resolves to the explicitly selected appearance', initial, value, resolvedAutomatic: automatic };
  }
  if ((id.startsWith('charts-') || id === 'mdx-chart--docs') && name === 'locale') {
    const tableRow = controls.locator('tbody tr').filter({ has: page.getByText('showData', { exact: true }) });
    const forceVisible = await tableRow.count() > 0;
    if (forceVisible) await updateControl(tableRow, { control: 'select' }, 'visible');
    if (id === 'charts-gaugechart--docs') {
      const valueRow = controls.locator('tbody tr').filter({ has: page.getByText('value', { exact: true }) });
      await updateControl(valueRow, { control: 'number' }, 84.5);
    }
    const capture = async () => {
      await page.waitForTimeout(180);
      if (!forceVisible) {
        const show = preview.getByRole('button', { name: 'Show data', exact: true });
        if (await show.count()) await show.click();
      }
      const plot = preview.locator('[data-slot="chart-plot"]');
      await preview.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await plot.focus();
      await plot.press('Home');
      await page.waitForFunction(id => document.getElementById(id).querySelector('[data-slot="chart-readout"]')?.textContent.trim().length > 0, previewId);
      const table = preview.locator('[data-slot="chart-data-table"]');
      await table.waitFor({ state: 'visible' });
      await preview.locator('[data-slot="chart-readout"]').filter({ hasText: /\S/ }).waitFor({ state: 'visible' });
      return { table: await table.innerText(), readout: await preview.locator('[data-slot="chart-readout"]').innerText() };
    };
    const current = await capture();
    const alternate = value === 'ja-JP' ? 'de-DE' : 'en-US';
    await updateControl(row, arg, alternate);
    const alternateOutput = await capture();
    let initialOutput;
    if (value === 'ja-JP' && initial !== alternate) {
      await updateControl(row, arg, initial);
      initialOutput = await capture();
    }
    await updateControl(row, arg, value);
    const restored = await capture();
    assert.deepEqual(restored, current, 'Restoring the locale restores the same formatted values');
    if (current.table === alternateOutput.table && current.readout === alternateOutput.readout) {
      if (id === 'charts-rangechart--docs') {
        const cells = await preview.locator('[data-slot="chart-data-table"] td').allTextContents();
        const numbers = cells.map(text => Number.parseFloat(text));
        assert.ok(numbers.length && numbers.every(number => Number.isFinite(number)));
        for (const locale of [initial, value, alternate]) {
          const format = new Intl.NumberFormat(locale, { style: 'unit', unit: 'millisecond' });
          assert.deepEqual(numbers.map(number => format.format(number)), cells.map(text => text.trim()));
        }
        return { kind: 'equivalent-preview', rationale: 'Native Intl millisecond formatting produces identical strings for these values in the selected locales; the same owner changes output in fr-FR', locale: value, alternate, current, restored };
      }
      if (!['charts-radarchart--docs', 'charts-heatmapchart--docs', 'charts-stackedbarlist--docs'].includes(id)) return null;
      const cells = await preview.locator('[data-slot="chart-data-table"] td').allTextContents();
      const numbers = cells.map(text => Number(text.trim()));
      assert.ok(numbers.length && numbers.every(number => Number.isInteger(number) && Math.abs(number) < 1000));
      for (const locale of [initial, value, alternate]) {
        const format = new Intl.NumberFormat(locale);
        assert.deepEqual(numbers.map(number => format.format(number)), cells.map(text => text.trim()));
      }
      return { kind: 'equivalent-preview', rationale: 'These fixture cells are integers below1000, so each selected locale correctly produces the same numeric strings; shared frame formatting remains active', locale: value, alternate, numericRange: [Math.min(...numbers), Math.max(...numbers)], current, restored };
    }
    return { locale: value, alternate, current, alternateOutput, ...(initialOutput ? { initial, matchesInitialFormatting: JSON.stringify(initialOutput) === JSON.stringify(current) } : {}), outcome: 'Actual chart readout/data-table formatting changes with locale and restores exactly' };
  }
  const overlayOwners = {
    'core-dialog--docs': { trigger: 'Edit article', role: 'dialog' },
    'core-sheet--docs': { trigger: 'Workspace settings', role: 'dialog' },
    'core-popover--docs': { trigger: 'Share', role: 'dialog' },
    'core-dropdownmenu--docs': { trigger: 'Article actions', role: 'menu' },
    'core-navigationmenu--docs': { trigger: 'Categories' },
    'core-commander--docs': { trigger: 'Open search', role: 'dialog' },
  };
  if (overlayOwners[id] && !['defaultOpen', 'trigger'].includes(name)) {
    const owner = overlayOwners[id];
    const capture = async () => {
      const trigger = preview.getByRole('button', { name: owner.trigger, exact: true });
      const popupId = await trigger.getAttribute('aria-controls');
      if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
      const popup = popupId ? page.locator(`[id=${JSON.stringify(popupId)}]`) : page.getByRole(owner.role);
      await popup.waitFor({ state: 'visible' });
      if (id === 'core-commander--docs') await popup.getByRole('combobox', { name: 'Search commands' }).fill('audit');
      await page.waitForTimeout(240);
      const state = await renderedState(popup);
      if (id === 'core-sheet--docs') {
        const overlay = preview.locator('[aria-hidden="true"].absolute.inset-0');
        state.overlayPaint = await overlay.evaluate(el => { const style = getComputedStyle(el); return `${style.backgroundColor};${style.backdropFilter}`; });
      }
      const focusTarget = popup.locator('button,a,input,[role="menuitem"]').first();
      if (await focusTarget.count()) await focusTarget.focus();
      await page.keyboard.press('Escape');
      await popup.waitFor({ state: 'hidden' });
      return state;
    };
    const changed = await capture();
    await updateControl(row, arg, initial);
    const original = await capture();
    const differences = Object.keys({ ...original, ...changed }).filter(key => original[key] !== changed[key]);
    assert.ok(differences.length > 0, 'The updated control must affect the opened overlay');
    await updateControl(row, arg, value);
    await page.keyboard.press('Escape');
    return { outcome: id === 'core-commander--docs' ? 'Edited collection appears in command search results' : 'Opened overlay reflects the changed control', changes: differences.slice(0, 8).map(key => ({ key, before: original[key], after: changed[key] })) };
  }
  if (id === 'core-datatable--docs' && name === 'multiSort') {
    const words = preview.getByRole('columnheader', { name: /^Words(?:\s|$)/ });
    const reads = preview.getByRole('columnheader', { name: /^Reads(?:\s|$)/ });
    await words.getByRole('button').click();
    await reads.getByRole('button').click({ modifiers: ['Shift'] });
    assert.equal(await words.getAttribute('aria-sort'), 'descending');
    assert.equal(await reads.getAttribute('aria-sort'), 'descending');
    const order = await preview.locator('.ds-table-sort-order').allTextContents();
    assert.deepEqual(order.map(text => text.trim()), ['sort order 1', 'sort order 2']);
    await updateControl(row, arg, false);
    await reads.getByRole('button').click();
    assert.equal(await words.getAttribute('aria-sort'), 'none');
    assert.equal(await preview.locator('.ds-table-sort-order').count(), 0);
    await updateControl(row, arg, true);
    return { shiftSort: order, singleSortReplacesPrevious: true };
  }
  if (id === 'core-signaturepad--docs' && ['minWidth', 'maxWidth', 'smoothing', 'sizing'].includes(name)) {
    const area = preview.getByRole('application', { name: 'Your signature', exact: true });
    const strokes = area.locator('[data-slot="signature-pad-stroke"]');
    const clear = preview.getByRole('button', { name: 'Clear signature', exact: true });
    // Fixed pen pressure isolates smoothing from movement timing. Mouse/pen taps
    // distinguish pressure sizing from the documented automatic device choice.
    if (name === 'smoothing') {
      const sizing = controls.locator('tbody tr').filter({ has: page.getByText('sizing', { exact: true }) });
      await updateControl(sizing, { control: 'select' }, 'pressure');
    }
    const draw = async () => {
      if (await strokes.count()) { await clear.click(); await strokes.waitFor({ state: 'detached' }); }
      await area.scrollIntoViewIfNeeded();
      const box = await area.boundingBox();
      const pointerType = name === 'smoothing' || value === 'velocity' ? 'pen' : 'mouse';
      const point = { pointerId: 91, pointerType, isPrimary: true, button: 0, buttons: 1, pressure: 0.25, clientX: box.x + 50, clientY: box.y + 70 };
      await area.dispatchEvent('pointerdown', point);
      if (name === 'smoothing') for (let step = 1; step <= 5; step++) {
        await area.dispatchEvent('pointermove', { ...point, clientX: point.clientX + step * 20, clientY: point.clientY + (step % 2 ? -25 : 15) });
      }
      await area.dispatchEvent('pointerup', { ...point, buttons: 0 });
      await strokes.waitFor({ state: 'visible' });
      return strokes.evaluate(path => { const box = path.getBBox(); return { path: path.getAttribute('d'), width: box.width, height: box.height }; });
    };
    const changed = await draw();
    await updateControl(row, arg, initial);
    const original = await draw();
    assert.notEqual(changed.path, original.path, 'The control must change the same input stroke geometry');
    if (name === 'minWidth' || name === 'maxWidth') assert.ok(changed.width > original.width, 'Increasing stroke width must widen the ink');
    await clear.click();
    await strokes.waitFor({ state: 'detached' });
    await updateControl(row, arg, value);
    if (name === 'smoothing') {
      const sizing = controls.locator('tbody tr').filter({ has: page.getByText('sizing', { exact: true }) });
      await updateControl(sizing, { control: 'select' }, 'auto');
    }
    return { initial, value, original, changed, outcome: 'Identical pointer samples produce different ink geometry through the changed control' };
  }
  if (id === 'core-card--docs' && name === 'interactive') {
    const card = preview.locator('[data-slot="card"]').first();
    await hoverPreview(card);
    await page.waitForTimeout(240);
    const without = await card.evaluate(el => getComputedStyle(el).boxShadow);
    await updateControl(row, arg, true);
    await hoverPreview(card);
    await page.waitForTimeout(240);
    const withHover = await card.evaluate(el => getComputedStyle(el).boxShadow);
    assert.notEqual(withHover, without, 'Card interactive control must change the hovered shadow');
    await updateControl(row, arg, false);
    return { without, withHover };
  }
  if (id === 'core-input--docs' && name === 'caretMode') {
    const input = preview.locator('input:not([type="hidden"]):not([disabled]):not([readonly])').first();
    await input.focus();
    await input.press('End');
    await page.waitForFunction(({ previewId, smooth }) => {
      const input = document.getElementById(previewId)?.querySelector('input:not([type="hidden"]):not([disabled]):not([readonly])');
      return input && input.hasAttribute('data-smooth-caret-active') === smooth;
    }, { previewId, smooth: value === 'smooth' });
    const state = await input.evaluate(el => ({ focused: document.activeElement === el, smooth: el.hasAttribute('data-smooth-caret-active'), color: getComputedStyle(el).caretColor }));
    assert.equal(state.focused, true);
    assert.equal(state.smooth, value === 'smooth');
    return state;
  }
  if (id === 'core-map--docs' && name === 'scrollZoom') {
    const map = preview.locator('.ds-map[data-map-status="ready"]');
    await map.waitFor({ state: 'visible' });
    const zoom = preview.getByLabel('Map zoom', { exact: true });
    const before = Number(await zoom.textContent());
    await hoverPreview(map.locator('canvas'));
    await page.mouse.wheel(0, -400);
    await page.waitForFunction(({ previewId, before }) => Number(document.getElementById(previewId)?.querySelector('[aria-label="Map zoom"]')?.textContent) > before, { previewId, before });
    const enabled = Number(await zoom.textContent());
    await updateControl(row, arg, false);
    await hoverPreview(map.locator('canvas'));
    await page.waitForTimeout(500);
    const disabledBefore = Number(await zoom.textContent());
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(500);
    assert.equal(Number(await zoom.textContent()), disabledBefore, 'Disabled scrollZoom must ignore the wheel');
    await updateControl(row, arg, true);
    return { before, enabled, disabledBefore };
  }
  if (id === 'core-pointer--docs') {
    const surface = preview.locator('[data-slot="pointer-follower"]');
    await preview.scrollIntoViewIfNeeded();
    const box = await surface.boundingBox();
    const x = Math.min(280, box.width - 16), y = 16;
    await page.mouse.move(box.x + 16, box.y + y);
    if (name === 'tracking') {
      await surface.evaluate((el, target) => {
        window.__gaudiPointerFrames = new Promise(resolve => {
          el.addEventListener('pointermove', () => {
            const errors = [];
            const sample = () => {
              const matrix = new DOMMatrix(getComputedStyle(el.querySelector('[data-slot="pointer-follower-position"]')).transform);
              errors.push(Math.abs(matrix.m41 - (target.x - el.clientLeft)));
              if (errors.length === 3) resolve(errors);
              else requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
          }, { once: true });
        });
      }, { x });
    }
    await page.mouse.move(box.x + x, box.y + y);
    await page.waitForFunction(({ previewId, disabled }) => document.getElementById(previewId)?.querySelector('[data-slot="pointer-follower"]')?.hasAttribute('data-active') === !disabled, { previewId, disabled: name === 'disabled' && value });
    if (name === 'disabled') return { active: await surface.getAttribute('data-active') };
    const state = await surface.evaluate(el => {
      const mark = el.querySelector('[data-slot="pointer-follower-mark"]');
      const paint = getComputedStyle(mark);
      return { active: el.hasAttribute('data-active'), variant: mark.dataset.variant, width: paint.width, border: paint.borderWidth, background: paint.backgroundColor, color: paint.color, cursor: getComputedStyle(el).cursor, label: mark.querySelector('.ds-pointer-label')?.textContent };
    });
    assert.equal(state.active, true);
    if (name === 'variant') {
      assert.equal(state.variant, value);
      if (value === 'dot') assert.equal(parseFloat(state.width), 12);
      if (value === 'ring') assert.ok(parseFloat(state.border) > 0);
      if (value === 'label') {
        assert.ok(state.label?.length);
        // The label control exists only in this variant; exercise the revealed row too.
        const labelRow = controls.locator('tbody tr').filter({ has: page.getByText('label', { exact: true }) });
        const field = labelRow.locator('input,textarea').first();
        const original = await field.inputValue();
        await field.fill('Pointer audit');
        await field.press('Tab');
        await preview.scrollIntoViewIfNeeded();
        await page.mouse.move(box.x + x, box.y + y);
        await page.waitForFunction(previewId => document.getElementById(previewId)?.querySelector('.ds-pointer-label')?.textContent === 'Pointer audit', previewId);
        state.conditionalLabel = 'Pointer audit';
        await field.fill(original);
        await field.press('Tab');
      }
    }
    if (name === 'hideCursor') assert.notEqual(state.cursor, 'none');
    if (name === 'tone') {
      const expected = await surface.evaluate(el => {
        const swatch = document.createElement('span');
        swatch.style.color = 'var(--ds-color-accent)';
        el.append(swatch);
        const color = getComputedStyle(swatch).color;
        swatch.remove();
        return color;
      });
      assert.equal(state.color, expected);
    }
    if (name === 'tracking') {
      state.earlyDistance = await page.evaluate(() => window.__gaudiPointerFrames);
      if (value === 'direct') assert.ok(state.earlyDistance.at(-1) < 1, 'Direct tracking follows without a spring lag');
      else assert.ok(state.earlyDistance.at(-1) > 1, 'Spring tracking must visibly trail before settling');
      await page.waitForFunction(({ previewId, x, y }) => {
        const root = document.getElementById(previewId)?.querySelector('[data-slot="pointer-follower"]');
        const matrix = new DOMMatrix(getComputedStyle(root.querySelector('[data-slot="pointer-follower-position"]')).transform);
        return Math.abs(matrix.m41 - (x - root.clientLeft)) < 1 && Math.abs(matrix.m42 - (y - root.clientTop)) < 1;
      }, { previewId, x, y });
      state.settled = true;
    }
    return state;
  }
  if (['core-select--docs', 'core-navigationmenu--docs'].includes(id) && name === 'defaultOpen') {
    const trigger = preview.getByRole('button', { name: id === 'core-select--docs' ? 'Topics' : 'Categories', exact: true });
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await updateControl(row, arg, true);
    await page.waitForFunction(previewId => document.getElementById(previewId)?.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded') === 'true', previewId);
    const popupId = await trigger.getAttribute('aria-controls');
    assert.ok(popupId && await page.locator(`[id=${JSON.stringify(popupId)}]`).isVisible());
    await updateControl(row, arg, false);
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    return { closed: true, reopenedPortal: true };
  }
  if (id === 'core-tooltip--docs') {
    const trigger = preview.getByRole('button', { name: 'Copy link', exact: true });
    await hoverPreview(trigger);
    const tip = page.getByRole('tooltip');
    await tip.waitFor({ state: 'visible' });
    const content = await tip.textContent();
    const side = await tip.evaluate(el => el.closest('[data-side]')?.getAttribute('data-side'));
    if (name === 'content') assert.equal(content, value);
    if (name === 'side') assert.equal(side, value, 'Tooltip side must be reflected by the visible popup');
    await page.mouse.move(0, 0);
    return { content, side };
  }
  return null;
}

// Conditional rows are intentionally absent until their parent option is selected.
// Exercise the authored dependencies without manufacturing extra prop combinations.
async function verifyConditionalControls({ page, preview, controls, id, name, value }) {
  if (id === 'charts-heatmapchart--docs' && name === 'scale') {
    const row = controls.locator('tbody tr').filter({ has: page.getByText('midpoint', { exact: true }) });
    if (value !== 'diverging') { assert.equal(await row.count(), 0); return { control: 'midpoint', present: false }; }
    await row.waitFor({ state: 'visible' });
    const original = await renderedState(preview);
    await updateControl(row, { control: 'number' }, 1);
    const current = await renderedState(preview);
    const changes = Object.keys(current).filter(key => /fill|background|color/i.test(key) && current[key] !== original[key]);
    assert.ok(changes.length, 'Changing the diverging midpoint changes actual heatmap paint');
    await updateControl(row, { control: 'number' }, 0);
    return { control: 'midpoint', present: true, value: 1, outcome: 'Diverging-only midpoint changes the painted scale', changes: changes.slice(0, 8) };
  }
  if (name !== 'variant') return null;
  const previewId = await preview.getAttribute('id');
  if (id === 'core-readingindicator--docs' && value === 'ring') {
    const row = controls.locator('tbody tr').filter({ has: page.getByText('draggable', { exact: true }) });
    const handle = preview.getByRole('button', { name: 'Move reading indicator', exact: true });
    assert.equal(await handle.count(), 0);
    await updateControl(row, { control: 'boolean' }, true);
    await handle.waitFor({ state: 'visible' });
    const indicator = preview.locator('[data-slot="reading-indicator"]');
    await handle.scrollIntoViewIfNeeded();
    const before = await indicator.boundingBox();
    await handle.focus();
    await handle.press('ArrowLeft');
    await page.waitForFunction(({ previewId, left }) => document.getElementById(previewId).querySelector('[data-slot="reading-indicator"]').getBoundingClientRect().left < left - 5, { previewId, left: before.x });
    const moved = await indicator.boundingBox();
    await handle.press('Home');
    await page.waitForFunction(({ previewId, left }) => Math.abs(document.getElementById(previewId).querySelector('[data-slot="reading-indicator"]').getBoundingClientRect().left - left) < 1, { previewId, left: before.x });
    await updateControl(row, { control: 'boolean' }, false);
    await handle.waitFor({ state: 'detached' });
    return { control: 'draggable', values: [true, false], outcome: 'Handle appears, keyboard moves ring, Home restores position, disabling removes handle', movement: moved.x - before.x };
  }
  if (id === 'layout-footer--docs' && value === 'editorial') {
    const row = controls.locator('tbody tr').filter({ has: page.getByText('brandTitle', { exact: true }) });
    const field = row.locator('input,textarea').first();
    const original = await field.inputValue();
    const next = `${original} audit`;
    await updateControl(row, { control: 'text' }, next);
    await preview.getByRole('heading', { name: next, exact: true }).waitFor({ state: 'visible' });
    await updateControl(row, { control: 'text' }, original);
    await preview.getByRole('heading', { name: original, exact: true }).waitFor({ state: 'visible' });
    return { control: 'brandTitle', value: next, outcome: 'Editorial heading updates and restores through the revealed control' };
  }
  return null;
}

async function inspectDocs(page) {
  const rendered = await page.locator('#storybook-docs').evaluate(root => {
    const ids = new Map();
    for (const element of root.querySelectorAll('[id]')) {
      if (!element.checkVisibility({ opacityProperty: true }) || element.closest('[hidden], [aria-hidden="true"], [inert]')) continue;
      const entries = ids.get(element.id) || [];
      entries.push({ tag: element.tagName.toLowerCase(), slot: element.getAttribute('data-slot'), text: element.textContent?.trim().slice(0, 100) });
      ids.set(element.id, entries);
    }
    return {
      duplicateVisibleIds: [...ids].filter(([, elements]) => elements.length > 1).map(([id, elements]) => ({ id, elements })),
      errorOverlay: document.querySelector('vite-error-overlay')?.shadowRoot?.textContent?.slice(0, 1000) || null,
      storyErrors: [...root.querySelectorAll('.sb-errordisplay')].map(element => element.textContent.trim().slice(0, 1000))
    };
  });
  if (idsOnly || controlsOnly) return { ...rendered, sources: [], disabledSources: 0 };
  const sources = [];
  const disabledSources = await page.locator('#storybook-docs .docblock-code-toggle:disabled').count();
  const toggles = page.locator('#storybook-docs .docblock-code-toggle:not(:disabled)');
  for (let index = 0; index < await toggles.count(); index += 1) {
    const toggle = toggles.nth(index);
    const panelId = await toggle.getAttribute('aria-controls');
    const expanded = await toggle.getAttribute('aria-expanded') === 'true';
    const result = { index, panelId };
    try {
      if (!panelId) throw new Error('Source toggle has no associated code panel');
      if (!expanded) await toggle.click();
      await page.waitForFunction(id => document.getElementById(id)?.querySelector('pre')?.textContent.trim().length > 0, panelId);
      const code = await page.evaluate(id => document.getElementById(id).querySelector('pre').textContent, panelId);
      result.characters = code.length;
      await page.evaluate(() => { window.__gaudiCopiedSource = null; });
      await toggle.locator('xpath=following-sibling::button[1]').click();
      await page.waitForFunction(() => typeof window.__gaudiCopiedSource === 'string' && window.__gaudiCopiedSource.length > 0);
      const copied = await page.evaluate(() => window.__gaudiCopiedSource);
      result.copyPayloadMatches = copied.trim() === code.trim();
      if (!result.copyPayloadMatches) {
        // Storybook's generated self-closing TableOfContents source is dedented for display.
        // Check every original line exactly apart from its leading display indentation.
        const isGeneratedToc = code.trimStart().startsWith('<TableOfContentsFixture') && code.trimEnd().endsWith('/>');
        const lines = text => text.trim().split('\n').map(line => line.trimStart());
        assert.ok(isGeneratedToc && JSON.stringify(lines(copied)) === JSON.stringify(lines(code)), 'Copied code preserves every displayed source line');
        result.copyPayloadEquivalentIndentation = true;
        result.copyEquivalence = 'Generated self-closing JSX preserves every line; the visible source removes leading display indentation';
      }
      result.status = 'opened-nonempty-source';
    } catch (error) {
      result.status = 'source-error';
      result.error = error.message.slice(0, 3000);
    } finally {
      if (!expanded && await toggle.getAttribute('aria-expanded') === 'true') await toggle.click();
    }
    sources.push(result);
  }
  return { ...rendered, sources, disabledSources };
}

for (const entry of entries) {
  if (interrupted || !browser.isConnected() || page.isClosed()) break;
  const component = { id: entry.id, title: entry.title, controls: [], errors: [] };
  try {
    errors.length = 0;
    consoleIssues.length = 0;
    await page.goto(`${base}/iframe.html?id=${entry.id}&viewMode=docs`, { timeout: 60000 });
    await page.locator('#storybook-docs').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction(() => document.querySelector('#storybook-docs')?.textContent?.trim().length > 50, null, { timeout: 30000 });
    await page.waitForTimeout(250);
    if (idsOnly) {
      const examples = page.locator('[data-slot="docs-example-story"]');
      component.exampleBodiesVisited = await examples.count();
      for (let index = 0; index < component.exampleBodiesVisited; index += 1) {
        const example = examples.nth(index);
        await example.scrollIntoViewIfNeeded();
        await example.locator('[data-story-block]').waitFor();
        await page.waitForTimeout(180);
      }
      component.mountedExampleBodies = await examples.locator('[data-story-block]').count();
      assert.equal(component.mountedExampleBodies, component.exampleBodiesVisited);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    component.docs = await inspectDocs(page);
    const controls = page.locator('.ds-docs-preview-controls');
    if (idsOnly || sourcesOnly) {
      component.status = idsOnly ? 'id-check-only' : 'source-check-only';
    } else if (!await controls.count()) {
      component.status = 'no-preview-controls';
    } else {
      const preview = page.locator('[id^="story--"][id$="--primary-inner"]').first();
      await preview.locator(':scope > :not(script):not(style)').first().waitFor({ state: 'visible', timeout: 30000 });
      const previewId = await preview.getAttribute('id');
      const storyId = previewId.slice(7, -15);
      component.storyId = storyId;
      const metadata = await page.evaluate(async id => {
        const story = await window.__STORYBOOK_PREVIEW__.storyStoreValue.loadStory({ storyId: id });
        const { previewArgTypes, displayedPreviewArgs } = await import('/src/docs/components/docsContract.js');
        const names = [...document.querySelectorAll('.ds-docs-preview-controls tbody tr')].map(row => row.cells[0].textContent.trim().replace(/\*$/, ''));
        const rows = previewArgTypes(story, names);
        return { rows, args: displayedPreviewArgs(rows, story.initialArgs), initial: Object.fromEntries(Object.keys(rows).map(name => [name, story.initialArgs[name]])) };
      }, storyId);
      for (const [name, arg] of Object.entries(metadata.rows)) {
        if (pendingReport && !pendingNames.get(entry.id).has(name)) continue;
        const values = samples(name, arg, metadata.args[name]);
        const record = { name, type: typeof arg.control === 'string' ? arg.control : arg.control?.type, initial: metadata.args[name], cases: [] };
        if (!values.length) record.review = 'Needs a valid owner-specific sample';
        for (const value of values) {
          const result = { value };
          try {
            await page.keyboard.press('Escape');
            await controls.getByRole('button', { name: 'Reset controls', exact: true }).click();
            await preview.scrollIntoViewIfNeeded();
            await page.waitForTimeout(320);
            const before = await renderedState(preview);
            await page.waitForTimeout(100);
            const steady = await renderedState(preview);
            const row = controls.locator('tbody tr').filter({ has: page.locator('td:first-child', { hasText: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*?$`) }) });
            // Data cells contain the literal property name, so find by exact text.
            const target = await row.count() ? row.first() : controls.locator('tbody tr').filter({ has: page.getByText(name, { exact: true }) }).first();
            await updateControl(target, arg, value);
            await page.waitForTimeout(180);
            const args = await page.evaluate(id => window.__STORYBOOK_PREVIEW__.storyStoreValue.args.get(id), storyId);
            result.received = JSON.stringify(args[name]) === JSON.stringify(value);
            if (!result.received) {
              result.status = 'update-failed';
            } else {
              await preview.scrollIntoViewIfNeeded();
              await page.waitForTimeout(180);
              const after = await renderedState(preview);
              const changed = Object.keys({...steady, ...after}).filter(key => before[key] === steady[key] && steady[key] !== after[key]);
              const visible = changed.filter(key => !key.includes(':uniform:'));
              result.status = visible.length ? 'rendered-change' : changed.length ? 'renderer-change' : 'needs-interaction-check';
              result.changes = changed.slice(0, 5).map(key => ({ key, before: steady[key], after: after[key] }));
            }
            if (result.received && !['runtime-error', 'check-error'].includes(result.status)) {
              const interaction = await verifyInteractiveControl({ page, preview, row: target, arg, name, value, initial: metadata.args[name], id: entry.id, controls });
              if (interaction) { result.status = interaction.kind === 'equivalent-tokens' ? 'equivalent-token-paint' : interaction.kind === 'equivalent-preview' ? 'equivalent-preview-state' : 'interaction-verified'; result.interaction = interaction; }
            }
            if (result.received) {
              const conditional = await verifyConditionalControls({ page, preview, controls, id: entry.id, name, value });
              if (conditional) result.conditionalControl = conditional;
            }
            if (errors.length) { result.errors = errors.splice(0); result.status = 'runtime-error'; }
          } catch (error) { result.status = 'check-error'; result.error = error.message.slice(0, 3000); }
          record.cases.push(result);
        }
        component.controls.push(record);
      }
      await page.keyboard.press('Escape');
      await controls.getByRole('button', { name: 'Reset controls', exact: true }).click();
      await page.waitForFunction(({ id, initial, names }) => {
        const args = window.__STORYBOOK_PREVIEW__.storyStoreValue.args.get(id);
        return names.every(name => JSON.stringify(args[name]) === JSON.stringify(initial[name]));
      }, { id: storyId, initial: metadata.initial, names: Object.keys(metadata.rows) });
      component.resetReceived = true;
      component.status = 'checked';
    }
    component.errors.push(...errors);
  } catch (error) {
    component.status = interrupted || !browser.isConnected() || page.isClosed() ? 'interrupted' : 'page-error';
    component.errors.push(error.message.split('\n')[0]);
  }
  component.consoleIssues = [...consoleIssues];
  report.components.push(component);
  await writeFile(`${output}/results.json`, JSON.stringify(report, null, 2));
  const cases = component.controls.flatMap(control => control.cases);
  console.log(`${report.components.length}/${entries.length} ${entry.id}: ${component.controls.length} controls, ${cases.length} values, ${cases.filter(value => !['rendered-change', 'renderer-change', 'interaction-verified', 'equivalent-token-paint', 'equivalent-preview-state'].includes(value.status)).length} reviews${component.errors.length ? `, ${component.errors.length} errors` : ''}`);
}
report.finishedAt = new Date().toISOString();
report.missingPageIds = entries.filter(entry => !report.components.some(component => component.id === entry.id && component.status !== 'interrupted')).map(entry => entry.id);
report.complete = report.missingPageIds.length === 0;
if (report.complete) report.completedAt = report.finishedAt;
else process.exitCode = interrupted ? 130 : 1;
await writeFile(`${output}/results.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(`Per-component results saved to ${output}/results.json. Review unresolved and renderer-only cases before claiming full verification.`);
