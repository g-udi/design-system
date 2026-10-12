import { commands, page } from 'vitest/browser';
import { auditWidths } from '../tests/support/responsiveWidths.js';
import tokenData from '../src/tokens/tokens.json';
import { collectVisualLayout } from './visualAudit.js';

export { auditWidths };

const describe = (element) => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''} ${element.getAttribute('data-slot') || element.className || ''}`.slice(0, 180);
const floatingSelectors = ['cascader-content', 'popover-content', 'hover-card-content', 'select-content', 'combobox-content', 'autocomplete-content', 'autocomplete-popup', 'dropdown-menu-content', 'dropdown-menu-sub-content', 'context-menu-content', 'context-menu-sub-content', 'tooltip-content'].map(slot => `[data-slot="${slot}"]`).join(',');
const visiblePopups = () => [...document.querySelectorAll(floatingSelectors)].filter(element => element.checkVisibility() && element.getBoundingClientRect().width > 0);

async function settlePopupPlacement() {
  if (!visiblePopups().length) return;
  let previous;
  let stable = 0;
  // Anchors and collision positioning update after ResizeObserver, then paint.
  for (let frame = 0; frame < 20 && stable < 3; frame += 1) {
    await new Promise(resolve => requestAnimationFrame(resolve));
    const position = visiblePopups().map(element => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y, width, height].map(value => Math.round(value * 10)).join(',');
    }).join(';');
    stable = position === previous ? stable + 1 : 0;
    previous = position;
  }
}

export async function auditStoryLayout(context) {
  const source = context.parameters?.docs?.source;
  if (source) {
    const code = source.transform ? await source.transform(source.code ?? '', context) : source.code;
    await commands.checkStorySource({ id: context.id, code, language: source.language });
  }
  // Storybook pauses end frames before afterEach. A frozen measured height is
  // invalid when we resize the story, so restore live animation during the audit.
  const freezeRule = '*,*:before,*:after{animation-delay:0s!important;animation-direction:reverse!important;animation-play-state:paused!important;transition:none!important;}';
  const frozenSheets = [...document.head.querySelectorAll('style')]
    .filter(style => style.textContent.replace(/\s/g, '') === freezeRule)
    .map(style => ({ sheet: style.sheet, disabled: style.sheet.disabled }));
  try {
    frozenSheets.forEach(({ sheet }) => { sheet.disabled = true; });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await settleFiniteAnimations();
    return await auditCurrentDensities(context);
  } finally {
    // Restoring a desktop viewport can restart an entrance animation. Let it
    // finish before Storybook freezes frames for the accessibility check.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await settleFiniteAnimations();
    frozenSheets.forEach(({ sheet, disabled }) => { sheet.disabled = disabled; });
  }
}

async function settleFiniteAnimations() {
  await Promise.race([
    Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))),
    new Promise(resolve => setTimeout(resolve, 2000))
  ]);
}

async function auditCurrentDensities(context) {
  if (import.meta.env.VITE_GAUDI_AUDIT_DENSITIES !== 'all') return auditCurrentThemes(context);
  const style = document.documentElement.style;
  const previous = style.getPropertyValue('--ds-space-scale');
  const priority = style.getPropertyPriority('--ds-space-scale');
  try {
    for (const density of Object.values(tokenData.spaceScales)) {
      style.setProperty('--ds-space-scale', String(density));
      await auditCurrentThemes({
        ...context,
        id: density === 1 ? context.id : `${context.id}--density-${density}`,
        auditDensity: density,
      });
    }
  } finally {
    if (previous) style.setProperty('--ds-space-scale', previous, priority);
    else style.removeProperty('--ds-space-scale');
  }
}

async function auditCurrentThemes(context) {
  if (import.meta.env.VITE_GAUDI_AUDIT_THEMES !== 'both') return auditTheme(context);
  const roots = [document.documentElement, document.body, document.getElementById('storybook-root'), document.getElementById('storybook-docs')].filter(Boolean);
  const previous = roots.map(element => ({ element, dark: element.classList.contains('dark') }));
  const background = document.body.style.backgroundColor;
  const colorScheme = document.documentElement.style.colorScheme;
  try {
    for (const theme of ['light', 'dark']) {
      roots.forEach(element => element.classList.toggle('dark', theme === 'dark'));
      document.documentElement.style.colorScheme = theme;
      document.body.style.backgroundColor = 'var(--ds-color-surface)';
      await auditTheme(context);
    }
  } finally {
    previous.forEach(({ element, dark }) => element.classList.toggle('dark', dark));
    document.body.style.backgroundColor = background;
    document.documentElement.style.colorScheme = colorScheme;
  }
}

async function auditTheme({ canvasElement, id, beforeAuditWidth, parameters, auditDensity }) {
  const previous = { width: innerWidth, height: innerHeight };
  const failures = [];
  const checks = [];
  const visualFindings = [];
  // Full breakpoint coverage at the default density; every other supported
  // density is measured across phone, tablet, laptop and wide desktop widths.
  const widths = auditDensity && auditDensity !== 1 ? [320, 390, 768, 1440, 1920] : auditWidths;
  try {
    for (const width of widths) {
      await page.viewport(width, 900);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await beforeAuditWidth?.({ width, canvasElement });
      // Data-driven canvases can rebuild their scene when the theme or viewport changes.
      const readySelector = parameters?.layoutAudit?.readySelector;
      if (readySelector) {
        const deadline = performance.now() + 20000;
        while (!canvasElement.querySelector(readySelector)) {
          if (performance.now() > deadline) throw new Error(`${id}: scene did not settle (${readySelector})`);
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      // DataGrid intentionally debounces auto-sized columns for 150 ms.
      if (canvasElement.querySelector('[data-slot="data-grid-table"]')) await new Promise(resolve => setTimeout(resolve, 180));
      await settlePopupPlacement();
      const errorOverlay = document.querySelector('vite-error-overlay');
      if (errorOverlay) {
        const detail = errorOverlay.shadowRoot?.textContent || errorOverlay.textContent;
        throw new Error(`${id}: preview has a Vite error overlay; this render is not valid audit evidence. ${detail?.slice(0, 500) || ''}`);
      }
      if (import.meta.env.VITE_GAUDI_AUDIT_VISUAL === '1') {
        // Container-width heuristics need review: an intentionally generous
        // layout is not a failure merely because it contains little text.
        const findings = collectVisualLayout({ canvasElement, parameters });
        if (findings.length) visualFindings.push({ width, findings });
      }
      const captureIds = import.meta.env.VITE_GAUDI_AUDIT_SCREENSHOTS?.split(',') || [];
      const capture = captureIds.includes('*') || captureIds.some(story => id === story || id.startsWith(`${story}--`));
      if (capture && (!auditDensity || auditDensity === 1) && import.meta.env.VITE_GAUDI_AUDIT_SCREENSHOT_DIR && [320, 390, 1440].includes(width)) {
        // Recharts restarts its entry animation after a responsive resize.
        if (canvasElement.querySelector('.recharts-wrapper')) await new Promise(resolve => setTimeout(resolve, 1700));
        // Capture completed finite CSS transitions, while leaving ambient loops running.
        await settleFiniteAnimations();
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        await commands.captureStoryViewport(`${import.meta.env.VITE_GAUDI_AUDIT_SCREENSHOT_DIR}/${id}-${theme}-${width}.png`);
      }
      const actualWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const overflow = scrollWidth > actualWidth + 1;
      // Negative-positioned regions can disappear without increasing scrollWidth.
      for (const region of canvasElement.querySelectorAll('aside, article, main, nav, section, [role="region"], [role="complementary"]')) {
        const rect = region.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.right >= 0 || !region.checkVisibility({ opacityProperty: true }) || region.closest('[hidden], [aria-hidden="true"], [inert], .sr-only')) continue;
        let clipped = false;
        for (let parent = region.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) { clipped = true; break; }
        }
        if (!clipped) failures.push(`${width}px: content region is entirely off-screen (${Math.round(rect.left)}–${Math.round(rect.right)}px); ${describe(region)}`);
      }
      for (const popup of visiblePopups()) {
        const rect = popup.getBoundingClientRect();
        if (rect.left < -1 || rect.right > actualWidth + 1) failures.push(`${width}px: floating content leaves the viewport (${Math.round(rect.left)}–${Math.round(rect.right)}px); ${describe(popup)}`);
      }
      checks.push({ width, actualWidth, scrollWidth });
      if (innerWidth !== width) failures.push(`${width}px: viewport did not resize`);
      if (overflow) {
        const offenders = [...document.body.querySelectorAll('*')].filter(element => {
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height || rect.right <= actualWidth + 1 || element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
          for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) return false;
          }
          return true;
        }).slice(0, 5).map(describe);
        failures.push(`${width}px: document is ${scrollWidth}px; ${offenders.join('; ')}`);
      }
    }
    const guide = canvasElement.querySelector('.ds-guide-page');
    if (guide) {
      const title = guide.querySelector('h1');
      if (!title || getComputedStyle(title).fontSize !== '28px') failures.push('Guide title does not use the shared 28px scale');
      const intro = guide.querySelector('header p');
      if (intro && getComputedStyle(intro).fontSize !== '13px') failures.push('Guide intro does not use the shared 13px scale');
    }
  } finally {
    await page.viewport(previous.width, previous.height);
  }
  await commands.recordStoryAudit({ id, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', checks, failures, ...(auditDensity ? { density: auditDensity } : {}), ...(import.meta.env.VITE_GAUDI_AUDIT_VISUAL === '1' ? { visualFindings } : {}) });
  if (failures.length) throw new Error(`${id}\n${failures.join('\n')}`);
}
