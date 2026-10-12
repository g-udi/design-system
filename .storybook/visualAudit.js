// Rendered-layout audit (VITE_GAUDI_VISUAL=1). Catches breakage the code detector and
// document-overflow audit cannot see: content spilling out of its own bordered container,
// and bordered containers far wider than the content they hold.

const MEDIA = new Set(['IMG', 'SVG', 'svg', 'INPUT', 'TEXTAREA', 'SELECT', 'CANVAS', 'VIDEO', 'IFRAME']);
const hasOwnText = (element) => [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
const isLeaf = (element) => !element.children.length || MEDIA.has(element.tagName) || hasOwnText(element);
const label = (element) => element.getAttribute('data-slot') || element.tagName.toLowerCase();

function isBordered(element) {
  const style = getComputedStyle(element);
  const sides = parseFloat(style.borderLeftWidth) > 0 && parseFloat(style.borderRightWidth) > 0 && style.borderLeftStyle !== 'none';
  return sides || / 0px 0px 0px 1px/.test(style.boxShadow);
}
const clipsX = (element) => ['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(element).overflowX);

export function collectVisualLayout({ canvasElement, parameters }) {
  // Stories whose containers span the width by design declare it: parameters.visualAudit.wide = 'reason'.
  const allowWide = Boolean(parameters?.visualAudit?.wide);
  const root = canvasElement;
  const visible = [...root.querySelectorAll('*')].filter((element) => {
    if (element.closest('[hidden],[aria-hidden="true"],[inert],.sr-only') || !element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const { width, height } = element.getBoundingClientRect();
    return width > 0 && height > 0 && !['absolute', 'fixed'].includes(getComputedStyle(element).position);
  });
  const failures = new Set();

  for (const element of visible) {
    if (!isLeaf(element)) continue;
    const box = element.getBoundingClientRect();
    for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
      if (clipsX(parent)) break;
      if (!isBordered(parent)) continue;
      const frame = parent.getBoundingClientRect();
      if (box.right > frame.right + 2 || box.left < frame.left - 2) failures.add(`${label(element)} spills outside ${label(parent)}`);
      break;
    }
  }

  for (const element of visible) {
    if (allowWide || !isBordered(element)) continue;
    const frame = element.getBoundingClientRect();
    if (frame.width < 420) continue;
    let left = Infinity;
    let right = -Infinity;
    for (const child of element.querySelectorAll('*')) {
      if (!isLeaf(child)) continue;
      const box = child.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      left = Math.min(left, box.left);
      right = Math.max(right, box.right);
    }
    if (right > left && right - left < frame.width * 0.5) {
      failures.add(`${label(element)} is ${Math.round(frame.width)}px wide around ${Math.round(right - left)}px of content`);
    }
  }

  return [...failures];
}

export async function auditVisualLayout(context) {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const failures = collectVisualLayout(context);
  if (failures.length) throw new Error(`${context.id}\n${failures.slice(0, 5).join('\n')}`);
}
