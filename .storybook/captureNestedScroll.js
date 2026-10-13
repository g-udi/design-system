import { createHash } from 'node:crypto';
import { settleFiniteAnimations } from './settleFiniteAnimations.js';

/** Capture actual nested scroll endpoints in the current authored state, restoring all offsets. */
export async function captureNestedScroll(surface, path, screenshot) {
  const result = { images: [] };
  const discovered = await surface.evaluate(async () => {
    const path = element => {
      const parts = [];
      for (let node = element; node && node !== document.body; node = node.parentElement) {
        const siblings = [...node.parentElement.children];
        parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${siblings.indexOf(node) + 1})`);
      }
      return `body > ${parts.join(' > ')}`;
    };
    const elements = [...document.querySelectorAll('body *')];
    let capable;
    window.__restoreNestedCaptureOffsets = async () => {
      const restore = window.__nestedCaptureRestore;
      let stable = 0;
      for (let attempt = 0; attempt < 10; attempt++) {
        for (const item of restore.elements) item.element.scrollTo({ left: item.x, top: item.y, behavior: 'instant' });
        scrollTo({ left: restore.x, top: restore.y, behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const exact = Math.abs(scrollX - restore.x) <= 1 && Math.abs(scrollY - restore.y) <= 1 && restore.elements.every(item => item.element.isConnected && Math.abs(item.element.scrollLeft - item.x) <= 1 && Math.abs(item.element.scrollTop - item.y) <= 1);
        stable = exact ? stable + 1 : 0;
        if (stable >= 2) return true;
      }
      return false;
    };
    const exclusions = [];
    window.__nestedCaptureFixedRegions = new WeakSet();
    window.__nestedCaptureRegions = elements.filter(element => {
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0 && element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
        ((/auto|scroll/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1) || (/auto|scroll/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1)))) return false;
      let left = rect.left, right = rect.right, top = rect.top, bottom = rect.bottom, fixed = style.position === 'fixed';
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
        const ancestorStyle = getComputedStyle(ancestor), clip = ancestor.getBoundingClientRect();
        fixed ||= ancestorStyle.position === 'fixed';
        if (/auto|scroll|hidden|clip/.test(ancestorStyle.overflowX)) { left = Math.max(left, clip.left); right = Math.min(right, clip.right); }
        if (/auto|scroll|hidden|clip/.test(ancestorStyle.overflowY)) { top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom); }
      }
      const inaccessible = element.closest('[inert], [aria-hidden="true"]');
      const offscreen = right <= left + 1 || bottom <= top + 1 || right <= 0 || left >= innerWidth || (fixed && (bottom <= 0 || top >= innerHeight));
      if (inaccessible || offscreen) { exclusions.push({ selector: path(element), tag: element.tagName, role: element.getAttribute('role'), reason: inaccessible ? 'inert-or-aria-hidden' : 'fully-clipped-or-offscreen', bounds: { left, right, top, bottom } }); return false; }
      if (fixed) window.__nestedCaptureFixedRegions.add(element);
      return true;
    });
    const ancestors = new Set(window.__nestedCaptureRegions);
    for (const region of window.__nestedCaptureRegions) {
      for (let ancestor = region.parentElement; ancestor; ancestor = ancestor.parentElement) ancestors.add(ancestor);
    }
    capable = [...ancestors];
    // Establish a stable authored baseline before capturing synchronized scroll owners.
    let baseline, stableBaseline = 0;
    for (let attempt = 0; attempt < 10; attempt++) {
      const before = capable.map(element => ({ element, x: element.scrollLeft, y: element.scrollTop }));
      const x = scrollX, y = scrollY;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const stable = Math.abs(scrollX - x) <= 1 && Math.abs(scrollY - y) <= 1 && before.every(item => item.element.isConnected && Math.abs(item.element.scrollLeft - item.x) <= 1 && Math.abs(item.element.scrollTop - item.y) <= 1);
      stableBaseline = stable ? stableBaseline + 1 : 0;
      baseline = { x: scrollX, y: scrollY, elements: capable.map(element => ({ element, x: element.scrollLeft, y: element.scrollTop })) };
      if (stableBaseline >= 2) break;
    }
    if (stableBaseline < 2) throw new Error('Nested capture initial scroll offsets did not settle.');
    window.__nestedCaptureRestore = baseline;
    const regions = window.__nestedCaptureRegions.map((element, index) => {
      const style = getComputedStyle(element);
      return { index, selector: path(element), tag: element.tagName, role: element.getAttribute('role'), label: element.getAttribute('aria-label'), x: element.scrollLeft, y: element.scrollTop, maxX: /auto|scroll/.test(style.overflowX) ? Math.max(0, element.scrollWidth - element.clientWidth) : 0, maxY: /auto|scroll/.test(style.overflowY) ? Math.max(0, element.scrollHeight - element.clientHeight) : 0, rtl: style.direction === 'rtl' };
    });
    return { regions, exclusions, restoredElementCount: capable.length };
  });
  result.nestedRegions = discovered.regions;
  result.excludedNestedRegions = discovered.exclusions;
  result.restoredElementCount = discovered.restoredElementCount;
  result.nestedScope = 'Actually rendered overflow:auto/scroll regions in the current authored capture state. Closed overlays are absent and require separately authored derived-state checks.';
  try {
    for (const region of result.nestedRegions) {
      const endpoints = region.maxX > 1 && region.maxY > 1 ? ['x', 'y', 'xy'] : [region.maxX > 1 ? 'x' : 'y'];
      for (const endpoint of endpoints) {
        let position = await surface.evaluate(async ({ index, endpoint }) => {
          if (!await window.__restoreNestedCaptureOffsets()) throw new Error('Nested capture could not restore offsets before endpoint.');
          const element = window.__nestedCaptureRegions[index];
          // Position only the document. scrollIntoView can move overflow-hidden ancestors.
          const rect = element.getBoundingClientRect();
          if (!window.__nestedCaptureFixedRegions.has(element) && (rect.bottom > innerHeight || rect.top < 0)) {
            const top = rect.height > innerHeight ? scrollY + rect.top : scrollY + rect.bottom - innerHeight;
            scrollTo({ left: scrollX, top: Math.max(0, top), behavior: 'instant' });
          }
          const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const originalX = element.scrollLeft, originalY = element.scrollTop;
          let position, stable = 0;
          // Virtual measurements and synchronized panes may update extents after the first scroll.
          // Recompute the real endpoint in a bounded settle pass; never accept a missed endpoint.
          for (let attempt = 0; attempt < 10; attempt++) {
            const style = getComputedStyle(element);
            const maxX = /auto|scroll/.test(style.overflowX) ? Math.max(0, element.scrollWidth - element.clientWidth) : 0;
            const maxY = /auto|scroll/.test(style.overflowY) ? Math.max(0, element.scrollHeight - element.clientHeight) : 0;
            const targetX = endpoint.includes('x') ? maxX * (style.direction === 'rtl' ? -1 : 1) : originalX;
            const targetY = endpoint.includes('y') ? maxY : originalY;
            element.scrollTo({ left: targetX, top: targetY, behavior: 'instant' });
            await frame();
            const finalMaxX = /auto|scroll/.test(style.overflowX) ? Math.max(0, element.scrollWidth - element.clientWidth) : 0;
            const finalMaxY = /auto|scroll/.test(style.overflowY) ? Math.max(0, element.scrollHeight - element.clientHeight) : 0;
            position = { x: element.scrollLeft, y: element.scrollTop, targetX: endpoint.includes('x') ? finalMaxX * (style.direction === 'rtl' ? -1 : 1) : originalX, targetY: endpoint.includes('y') ? finalMaxY : originalY, documentX: scrollX, documentY: scrollY, settleAttempts: attempt + 1 };
            stable = Math.abs(position.x - position.targetX) <= 1 && Math.abs(position.y - position.targetY) <= 1 ? stable + 1 : 0;
            if (stable >= 2) break;
          }
          return { ...position, settled: stable >= 2 };
        }, { index: region.index, endpoint });
        if (!position.settled || Math.abs(position.x - position.targetX) > 1 || Math.abs(position.y - position.targetY) > 1) throw new Error(`Nested region ${region.index} did not reach ${endpoint} endpoint: ${JSON.stringify(position)}`);
        // Scroll-driven overlay exits need the same finite-animation settle as base captures.
        const finiteAnimationsSettled = await surface.evaluate(settleFiniteAnimations);
        position = { ...position, ...await surface.evaluate(async ({ index, endpoint, position, finiteAnimationsSettled }) => {
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          const element = window.__nestedCaptureRegions[index], style = getComputedStyle(element);
          return { x: element.scrollLeft, y: element.scrollTop, targetX: endpoint.includes('x') ? Math.max(0, element.scrollWidth - element.clientWidth) * (style.direction === 'rtl' ? -1 : 1) : position.targetX, targetY: endpoint.includes('y') ? Math.max(0, element.scrollHeight - element.clientHeight) : position.targetY, documentX: scrollX, documentY: scrollY, finiteAnimationsSettled };
        }, { index: region.index, endpoint, position, finiteAnimationsSettled }) };
        if (Math.abs(position.x - position.targetX) > 1 || Math.abs(position.y - position.targetY) > 1) throw new Error(`Nested region ${region.index} moved away from ${endpoint} endpoint during animation settle: ${JSON.stringify(position)}`);
        const file = path.replace(/\.png$/, `--nested-${region.index}-${endpoint}.png`);
        const bytes = await screenshot(file);
        result.images.push({ file, nestedRegion: region.index, endpoint, position, sha256: createHash('sha256').update(bytes).digest('hex') });
      }
    }
  } finally {
    result.scrollPositionsRestored = await surface.evaluate(() => window.__restoreNestedCaptureOffsets());
  }
  if (!result.scrollPositionsRestored) throw new Error('Nested capture did not restore original scroll positions.');
  result.noNestedOverflow = result.nestedRegions.length === 0;
  return result;
}
