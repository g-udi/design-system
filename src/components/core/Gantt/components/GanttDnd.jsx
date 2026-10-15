'use client';
import { useCallback, useEffect } from 'react';
import { useGantt, useGanttViewConfig } from '../Gantt.jsx';
import { resolveScheduleMode } from '../ganttConfig.js';
import { cancelActiveGanttGestures, GANTT_ACTIVATION, markGestureEnd, registerGanttGestureCancel } from '../ganttGestures.js';
import {
  findResource,
  snapMinutes,
  toZoned,
  zonedStartOfDay
} from '../ganttModel.jsx';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { snapToPixel } from '../../shared/pointerDrag.js';
function surfaceMinutesAt(tl, x) {
  const clamped = Math.min(Math.max(x, tl.rect.left), tl.rect.right);
  const traveled = tl.isRtl ? tl.rect.right - clamped : clamped - tl.rect.left;
  return (traveled / tl.rect.width) * ((tl.rangeEnd - tl.rangeStart) / 6e4);
}
function useGanttGestureTeardown() {
  useEffect(() => cancelActiveGanttGestures, []);
}
function collectSurface(root) {
  if (!root) return null;
  const axis = root.querySelector('[data-gantt-axis]');
  if (!axis) return null;
  return {
    rect: axis.getBoundingClientRect(),
    rangeStart: Number(axis.dataset.ganttRangeStart),
    rangeEnd: Number(axis.dataset.ganttRangeEnd),
    snapMin: Number(axis.dataset.ganttSnap) || 15,
    isRtl: getComputedStyle(axis).direction === 'rtl',
    rows: [...root.querySelectorAll('[data-gantt-row]')]
      .filter((row) => row.dataset.ganttRowStatic === void 0)
      .map((row) => ({
        resourceId: row.dataset.ganttResource ?? '',
        rect: row.getBoundingClientRect()
      }))
  };
}
function beginGesture(config) {
  const {
    instance,
    kind,
    origin,
    startEvent,
    segment,
    customMoveOverlay,
    customResizeOverlay
  } = config;
  const { settings, internals, api } = instance;
  const activation = { ...GANTT_ACTIVATION, ...settings.activation };
  const startX = startEvent.clientX;
  const startY = startEvent.clientY;
  const pointerId = startEvent.pointerId;
  const viewRoot = origin.closest('[data-slot=gantt-view]');
  const ganttRoot = origin.closest('[data-slot=gantt]');
  const announcer = ganttRoot?.querySelector('[data-slot=gantt-announcer]');
  const adoptRootTypography = (el) => {
    if (!ganttRoot) return;
    const rootStyle = getComputedStyle(ganttRoot);
    el.style.fontSize = rootStyle.fontSize;
    el.style.lineHeight = rootStyle.lineHeight;
    el.style.fontFamily = rootStyle.fontFamily;
    el.style.letterSpacing = rootStyle.letterSpacing;
    el.style.direction = rootStyle.direction;
  };
  const isTouch = startEvent.pointerType === 'touch';
  let active = kind.startsWith('resize') && !isTouch;
  let surface = active ? collectSurface(viewRoot) : null;
  let lastProposalKey = '';
  let touchTimer = null;
  let lastPointer = startEvent;
  const occurrence = segment?.occurrence;
  const nodeId = occurrence?.event.resourceId;
  const nodeMode = resolveScheduleMode(
    nodeId === void 0 ? null : findResource(settings.resources, nodeId),
    config.scheduleMode
  );
  const overlapPolicy = nodeMode === 'single' ? 'reject' : settings.overlap;
  let neighbourCache = null;
  const getNeighbours = () => {
    if (neighbourCache) return neighbourCache;
    neighbourCache =
      !occurrence || nodeId === void 0 || overlapPolicy === 'allow'
        ? []
        : api
            .getOccurrences()
            .filter(
              (other) =>
                other.event.resourceId === nodeId &&
                other.key !== occurrence.key
            )
            .map((other) => ({
              start: other.start.getTime(),
              end: other.end.getTime()
            }));
    return neighbourCache;
  };
  const overlapsNeighbour = (start, end) =>
    getNeighbours().some(
      (other) => other.start < end.getTime() && other.end > start.getTime()
    );
  const clampToNeighbours = (start, end) => {
    if (overlapPolicy !== 'clamp' || !occurrence) return { start, end };
    const anchorStart = occurrence.start.getTime();
    const anchorEnd = occurrence.end.getTime();
    let floor = -Infinity;
    let ceiling = Infinity;
    for (const other of getNeighbours()) {
      if (other.end <= anchorStart) floor = Math.max(floor, other.end);
      else if (other.start >= anchorEnd)
        ceiling = Math.min(ceiling, other.start);
    }
    if (floor === -Infinity && ceiling === Infinity) return { start, end };
    let from = start.getTime();
    let to = end.getTime();
    if (kind === 'resize-start') {
      from = Math.min(Math.max(from, floor), to);
    } else if (kind === 'resize-end') {
      to = Math.max(Math.min(to, ceiling), from);
    } else {
      const duration = to - from;
      if (from < floor) {
        from = floor;
        to = from + duration;
      }
      if (to > ceiling) {
        to = ceiling;
        from = to - duration;
      }
      if (from < floor) {
        from = floor;
        to = from + duration;
      }
    }
    return { start: new Date(from), end: new Date(to) };
  };
  let overlapRejected = false;
  let grabOffsetMin = 0;
  let overlay = null;
  let grabOffsetPx = 0;
  let barTop = 0;
  let barWidth = 0;
  let barHeight = 0;
  const createMoveOverlay = () => {
    if (kind !== 'move' || !occurrence || overlay || barWidth === 0) return;
    if (customMoveOverlay) return;
    const color = occurrence.event.color ?? 'var(--ds-color-accent)';
    overlay = document.createElement('div');
    overlay.setAttribute('data-slot', 'gantt-drag-overlay');
    overlay.className = // physical left-0 anchor: the clone is positioned by translate3d from
      // raw clientX, which is physical - a logical start-0 anchor would pin
      // it to the RIGHT edge in RTL and fling the clone off screen
      'pointer-events-none fixed top-0 left-0 z-100 flex items-center gap-2 will-change-transform';
    adoptRootTypography(overlay);
    overlay.style.height = `${barHeight}px`;
    const barEl = document.createElement('div');
    if (occurrence.end.getTime() === occurrence.start.getTime()) {
      barEl.className = 'flex shrink-0 items-center justify-center';
      barEl.style.width = `${barWidth}px`;
      barEl.style.height = '100%';
      const diamond = document.createElement('span');
      diamond.className = 'rotate-45 rounded-sm shadow-lg';
      diamond.style.width = '10px';
      diamond.style.height = '10px';
      diamond.style.background = `color-mix(in oklab, ${color} 80%, var(--ds-color-surface))`;
      diamond.style.border = `1px solid ${color}`;
      barEl.appendChild(diamond);
    } else {
      barEl.className = 'shrink-0 rounded-sm shadow-lg';
      barEl.style.width = `${barWidth}px`;
      barEl.style.height = '100%';
      barEl.style.background = `color-mix(in oklab, ${color} 22%, var(--ds-color-surface))`;
      barEl.style.outline = `1px solid color-mix(in oklab, ${color} 55%, transparent)`;
    }
    overlay.appendChild(barEl);
    const label = document.createElement('span');
    label.className =
      'text-ui-foreground truncate font-medium whitespace-nowrap';
    label.textContent = occurrence.event.title;
    overlay.appendChild(label);
    document.body.appendChild(overlay);
    positionOverlay(lastPointer);
  };
  const positionOverlay = (e) => {
    if (!overlay && customMoveOverlay && active && kind === 'move') {
      overlay = document.querySelector(
        '[data-slot=gantt-drag-overlay][data-custom]'
      );
      if (overlay) overlay.style.visibility = 'visible';
    }
    if (!overlay) return;
    overlay.style.transform = `translate3d(${snapToPixel(e.clientX - grabOffsetPx)}px, ${snapToPixel(barTop)}px, 0)`;
  };
  let resizeOverlay = null;
  let resizeLine = null;
  let resizeRange = null;
  let resizeDot = null;
  let resizeDuration = null;
  const positionResizeOverlay = (e) => {
    if (!resizeOverlay && customResizeOverlay && kind.startsWith('resize')) {
      resizeOverlay = document.querySelector(
        '[data-slot=gantt-resize-indicator][data-custom]'
      );
      if (resizeOverlay) resizeOverlay.style.visibility = 'visible';
    }
    if (!resizeOverlay || !surface) return;
    const x = Math.min(
      Math.max(e.clientX, surface.rect.left),
      surface.rect.right
    );
    resizeOverlay.style.transform = `translate3d(${snapToPixel(x)}px, ${snapToPixel(barTop)}px, 0)`;
  };
  const createResizeOverlay = () => {
    if (!kind.startsWith('resize') || !occurrence || resizeOverlay) return;
    const barEl = origin.closest('[data-slot=gantt-bar]');
    const rect = (barEl ?? origin).getBoundingClientRect();
    barTop = rect.top;
    barHeight = rect.height;
    if (customResizeOverlay) return;
    const color = occurrence.event.color ?? 'var(--ds-color-accent)';
    resizeOverlay = document.createElement('div');
    resizeOverlay.setAttribute('data-slot', 'gantt-resize-indicator');
    resizeOverlay.className = // physical left-0 anchor, same reason as the move clone above
      'pointer-events-none fixed top-0 left-0 z-100 will-change-transform';
    adoptRootTypography(resizeOverlay);
    resizeOverlay.style.height = `${barHeight}px`;
    resizeLine = document.createElement('div');
    resizeLine.className = 'h-full w-0.5 -translate-x-1/2 rounded-control';
    resizeLine.style.background = color;
    resizeOverlay.appendChild(resizeLine);
    const chip = document.createElement('div');
    chip.className = // physical left-0: centered with a physical translate on a physical anchor
      // no text size of its own: it inherits the root scale adopted above, so
      // the chip tracks a consumer rescale instead of pinning itself to 12px
      'bg-ui-foreground text-ui-background absolute bottom-full left-0 mb-1.5 flex -translate-x-1/2 items-center gap-1.5 rounded-md px-2 py-1 font-medium whitespace-nowrap';
    resizeRange = document.createElement('span');
    chip.appendChild(resizeRange);
    resizeDot = document.createElement('span');
    resizeDot.className = 'bg-ui-background/40 size-1 shrink-0 rounded-full';
    resizeDot.setAttribute('aria-hidden', 'true');
    chip.appendChild(resizeDot);
    resizeDuration = document.createElement('span');
    chip.appendChild(resizeDuration);
    const chipArrow = document.createElement('span');
    chipArrow.setAttribute('aria-hidden', 'true');
    chipArrow.className =
      'bg-ui-foreground absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-sm';
    chip.appendChild(chipArrow);
    resizeOverlay.appendChild(chip);
    document.body.appendChild(resizeOverlay);
    resizeRange.textContent = settings.i18n.functions.formatEventTime(
      toZoned(occurrence.start, settings.timeZone),
      toZoned(occurrence.end, settings.timeZone),
      occurrence.allDay ?? false,
      settings.locale
    );
    const days = Math.round(
      (occurrence.end.getTime() - occurrence.start.getTime()) / 864e5
    );
    if (days >= 1) {
      resizeDuration.textContent = settings.i18n.labels.durationDays(days);
    } else {
      resizeDot.style.display = 'none';
      resizeDuration.style.display = 'none';
    }
    positionResizeOverlay(startEvent);
  };
  if (active) createResizeOverlay();
  const activationDistance =
    kind === 'create' ? activation.createDistancePx : activation.moveDistancePx;
  const gestureCursor = kind.startsWith('resize') ? 'ew-resize' : 'grabbing';
  const setBodyDragging = (on, invalid = false) => {
    document.body.classList.toggle('gantt-dragging', on);
    document.body.style.cursor = on
      ? invalid
        ? 'not-allowed'
        : gestureCursor
      : '';
    document.body.style.userSelect = on ? 'none' : '';
    if (!on) document.body.style.removeProperty('-webkit-user-select');
  };
  const activate = () => {
    if (active) return;
    active = true;
    surface = collectSurface(viewRoot);
    createResizeOverlay();
    if (kind === 'move' && occurrence && surface) {
      const pointerMin = surfaceMinutesAt(surface, startX);
      const occStartMin =
        (occurrence.start.getTime() - surface.rangeStart) / 6e4;
      grabOffsetMin = pointerMin - occStartMin;
      const rect = origin.getBoundingClientRect();
      barTop = rect.top;
      barWidth = rect.width;
      barHeight = rect.height;
      grabOffsetPx = startX - rect.left;
      createMoveOverlay();
    }
    setBodyDragging(true);
  };
  const computeProposal = (e) => {
    if (!surface) return null;
    const tl = surface;
    const rangeMinutes = (tl.rangeEnd - tl.rangeStart) / 6e4;
    const minutesAt = (x) => surfaceMinutesAt(tl, x);
    const snapMin = (minutes) => {
      if (tl.snapMin < 24 * 60) return snapMinutes(minutes, tl.snapMin);
      const ms = tl.rangeStart + minutes * 6e4;
      const dayStart = zonedStartOfDay(new Date(ms), settings.timeZone);
      const dayEnd = zonedStartOfDay(
        addDays(toZoned(new Date(ms), settings.timeZone), 1),
        settings.timeZone
      );
      const snapped =
        ms - dayStart.getTime() < dayEnd.getTime() - ms ? dayStart : dayEnd;
      return (snapped.getTime() - tl.rangeStart) / 6e4;
    };
    const rowAt = (y) => {
      let best = tl.rows[0];
      for (const row of tl.rows) {
        if (y >= row.rect.top && y < row.rect.bottom) return row;
        if (
          best &&
          Math.abs(y - (row.rect.top + row.rect.height / 2)) <
            Math.abs(y - (best.rect.top + best.rect.height / 2))
        ) {
          best = row;
        }
      }
      return best;
    };
    const at = (minutes) => new Date(tl.rangeStart + minutes * 6e4);
    if (kind === 'create') {
      const anchorMin = snapMin(minutesAt(startX));
      const curMin = snapMin(minutesAt(e.clientX));
      const lo = Math.min(anchorMin, curMin);
      const hi = Math.max(
        anchorMin,
        curMin,
        lo + Math.max(tl.snapMin, settings.slotDuration)
      );
      return {
        start: at(lo),
        end: at(hi),
        allDay: false,
        resourceId: rowAt(startY)?.resourceId
      };
    }
    if (!occurrence) return null;
    const midnightAligned = (d) =>
      zonedStartOfDay(d, settings.timeZone).getTime() === d.getTime();
    if (kind === 'move') {
      const start = at(snapMin(minutesAt(e.clientX) - grabOffsetMin));
      let end;
      if (occurrence.end.getTime() === occurrence.start.getTime()) {
        end = start;
      } else if (
        tl.snapMin >= 24 * 60 &&
        (occurrence.allDay ||
          (midnightAligned(occurrence.start) &&
            midnightAligned(occurrence.end)))
      ) {
        const daySpan = Math.max(
          differenceInCalendarDays(
            toZoned(occurrence.end, settings.timeZone),
            toZoned(occurrence.start, settings.timeZone)
          ),
          1
        );
        end = zonedStartOfDay(
          addDays(toZoned(start, settings.timeZone), daySpan),
          settings.timeZone
        );
      } else {
        end = new Date(
          start.getTime() +
            (occurrence.end.getTime() - occurrence.start.getTime())
        );
      }
      const bounded2 = clampToNeighbours(start, end);
      return {
        start: bounded2.start,
        end: bounded2.end,
        allDay: occurrence.allDay,
        resourceId: occurrence.event.resourceId
      };
    }
    const min = snapMin(minutesAt(e.clientX));
    if (kind === 'resize-start') {
      const endMin = (occurrence.end.getTime() - tl.rangeStart) / 6e4;
      const maxStartMin =
        tl.snapMin >= 24 * 60
          ? (zonedStartOfDay(
              midnightAligned(occurrence.end)
                ? addDays(toZoned(occurrence.end, settings.timeZone), -1)
                : occurrence.end,
              settings.timeZone
            ).getTime() -
              tl.rangeStart) /
            6e4
          : endMin - tl.snapMin;
      const clamped2 = Math.min(Math.max(min, 0), maxStartMin);
      const bounded2 = clampToNeighbours(at(clamped2), occurrence.end);
      return {
        start: bounded2.start,
        end: bounded2.end,
        allDay: occurrence.allDay,
        resourceId: occurrence.event.resourceId
      };
    }
    const startMin = (occurrence.start.getTime() - tl.rangeStart) / 6e4;
    const minEndMin =
      tl.snapMin >= 24 * 60
        ? (zonedStartOfDay(
            addDays(toZoned(occurrence.start, settings.timeZone), 1),
            settings.timeZone
          ).getTime() -
            tl.rangeStart) /
          6e4
        : startMin + tl.snapMin;
    const clamped = Math.max(Math.min(min, rangeMinutes), minEndMin);
    const bounded = clampToNeighbours(occurrence.start, at(clamped));
    return {
      start: bounded.start,
      end: bounded.end,
      allDay: occurrence.allDay,
      resourceId: occurrence.event.resourceId
    };
  };
  const applyProposal = (e) => {
    const proposal = computeProposal(e);
    if (!proposal) return;
    const key = `${proposal.start.getTime()}-${proposal.end.getTime()}-${proposal.allDay}-${proposal.resourceId ?? ''}`;
    if (key === lastProposalKey) return;
    lastProposalKey = key;
    if (kind === 'create') {
      const draft = { ...proposal };
      if (!instance.getState().interactions.selectSlot ||
          !(instance.settings.canSelectSlot?.(draft) ?? true)) {
        internals.setSlotDraft(null);
        return;
      }
      internals.setSlotDraft(draft);
      return;
    }
    const update = {
      event: occurrence.event,
      occurrence,
      ...proposal,
      source: kind === 'move' ? 'drag' : kind
    };
    overlapRejected =
      overlapPolicy === 'reject' &&
      overlapsNeighbour(proposal.start, proposal.end);
    const valid =
      !overlapRejected &&
      (settings.canDropEvent ? settings.canDropEvent(update) : true);
    if (resizeRange && resizeDot && resizeDuration) {
      resizeRange.textContent = settings.i18n.functions.formatEventTime(
        toZoned(proposal.start, settings.timeZone),
        toZoned(proposal.end, settings.timeZone),
        proposal.allDay,
        settings.locale
      );
      const days = Math.round(
        (proposal.end.getTime() - proposal.start.getTime()) / 864e5
      );
      const showDays = days >= 1;
      resizeDot.style.display = showDays ? '' : 'none';
      resizeDuration.style.display = showDays ? '' : 'none';
      if (showDays) {
        resizeDuration.textContent = settings.i18n.labels.durationDays(days);
      }
    }
    if (resizeLine) {
      resizeLine.style.background = valid
        ? (occurrence.event.color ?? 'var(--ds-color-accent)')
        : 'var(--ds-color-danger)';
    }
    setBodyDragging(true, !valid);
    internals.setDrag({
      kind: kind === 'move' ? 'move' : kind,
      occurrence,
      proposedStart: proposal.start,
      proposedEnd: proposal.end,
      proposedAllDay: proposal.allDay,
      proposedResourceId: proposal.resourceId,
      valid
    });
  };
  const AUTO_SCROLL_EDGE_PX = 24;
  const AUTO_SCROLL_MAX_SPEED = 14;
  let autoScrollRaf = 0;
  const timelineViewport = viewRoot?.querySelector(
    '[data-slot=gantt-timeline-pane] [data-slot=scroll-area-viewport]'
  );
  const autoScrollTick = () => {
    autoScrollRaf = 0;
    if (finished || !active || !surface || !timelineViewport) return;
    const paneRect = timelineViewport.getBoundingClientRect();
    const x = lastPointer.clientX;
    let speed = 0;
    if (x < paneRect.left + AUTO_SCROLL_EDGE_PX) {
      speed =
        -((paneRect.left + AUTO_SCROLL_EDGE_PX - x) / AUTO_SCROLL_EDGE_PX) *
        AUTO_SCROLL_MAX_SPEED;
    } else if (x > paneRect.right - AUTO_SCROLL_EDGE_PX) {
      speed =
        ((x - (paneRect.right - AUTO_SCROLL_EDGE_PX)) / AUTO_SCROLL_EDGE_PX) *
        AUTO_SCROLL_MAX_SPEED;
    }
    if (speed === 0) return;
    const before = timelineViewport.scrollLeft;
    timelineViewport.scrollLeft = before + speed;
    if (timelineViewport.scrollLeft === before) return;
    const axis = viewRoot?.querySelector('[data-gantt-axis]');
    if (axis) surface.rect = axis.getBoundingClientRect();
    applyProposal(lastPointer);
    positionResizeOverlay(lastPointer);
    scheduleAutoScroll();
  };
  const scheduleAutoScroll = () => {
    if (!autoScrollRaf) autoScrollRaf = requestAnimationFrame(autoScrollTick);
  };
  let finished = false;
  let unregisterCancel;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    unregisterCancel?.();
    if (autoScrollRaf) cancelAnimationFrame(autoScrollRaf);
    try {
      origin.releasePointerCapture(pointerId);
    } catch {
      // Unsupported browser operation: retain the fallback below.
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('blur', onWindowBlur);
    window.removeEventListener('keydown', onKeyDown, true);
    if (touchTimer) clearTimeout(touchTimer);
    if (!customMoveOverlay) overlay?.remove();
    overlay = null;
    if (!customResizeOverlay) resizeOverlay?.remove();
    resizeOverlay = null;
    setBodyDragging(false);
  };
  const cancel = () => {
    cleanup();
    if (active) {
      markGestureEnd();
      internals.setDrag(null);
      internals.setSlotDraft(null);
    }
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      cancel();
    }
  };
  const onWindowBlur = () => cancel();
  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId) return;
    lastPointer = e;
    if (!active) {
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (isTouch) {
        if (distance > activation.touchTolerancePx) cancel();
        return;
      }
      if (distance < activationDistance) return;
      activate();
    }
    applyProposal(e);
    positionOverlay(e);
    positionResizeOverlay(e);
    scheduleAutoScroll();
  };
  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    cleanup();
    if (!active) return;
    markGestureEnd();
    const state = instance.getState();
    if (kind === 'create') {
      const draft = state.slotDraft;
      internals.setSlotDraft(null);
      if (draft && state.interactions.selectSlot &&
          (instance.settings.canSelectSlot?.(draft) ?? true)) {
        api.select({
          slot: { start: draft.start, end: draft.end, allDay: draft.allDay }
        });
        instance.settings.onSelectSlot?.(draft);
      }
      return;
    }
    const drag = state.drag;
    internals.setDrag(null);
    if (!drag || !occurrence) return;
    if (overlapRejected) return;
    if (settings.enforceCanDrop && !drag.valid) return;
    const unchanged =
      drag.proposedStart.getTime() === occurrence.start.getTime() &&
      drag.proposedEnd.getTime() === occurrence.end.getTime() &&
      (drag.proposedResourceId === void 0 ||
        drag.proposedResourceId === occurrence.event.resourceId);
    if (unchanged) return;
    const accepted = internals.applyProposedUpdate({
      event: occurrence.event,
      occurrence,
      start: drag.proposedStart,
      end: drag.proposedEnd,
      allDay: drag.proposedAllDay,
      resourceId: drag.proposedResourceId,
      source: kind === 'move' ? 'drag' : kind
    });
    if (accepted && announcer) {
      announcer.textContent = `${occurrence.event.title}, ${settings.i18n.functions.formatEventTime(
        toZoned(drag.proposedStart, settings.timeZone),
        toZoned(drag.proposedEnd, settings.timeZone),
        drag.proposedAllDay,
        settings.locale
      )}`;
    }
  };
  const onCancel = (e) => {
    if (e.pointerId !== pointerId) return;
    cancel();
  };
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onCancel);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('keydown', onKeyDown, true);
  unregisterCancel = registerGanttGestureCancel(cancel);
  try {
    origin.setPointerCapture(pointerId);
  } catch {
    // Unsupported browser operation: retain the fallback below.
  }
  if (isTouch && !active) {
    touchTimer = setTimeout(() => {
      activate();
      applyProposal(lastPointer);
    }, activation.touchDelayMs);
  }
}
function useGanttGestures() {
  const instance = useGantt();
  const viewConfig = useGanttViewConfig();
  const customMoveOverlay = !!viewConfig.renderDragPreview;
  const customResizeOverlay = !!viewConfig.renderResizeIndicator;
  const canDrag = useCallback(
    (segment) => {
      const { interactions } = instance.getState();
      const event = segment.occurrence.event;
      return interactions.drag && !event.readOnly && event.draggable !== false;
    },
    [instance]
  );
  const beginMove = useCallback(
    (e, segment) => {
      if (e.button !== 0 || !canDrag(segment)) return;
      beginGesture({
        instance,
        kind: 'move',
        origin: e.currentTarget,
        startEvent: e.nativeEvent,
        segment,
        customMoveOverlay,
        scheduleMode: viewConfig.scheduleMode
      });
    },
    [instance, canDrag, customMoveOverlay, viewConfig.scheduleMode]
  );
  const canResize = useCallback(
    (segment) => {
      const { interactions } = instance.getState();
      const event = segment.occurrence.event;
      return (
        interactions.resize &&
        !event.readOnly &&
        event.resizable !== false && // a milestone is an instant: it has no edges to resize
        segment.occurrence.end.getTime() > segment.occurrence.start.getTime()
      );
    },
    [instance]
  );
  const beginResize = useCallback(
    (e, segment, edge) => {
      if (e.button !== 0 || !canResize(segment)) return;
      e.stopPropagation();
      e.preventDefault();
      beginGesture({
        instance,
        kind: edge === 'start' ? 'resize-start' : 'resize-end',
        origin: e.currentTarget,
        startEvent: e.nativeEvent,
        segment,
        customResizeOverlay,
        scheduleMode: viewConfig.scheduleMode
      });
    },
    [instance, canResize, customResizeOverlay, viewConfig.scheduleMode]
  );
  const beginCreate = useCallback(
    (e) => {
      if (e.button !== 0) return;
      if (!instance.getState().interactions.selectSlot) return;
      beginGesture({
        instance,
        kind: 'create',
        origin: e.currentTarget,
        startEvent: e.nativeEvent
      });
    },
    [instance]
  );
  return { beginMove, beginResize, beginCreate, canDrag, canResize };
}
export {
  useGanttGestures,
  useGanttGestureTeardown
};
