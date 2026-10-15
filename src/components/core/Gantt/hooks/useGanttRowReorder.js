'use client';
import { useCallback, useRef, useState } from 'react';
import { cancelActiveGanttGestures, registerGanttGestureCancel } from '../ganttGestures.js';
import { reorderResources } from '../ganttModel.jsx';
function useGanttRowReorder({
  settings,
  rows,
  treeRowsRef,
  treePaneRef
}) {

  const [reorder, setReorder] = useState(null);
  const reorderEnabled = !!settings.onResourceReorder;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const beginRowReorder = useCallback((e, dragRow) => {
    const settings2 = settingsRef.current;
    const rows2 = rowsRef.current;
    if (e.button !== 0 || !settings2.onResourceReorder) return;
    e.preventDefault();
    e.stopPropagation();
    const container = treeRowsRef.current;
    const pane = treePaneRef.current;
    if (!container || !pane) return;
    const rowEls = Array.from(
      container.querySelectorAll('[data-slot=gantt-row-group]')
    );
    cancelActiveGanttGestures();
    const previous = { cursor: document.body.style.cursor, userSelect: document.body.style.userSelect };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    let current = null;
    let lastBoundary = -1;
    const pointerId = e.pointerId;
    const rowEl = e.currentTarget.closest('[data-slot=gantt-row-group]');
    const overlay = document.createElement('div');
    overlay.setAttribute('data-slot', 'gantt-drag-overlay');
    overlay.className =
      'bg-ui-background pointer-events-none fixed overflow-hidden opacity-95';
    overlay.style.zIndex = '100';
    const ganttRoot = pane.closest('[data-slot=gantt]');
    if (ganttRoot) {
      const rootStyle = getComputedStyle(ganttRoot);
      overlay.style.fontSize = rootStyle.fontSize;
      overlay.style.lineHeight = rootStyle.lineHeight;
      overlay.style.fontFamily = rootStyle.fontFamily;
      overlay.style.letterSpacing = rootStyle.letterSpacing;
      overlay.style.direction = rootStyle.direction;
    }
    if (rowEl) {
      const rowRect = rowEl.getBoundingClientRect();
      overlay.style.width = `${rowRect.width}px`;
      overlay.style.height = `${rowRect.height}px`;
      const clone = rowEl.cloneNode(true);
      clone.removeAttribute('data-gantt-row-id');
      clone.classList.remove('border-b');
      clone.style.height = '100%';
      overlay.appendChild(clone);
    }
    document.body.appendChild(overlay);
    const grabRect = rowEl?.getBoundingClientRect();
    const grabDY = grabRect ? e.clientY - grabRect.top : 8;
    const lockedX = grabRect?.left ?? pane.getBoundingClientRect().left;
    const paneRect = pane.getBoundingClientRect();
    const rowH = grabRect?.height ?? 40;
    const rects = rowEls.map((el) => el.getBoundingClientRect());
    const place = (y) => {
      const top = Math.min(
        Math.max(y - grabDY, paneRect.top),
        paneRect.bottom - rowH
      );
      overlay.style.left = `${lockedX}px`;
      overlay.style.top = `${top}px`;
    };
    place(e.clientY);
    const propose = (boundary) => {
      const below = rows2[boundary];
      const parentId =
        below?.parentId ?? rows2[rows2.length - 1]?.parentId ?? null;
      let index = 0;
      for (let i = 0; i < boundary; i++) {
        if (
          rows2[i].parentId === parentId &&
          rows2[i].resource.id !== dragRow.resource.id
        ) {
          index++;
        }
      }
      const next = reorderResources(
        settings2.resources,
        dragRow.resource.id,
        parentId,
        index
      );
      const proposal = next
        ? {
            resourceId: dragRow.resource.id,
            parentId,
            index,
            resources: next
          }
        : null;
      const valid =
        !!proposal && (settings2.canReorderResource?.(proposal) ?? true);
      const top =
        boundary < rects.length
          ? rects[boundary].top - paneRect.top
          : (rects[rects.length - 1]?.bottom ?? paneRect.top) - paneRect.top;
      return { resourceId: dragRow.resource.id, top, valid, proposal };
    };
    const onMove = (ev) => {
      if (ev.pointerId !== pointerId) return;
      place(ev.clientY);
      let boundary = rects.length;
      for (let i = 0; i < rects.length; i++) {
        if (ev.clientY < rects[i].top + rects[i].height / 2) {
          boundary = i;
          break;
        }
      }
      if (boundary === lastBoundary) return;
      lastBoundary = boundary;
      const nextState = propose(boundary);
      if (
        current &&
        current.top === nextState.top &&
        current.valid === nextState.valid
      ) {
        return;
      }
      current = nextState;
      document.body.style.cursor = nextState.valid ? 'grabbing' : 'not-allowed';
      setReorder(nextState);
    };
    let finished = false;
    let unregister = () => {};
    const finish = (commit) => {
      if (finished) return;
      finished = true;
      unregister();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancelEvent);
      window.removeEventListener('keydown', onKey);
      overlay.remove();
      Object.assign(document.body.style, previous);
      if (commit && current?.proposal && !current.valid) {
        settings2.onResourceReorderReject?.(current.proposal);
      } else if (commit && current?.valid && current.proposal) {
        settings2.onResourceReorder?.(current.proposal);
        const announcer = pane
          .closest('[data-slot=gantt]')
          ?.querySelector('[data-slot=gantt-announcer]');
        if (announcer) {
          announcer.textContent = `${dragRow.resource.title}: ${settings2.i18n.labels.reorder}`;
        }
      }
      setReorder(null);
    };
    const onUp = (ev) => {
      if (ev.pointerId !== pointerId) return;
      finish(true);
    };
    const onCancelEvent = (ev) => {
      if (ev.pointerId !== pointerId) return;
      finish(false);
    };
    const onKey = (ev) => {
      if (ev.key === 'Escape') finish(false);
    };
    unregister = registerGanttGestureCancel(() => finish(false));
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancelEvent);
    window.addEventListener('keydown', onKey);
  }, [treePaneRef, treeRowsRef]);
  return { reorder, reorderEnabled, beginRowReorder };
}
export { useGanttRowReorder };
