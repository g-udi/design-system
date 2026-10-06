'use client';
import * as React from 'react';
export const FILTER_DND_ACTIVATION = {
  /** Mouse travel before a press becomes a drag. Below this it stays a click. */
  moveDistancePx: 5,
  /** Touch long-press before a drag starts, so a swipe still scrolls. */
  touchDelayMs: 250,
  touchTolerancePx: 5,
  autoScrollEdgePx: 40,
  autoScrollMaxStepPx: 12,
  /** A seed only: `createCarry` measures the real grab offset before paint. */
  carryPointerOffsetPx: 12
};
export const FILTER_ROW_SELECTOR = '[data-slot="filter-row"]';
export const FILTER_DROP_ZONE_SELECTOR = '[data-drop-parent]';
export const FILTER_GROUP_SELECTOR = '[data-slot="filter-group"]';
function contains(box, x, y, grow = 0) {
  return (
    x >= box.left &&
    x <= box.right &&
    y >= box.top - grow &&
    y <= box.bottom + grow
  );
}
export const FILTER_ROW_SEAM_PX = 6;
export function resolveFilterDrop(
  zones,
  rows,
  x,
  y,
  seam = FILTER_ROW_SEAM_PX
) {
  let zone = null;
  for (const candidate of zones) {
    if (!contains(candidate, x, y)) continue;
    if (!zone || candidate.depth > zone.depth) zone = candidate;
  }
  if (zone) return { target: zone, edge: null };
  let row = null;
  for (const candidate of rows) {
    if (!contains(candidate, x, y, seam)) continue;
    if (!row || candidate.depth > row.depth) row = candidate;
  }
  if (!row) return null;
  const after = y > row.top + (row.bottom - row.top) / 2;
  return {
    target: { ...row, index: row.index + (after ? 1 : 0) },
    edge: after ? 'after' : 'before'
  };
}
export function isFilterDropNoop(resolution, origin, copy) {
  if (!resolution || !origin || copy) return false;
  if (resolution.target.parentId !== origin.parentId) return false;
  return (
    resolution.target.index === origin.index ||
    resolution.target.index === origin.index + 1
  );
}
const activeCancels = /* @__PURE__ */ new Set();
export function cancelActiveFilterDrags() {
  for (const cancel of [...activeCancels]) cancel();
}
let lastDragEndedAt = 0;
export function wasRecentFilterDrag() {
  return performance.now() - lastDragEndedAt < 250;
}
function suppressTrailingClick(event) {
  window.removeEventListener('click', suppressTrailingClick, true);
  if (!wasRecentFilterDrag()) return;
  event.stopPropagation();
  event.preventDefault();
}
function snapToPixel(value) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  return Math.round(value * dpr) / dpr;
}
function findScrollParent(el) {
  let node = el ?? null;
  while (node) {
    const style = getComputedStyle(node);
    const overflow = `${style.overflowY} ${style.overflow}`;
    if (
      /(auto|scroll|overlay)/.test(overflow) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
function rowDepth(el, root) {
  let depth = 0;
  let node = el.parentElement;
  while (node && node !== root) {
    if (node.matches(FILTER_ROW_SELECTOR)) depth++;
    node = node.parentElement;
  }
  return depth;
}
function collectSurface(root, dragged) {
  const zones = [];
  const rows = [];
  for (const el of root.querySelectorAll(FILTER_DROP_ZONE_SELECTOR)) {
    if (dragged.contains(el)) continue;
    const parentId = el.dataset.dropParent;
    if (!parentId) continue;
    const rect = el.getBoundingClientRect();
    zones.push({
      el,
      card: el.closest(FILTER_GROUP_SELECTOR),
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      parentId,
      index: Number(el.dataset.dropIndex ?? 0),
      depth: rowDepth(el, root)
    });
  }
  for (const el of root.querySelectorAll(FILTER_ROW_SELECTOR)) {
    if (el !== dragged && dragged.contains(el)) continue;
    const parentId = el.dataset.parentId;
    if (!parentId) continue;
    const rect = el.getBoundingClientRect();
    rows.push({
      el,
      card: null,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      parentId,
      index: Number(el.dataset.index ?? 0),
      depth: rowDepth(el, root)
    });
  }
  const viewport = findScrollParent(root);
  return {
    zones,
    rows,
    viewport,
    viewportRect: viewport?.getBoundingClientRect() ?? null,
    startScrollTop: viewport?.scrollTop ?? 0
  };
}
function paint(surface, hit) {
  for (const box of surface.zones) {
    delete box.el.dataset.dropInto;
    if (box.card) delete box.card.dataset.dropInto;
  }
  for (const box of surface.rows) delete box.el.dataset.dropEdge;
  if (!hit) return;
  if (hit.edge) {
    hit.target.el.dataset.dropEdge = hit.edge;
    return;
  }
  hit.target.el.dataset.dropInto = '';
  if (hit.target.card) hit.target.card.dataset.dropInto = '';
}
function startDrag(event, nodeId, options) {
  const handle = event.currentTarget;
  const root = options.root();
  const source = handle.closest(FILTER_ROW_SELECTOR);
  if (!root || !source) return;
  const pointerId = event.pointerId;
  const isTouch = event.pointerType === 'touch';
  const startX = event.clientX;
  const startY = event.clientY;
  const origin = source.dataset.parentId
    ? {
        parentId: source.dataset.parentId,
        index: Number(source.dataset.index ?? 0)
      }
    : null;
  let active = false;
  let finished = false;
  let surface = null;
  let hit = null;
  let copy = event.altKey;
  let lastEvent = null;
  let touchTimer = null;
  let rafScroll = 0;
  let dropState = 'none';
  let carryEl = null;
  let badgeEl = null;
  let grabOffsetX = FILTER_DND_ACTIVATION.carryPointerOffsetPx;
  let grabOffsetY = FILTER_DND_ACTIVATION.carryPointerOffsetPx;
  const createCarry = () => {
    const rect = source.getBoundingClientRect();
    grabOffsetX = startX - rect.left;
    grabOffsetY = startY - rect.top;
    carryEl = document.createElement('div');
    carryEl.setAttribute('data-slot', 'filters-drag-carry');
    carryEl.setAttribute('aria-hidden', 'true');
    carryEl.className =
      'pointer-events-none fixed top-0 left-0 z-100 opacity-95 will-change-transform data-drop-invalid:ring-ui-destructive/70 data-drop-invalid:ring-2 data-drop-invalid:opacity-60';
    carryEl.style.position = 'fixed';
    const clone = source.cloneNode(true);
    delete clone.dataset.dragging;
    delete clone.dataset.dropNoop;
    delete clone.dataset.dropEdge;
    if (rect.width > 0) clone.style.width = `${rect.width}px`;
    const strip = (el) => {
      el.removeAttribute('id');
      el.removeAttribute('data-node-id');
      el.removeAttribute('data-filter-cell');
      if (el.dataset.slot === 'filter-row') el.removeAttribute('data-slot');
      el.setAttribute('tabindex', '-1');
    };
    strip(clone);
    for (const el of clone.querySelectorAll('*')) strip(el);
    const clip = document.createElement('div');
    clip.className = 'bg-ui-background overflow-hidden rounded-md';
    if (rect.width > 0) clip.style.width = `${rect.width}px`;
    if (rect.height > 0) clip.style.height = `${rect.height}px`;
    clip.appendChild(clone);
    carryEl.appendChild(clip);
    badgeEl = document.createElement('span');
    badgeEl.setAttribute('data-slot', 'filters-drag-copy');
    badgeEl.className =
      'bg-ui-primary text-ui-primary-foreground absolute -end-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full text-xs leading-none';
    badgeEl.textContent = '+';
    badgeEl.hidden = !copy;
    carryEl.appendChild(badgeEl);
    document.body.appendChild(carryEl);
    positionCarry(startX, startY);
  };
  const positionCarry = (x, y) => {
    if (!carryEl) return;
    carryEl.style.transform = `translate3d(${snapToPixel(x - grabOffsetX)}px, ${snapToPixel(y - grabOffsetY)}px, 0)`;
  };
  const paintCursor = () => {
    if (!active) return;
    document.body.style.cursor =
      dropState === 'none' ? 'no-drop' : copy ? 'copy' : 'grabbing';
  };
  const setDropState = (next) => {
    dropState = next;
    if (next === 'noop') source.dataset.dropNoop = '';
    else delete source.dataset.dropNoop;
    if (carryEl) {
      if (next === 'none') carryEl.dataset.dropInvalid = '';
      else delete carryEl.dataset.dropInvalid;
    }
    paintCursor();
  };
  const setCopy = (next) => {
    if (copy === next) return;
    copy = next;
    if (badgeEl) badgeEl.hidden = !next;
    paintCursor();
    if (lastEvent) hitTest(lastEvent.clientX, lastEvent.clientY);
  };
  const hitTest = (x, y) => {
    if (!surface) return;
    const scrolled = surface.viewport?.scrollTop ?? surface.startScrollTop;
    const drift = scrolled - surface.startScrollTop;
    const resolved = resolveFilterDrop(
      surface.zones,
      surface.rows,
      x,
      y + drift
    );
    const noop = isFilterDropNoop(resolved, origin, copy);
    hit = noop ? null : resolved;
    paint(surface, hit);
    setDropState(noop ? 'noop' : hit ? 'ok' : 'none');
  };
  const autoScroll = (y) => {
    if (rafScroll) cancelAnimationFrame(rafScroll);
    rafScroll = 0;
    const viewport = surface?.viewport;
    const rect = surface?.viewportRect;
    if (!viewport || !rect) return;
    const edge = FILTER_DND_ACTIVATION.autoScrollEdgePx;
    const step = FILTER_DND_ACTIVATION.autoScrollMaxStepPx;
    let delta = 0;
    if (y >= rect.top && y < rect.top + edge) {
      delta = -step * ((rect.top + edge - y) / edge);
    } else if (y <= rect.bottom && y > rect.bottom - edge) {
      delta = step * Math.min(1, (y - (rect.bottom - edge)) / edge);
    }
    if (delta === 0) return;
    const tick = () => {
      const before = viewport.scrollTop;
      viewport.scrollTop = before + delta;
      if (viewport.scrollTop === before) return;
      if (lastEvent) hitTest(lastEvent.clientX, lastEvent.clientY);
      rafScroll = requestAnimationFrame(tick);
    };
    rafScroll = requestAnimationFrame(tick);
  };
  const onViewportScroll = () => {
    if (!active || !lastEvent) return;
    hitTest(lastEvent.clientX, lastEvent.clientY);
  };
  const activate = () => {
    if (active) return;
    active = true;
    surface = collectSurface(root, source);
    surface.viewport?.addEventListener('scroll', onViewportScroll, {
      passive: true
    });
    source.dataset.dragging = '';
    document.body.style.cursor = copy ? 'copy' : 'grabbing';
    document.body.style.userSelect = 'none';
    createCarry();
    window.addEventListener('blur', onWindowBlur);
  };
  const cleanup = () => {
    if (finished) return;
    finished = true;
    activeCancels.delete(cancel);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('keyup', onKeyUp, true);
    window.removeEventListener('blur', onWindowBlur);
    surface?.viewport?.removeEventListener('scroll', onViewportScroll);
    if (touchTimer) clearTimeout(touchTimer);
    if (rafScroll) cancelAnimationFrame(rafScroll);
    if (surface) paint(surface, null);
    delete source.dataset.dragging;
    delete source.dataset.dropNoop;
    carryEl?.remove();
    carryEl = null;
    badgeEl = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };
  const cancel = () => {
    if (active) lastDragEndedAt = performance.now();
    cleanup();
  };
  const onWindowBlur = () => cancel();
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && active) {
      e.stopPropagation();
      e.preventDefault();
      cancel();
      return;
    }
    if (e.key === 'Alt') setCopy(true);
  };
  const onKeyUp = (e) => {
    if (e.key === 'Alt') setCopy(false);
  };
  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId) return;
    lastEvent = e;
    if (!active) {
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (isTouch) {
        if (distance > FILTER_DND_ACTIVATION.touchTolerancePx) cancel();
        return;
      }
      if (distance < FILTER_DND_ACTIVATION.moveDistancePx) return;
      activate();
    }
    setCopy(e.altKey);
    positionCarry(e.clientX, e.clientY);
    hitTest(e.clientX, e.clientY);
    autoScroll(e.clientY);
  };
  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    const landed = active ? hit : null;
    const wasCopy = copy;
    cleanup();
    if (!active) return;
    lastDragEndedAt = performance.now();
    window.addEventListener('click', suppressTrailingClick, true);
    if (!landed) return;
    options.onDrop(nodeId, {
      parentId: landed.target.parentId,
      index: landed.target.index,
      copy: wasCopy
    });
  };
  const onPointerCancel = (e) => {
    if (e.pointerId !== pointerId) return;
    cancel();
  };
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp, true);
  activeCancels.add(cancel);
  if (isTouch) {
    touchTimer = setTimeout(() => {
      activate();
      if (lastEvent) {
        positionCarry(lastEvent.clientX, lastEvent.clientY);
        hitTest(lastEvent.clientX, lastEvent.clientY);
      }
    }, FILTER_DND_ACTIVATION.touchDelayMs);
  }
}
export function useFilterRowDrag(options) {
  const latest = React.useRef(options);
  React.useEffect(() => {
    latest.current = options;
  });
  React.useEffect(() => cancelActiveFilterDrags, []);
  return React.useCallback(
    (nodeId) => ({
      onPointerDown: (event) => {
        if (latest.current.disabled) return;
        if (event.button !== 0) return;
        startDrag(event, nodeId, latest.current);
      }
    }),
    []
  );
}
