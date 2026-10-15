'use client';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import { observeResize } from '../../../../utilities/observeResize.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGanttSelector } from '../Gantt.jsx';
import { useGanttGestureTeardown } from '../components/GanttDnd.jsx';
import { cancelActiveGanttGestures, markGestureEnd, registerGanttGestureCancel } from '../ganttGestures.js';
import { toZoned } from '../ganttModel.jsx';
import { format } from 'date-fns';
import { trackPoint, getPaneViewport, getScrollStart, setScrollStart } from '../ganttViewModel.js';
function useGanttViewport({
  minTimelineWidth,
  treeConfig,
  configuredTreeWidth,
  zoom,
  scale,
  rangeKey,
  rows,
  viewConfig,
  clampTree,
  setTreeWidth,
  instance,
  rangeStartMs,
  rangeEndMs,
  infiniteEdgePx,
  timeZone,
  clampZoom,
  setZoomValue,
  setIsPanning
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const clampContainer = (width, container) => {
    if (container <= 0) return width;
    const ceiling = container - minTimelineWidth - 1;
    const floor = Math.min(treeConfig.minWidth, Math.max(ceiling, 0));
    return Math.max(Math.min(width, ceiling), Math.min(floor, container - 1));
  };
  const clampedTreeWidth = clampContainer(configuredTreeWidth, containerWidth);
  const liveTreeWidthRef = useRef(null);
  useGanttGestureTeardown();
  useEffect(() => {
    cancelActiveGanttGestures();
  }, [zoom, scale, rangeKey, clampedTreeWidth, rows.length]);
  const [selectedRows, setSelectedRows] = useControllableState({ value: viewConfig.selectedRows, defaultValue: [], onChange: viewConfig.onSelectedRowsChange });
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const viewConfigRef = useRef(viewConfig);
  viewConfigRef.current = viewConfig;
  const toggleRowSelected = useCallback((id, checked) => {
    setSelectedRows((current) => checked
      ? [...current.filter((rowId) => rowId !== id), id]
      : current.filter((rowId) => rowId !== id));
  }, [setSelectedRows]);
  const bodyRef = useRef(null);
  const treePaneRef = useRef(null);
  const timelinePaneRef = useRef(null);
  const treeRowsRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const update = () => setContainerWidth(body.clientWidth);
    update();
    const observer = observeResize(update);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);
  const beginSplit = (e) => {
    if (e.button !== 0) return;
    cancelActiveGanttGestures();
    e.preventDefault();
    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startWidth = clampedTreeWidth;
    const splitter = e.currentTarget;
    const dir = getComputedStyle(splitter).direction === 'rtl' ? -1 : 1;
    splitter.setAttribute('data-resizing', '');
    const previous = { cursor: document.body.style.cursor, userSelect: document.body.style.userSelect };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    let liveWidth = startWidth;
    const onMove = (ev) => {
      if (ev.pointerId !== pointerId) return;
      liveWidth = clampContainer(
        clampTree(startWidth + (ev.clientX - startX) * dir),
        bodyRef.current?.clientWidth ?? 0
      );
      liveTreeWidthRef.current = liveWidth;
      if (treePaneRef.current) {
        treePaneRef.current.style.width = `${liveWidth}px`;
      }
    };
    let finished = false;
    let unregister = () => {};
    const finish = (commit) => {
      if (finished) return;
      finished = true;
      unregister();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('keydown', onKey);
      splitter.removeAttribute('data-resizing');
      Object.assign(document.body.style, previous);
      liveTreeWidthRef.current = null;
      if (commit && liveWidth !== startWidth) {
        setTreeWidth(liveWidth);
        viewConfigRef.current.treePanel?.onWidthChange?.(liveWidth);
      } else if (!commit && treePaneRef.current) {
        treePaneRef.current.style.width = `${startWidth}px`;
      }
    };
    const onUp = (event) => { if (event.pointerId === pointerId) finish(true); };
    const onCancel = (event) => { if (event.pointerId === pointerId) finish(false); };
    const onKey = (event) => { if (event.key === 'Escape') finish(false); };
    unregister = registerGanttGestureCancel(() => finish(false));
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('keydown', onKey);
  };
  useEffect(() => {
    const treeViewport = getPaneViewport(treePaneRef.current);
    const timelineViewport = getPaneViewport(timelinePaneRef.current);
    if (!treeViewport || !timelineViewport) return;
    const link = (source, target) => {
      let lastTop = source.scrollTop;
      const onScroll = () => {
        if (source.scrollTop === lastTop) return;
        lastTop = source.scrollTop;
        if (target.scrollTop !== source.scrollTop) {
          target.scrollTop = source.scrollTop;
        }
      };
      source.addEventListener('scroll', onScroll);
      return () => source.removeEventListener('scroll', onScroll);
    };
    const unlinkTree = link(treeViewport, timelineViewport);
    const unlinkTimeline = link(timelineViewport, treeViewport);
    let unforward = null;
    if (treeViewport.hasAttribute('data-gantt-native-scroll')) {
      const onWheel = (e) => {
        if (e.ctrlKey || e.metaKey) return;
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        timelineViewport.scrollTop += dy;
        e.preventDefault();
      };
      treeViewport.addEventListener('wheel', onWheel, { passive: false });
      unforward = () => treeViewport.removeEventListener('wheel', onWheel);
    } else {
      const onWheel = (e) => {
        if (e.ctrlKey || e.metaKey) return;
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const max =
          timelineViewport.scrollHeight - timelineViewport.clientHeight;
        if (max <= 0) return;
        const unit =
          e.deltaMode === 1
            ? 16
            : e.deltaMode === 2
              ? timelineViewport.clientHeight
              : 1;
        const next = Math.max(
          0,
          Math.min(max, timelineViewport.scrollTop + e.deltaY * unit)
        );
        e.preventDefault();
        timelineViewport.scrollTop = next;
        treeViewport.scrollTop = next;
      };
      treeViewport.addEventListener('wheel', onWheel, { passive: false });
      timelineViewport.addEventListener('wheel', onWheel, { passive: false });
      unforward = () => {
        treeViewport.removeEventListener('wheel', onWheel);
        timelineViewport.removeEventListener('wheel', onWheel);
      };
    }
    return () => {
      unlinkTree();
      unlinkTimeline();
      unforward?.();
    };
  }, [scale, viewConfig.scrollbars]);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let current = null;
    const apply = (id) => {
      if (id === current) return;
      if (current) {
        body
          .querySelectorAll(`[data-gantt-row-id="${CSS.escape(current)}"]`)
          .forEach((el) => el.removeAttribute('data-hover'));
      }
      if (id) {
        body
          .querySelectorAll(`[data-gantt-row-id="${CSS.escape(id)}"]`)
          .forEach((el) => el.setAttribute('data-hover', ''));
      }
      current = id;
    };
    const onOver = (e) => {
      const row = e.target?.closest?.('[data-gantt-row-id]');
      apply(row?.getAttribute('data-gantt-row-id') ?? null);
    };
    const onLeave = () => apply(null);
    body.addEventListener('pointerover', onOver);
    body.addEventListener('pointerleave', onLeave);
    return () => {
      body.removeEventListener('pointerover', onOver);
      body.removeEventListener('pointerleave', onLeave);
      apply(null);
    };
  }, []);
  const anchorMs = useGanttSelector((state) => state.date.getTime());
  const initialCenter =
    viewConfig.initialCenter instanceof Date
      ? viewConfig.initialCenter.getTime()
      : viewConfig.initialCenter;
  const manageRef = useRef({ key: '', buffered: false, userTook: false });
  useIsomorphicLayoutEffect(() => {
    const key = `${scale}:${anchorMs}:${viewConfig.scrollbars}`;
    if (manageRef.current.key !== key) {
      const slideContinuation =
        manageRef.current.userTook && instance.internals.didAnchorSlide();
      manageRef.current = slideContinuation
        ? { key, buffered: manageRef.current.buffered, userTook: true }
        : { key, buffered: false, userTook: false };
    }
    if (manageRef.current.userTook) return;
    let waiter = null;
    const run = () => {
      waiter?.disconnect();
      waiter = null;
      const viewport = getPaneViewport(timelinePaneRef.current);
      const axis = viewport?.querySelector('[data-gantt-axis]');
      if (!viewport || !axis) return;
      if (viewport.clientWidth === 0) {
        waiter = new ResizeObserver(() => {
          if (viewport.clientWidth > 0) run();
        });
        waiter.observe(viewport);
        return;
      }
      if (viewConfig.infiniteScroll && !manageRef.current.buffered) {
        manageRef.current.buffered = true;
        extendLockRef.current = true;
        instance.internals.extendRange('before');
        instance.internals.extendRange('after');
        return;
      }
      extendLockRef.current = false;
      if (viewport.scrollWidth <= viewport.clientWidth) return;
      const active = instance.getState().activeRange;
      let target;
      if (typeof initialCenter === 'number') {
        target = initialCenter;
      } else if (initialCenter === 'anchor') {
        target = anchorMs;
      } else {
        const nowMs = Date.now();
        target =
          nowMs >= active.start.getTime() && nowMs < active.end.getTime()
            ? nowMs
            : anchorMs;
      }
      const fraction = Math.min(
        Math.max((target - rangeStartMs) / (rangeEndMs - rangeStartMs), 0),
        1
      );
      setScrollStart(
        viewport,
        Math.max(0, fraction * viewport.scrollWidth - viewport.clientWidth / 2)
      );
    };
    run();
    return () => {
      waiter?.disconnect();
    };
  }, [
    scale,
    anchorMs,
    initialCenter,
    viewConfig.scrollbars,
    viewConfig.infiniteScroll,
    rangeKey,
    rangeStartMs,
    rangeEndMs,
    instance
  ]);
  const pendingRestoreRef = useRef(null);
  const extendLockRef = useRef(false);
  const lastUserScrollRef = useRef(0);
  const fineCenterRef = useRef(null);
  const lastZoomRef = useRef(null);
  useEffect(() => {
    const pane = timelinePaneRef.current;
    if (!pane) return;
    const markIntent = () => {
      lastUserScrollRef.current = performance.now();
    };
    const markWheelIntent = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      markIntent();
    };
    const onPointerDown = (e) => {
      const target = e.target;
      if (
        target?.closest(
          '[data-slot=scroll-area-scrollbar], [data-slot=gantt-timeline-header], [data-gantt-native-scroll]'
        )
      ) {
        markIntent();
      }
    };
    pane.addEventListener('wheel', markWheelIntent, { passive: true });
    pane.addEventListener('pointerdown', onPointerDown);
    pane.addEventListener('touchstart', markIntent, { passive: true });
    pane.addEventListener('keydown', markIntent);
    return () => {
      pane.removeEventListener('wheel', markWheelIntent);
      pane.removeEventListener('pointerdown', onPointerDown);
      pane.removeEventListener('touchstart', markIntent);
      pane.removeEventListener('keydown', markIntent);
    };
  }, []);
  useEffect(() => {
    if (!viewConfig.infiniteScroll) return;
    const viewport = getPaneViewport(timelinePaneRef.current);
    if (!viewport) return;
    const tryExtend = (direction) => {
      const axis = viewport.querySelector('[data-gantt-axis]');
      const liveStart = Number(axis?.dataset.ganttRangeStart);
      const liveEnd = Number(axis?.dataset.ganttRangeEnd);
      if (!axis || Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return;
      extendLockRef.current = true;
      manageRef.current.userTook = true;
      pendingRestoreRef.current = {
        ms:
          liveStart +
          (getScrollStart(viewport) / viewport.scrollWidth) *
            (liveEnd - liveStart),
        align: 'start'
      };
      if (!instance.internals.extendRange(direction)) {
        pendingRestoreRef.current = null;
        extendLockRef.current = false;
      }
    };
    const isRtl = getComputedStyle(viewport).direction === 'rtl';
    const onScroll = () => {
      if (extendLockRef.current) return;
      if (performance.now() - lastUserScrollRef.current > 1200) return;
      if (viewport.scrollWidth <= viewport.clientWidth + 8) return;
      const fromStart = getScrollStart(viewport);
      const fromEnd = viewport.scrollWidth - fromStart - viewport.clientWidth;
      const direction =
        fromStart < infiniteEdgePx
          ? 'before'
          : fromEnd < infiniteEdgePx
            ? 'after'
            : null;
      if (!direction) return;
      tryExtend(direction);
    };
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      if (extendLockRef.current || e.deltaX === 0) return;
      if (viewport.scrollWidth <= viewport.clientWidth + 8) return;
      const towardStart = isRtl ? e.deltaX > 0 : e.deltaX < 0;
      if (towardStart && getScrollStart(viewport) <= 0) {
        tryExtend('before');
      } else if (
        !towardStart &&
        getScrollStart(viewport) + viewport.clientWidth >=
          viewport.scrollWidth - 1
      ) {
        tryExtend('after');
      }
    };
    viewport.addEventListener('scroll', onScroll);
    viewport.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, [
    instance,
    viewConfig.infiniteScroll,
    scale,
    viewConfig.scrollbars,
    infiniteEdgePx
  ]);
  useEffect(() => {
    const viewport = getPaneViewport(timelinePaneRef.current);
    if (!viewport) return;
    const keyFmt =
      scale === 'day'
        ? 'yyyy-MM-dd'
        : scale === 'week'
          ? "RRRR-'W'II"
          : scale === 'month'
            ? 'yyyy-MM'
            : scale === 'quarter'
              ? 'yyyy-qqq'
              : 'yyyy';
    let raf = 0;
    let lastKey = '';
    const measure = () => {
      raf = 0;
      const axis = viewport.querySelector('[data-gantt-axis]');
      const liveStart = Number(axis?.dataset.ganttRangeStart);
      const liveEnd = Number(axis?.dataset.ganttRangeEnd);
      if (!axis || Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return;
      const fraction =
        (getScrollStart(viewport) + viewport.clientWidth / 2) /
        Math.max(1, viewport.scrollWidth);
      const centerMs = liveStart + fraction * (liveEnd - liveStart);
      fineCenterRef.current = centerMs;
      const center = new Date(centerMs);
      const key = format(toZoned(center, timeZone), keyFmt);
      if (key === lastKey) return;
      lastKey = key;
      instance.internals.setViewportCenter(center);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    viewport.addEventListener('scroll', schedule);
    schedule();
    return () => {
      viewport.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [instance, scale, timeZone, viewConfig.scrollbars, rangeKey]);
  useIsomorphicLayoutEffect(() => {
    if (
      lastZoomRef.current !== null &&
      lastZoomRef.current !== zoom &&
      !pendingRestoreRef.current &&
      fineCenterRef.current !== null
    ) {
      pendingRestoreRef.current = {
        ms: fineCenterRef.current,
        align: 'center'
      };
    }
    lastZoomRef.current = zoom;
    let raf = null;
    let attempts = 0;
    const seat = () => {
      raf = null;
      const viewport = getPaneViewport(timelinePaneRef.current);
      if (viewport && pendingRestoreRef.current) {
        if (viewport.clientWidth === 0 && attempts++ < 20) {
          raf = requestAnimationFrame(seat);
          return;
        }
        const { ms, align, offsetPx } = pendingRestoreRef.current;
        pendingRestoreRef.current = null;
        const fraction = Math.min(
          Math.max((ms - rangeStartMs) / (rangeEndMs - rangeStartMs), 0),
          1
        );
        const offset =
          offsetPx ?? (align === 'center' ? viewport.clientWidth / 2 : 0);
        setScrollStart(
          viewport,
          Math.max(0, fraction * viewport.scrollWidth - offset)
        );
      }
      extendLockRef.current = false;
    };
    seat();
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [
    rangeKey,
    zoom,
    rangeStartMs,
    rangeEndMs,
    scale,
    viewConfig.scrollbars,
    instance
  ]);
  const anchorZoomCenter = () => {
    const viewport = getPaneViewport(timelinePaneRef.current);
    const axis = viewport?.querySelector('[data-gantt-axis]');
    if (!viewport || !axis) return;
    const liveStart = Number(axis.dataset.ganttRangeStart);
    const liveEnd = Number(axis.dataset.ganttRangeEnd);
    if (Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return;
    pendingRestoreRef.current = {
      ms:
        liveStart +
        ((getScrollStart(viewport) + viewport.clientWidth / 2) /
          viewport.scrollWidth) *
          (liveEnd - liveStart),
      align: 'center'
    };
  };
  const anchorZoomPointer = (clientX) => {
    const viewport = getPaneViewport(timelinePaneRef.current);
    const axis = viewport?.querySelector('[data-gantt-axis]');
    if (!viewport || !axis) return;
    const liveStart = Number(axis.dataset.ganttRangeStart);
    const liveEnd = Number(axis.dataset.ganttRangeEnd);
    if (Number.isNaN(liveStart) || Number.isNaN(liveEnd)) return;
    const offsetPx = trackPoint(viewport, clientX).offset;
    pendingRestoreRef.current = {
      ms:
        liveStart +
        ((getScrollStart(viewport) + offsetPx) / viewport.scrollWidth) *
          (liveEnd - liveStart),
      align: 'start',
      offsetPx
    };
  };
  const wheelZoomRef = useRef(null);
  useEffect(() => {
    wheelZoomRef.current = (e) => {
      if (!viewConfig.wheelZoom) return;
      if (!e.ctrlKey && !e.metaKey) return;
      const lines = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const next = clampZoom(zoom * Math.exp(-e.deltaY * lines * 2e-3));
      if (Math.abs(next - zoom) < 1e-4) return;
      e.preventDefault();
      if (viewConfig.zoom === void 0) anchorZoomPointer(e.clientX);
      setZoomValue(+next.toFixed(4));
    };
  });
  useEffect(() => {
    const viewport = getPaneViewport(timelinePaneRef.current);
    if (!viewport) return;
    const onWheel = (e) => wheelZoomRef.current?.(e);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [viewConfig.scrollbars, scale]);
  const beginHeaderPan = (e) => {
    if (e.button !== 0) return;
    const viewport = getPaneViewport(timelinePaneRef.current);
    if (!viewport) return;
    cancelActiveGanttGestures();
    const previous = { cursor: document.body.style.cursor, userSelect: document.body.style.userSelect };
    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startLeft = viewport.scrollLeft;
    let active = false;
    const onMove = (ev) => {
      if (ev.pointerId !== pointerId) return;
      const dx = ev.clientX - startX;
      if (!active && Math.abs(dx) < 4) return;
      if (!active) {
        markGestureEnd();
        setIsPanning(true);
      }
      active = true;
      lastUserScrollRef.current = performance.now();
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      viewport.scrollLeft = startLeft - dx;
    };
    let finished = false;
    let unregister = () => {};
    const finish = (ev) => {
      if (ev && ev.pointerId !== pointerId) return;
      if (finished) return;
      finished = true;
      unregister();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('keydown', onKey);
      Object.assign(document.body.style, previous);
      if (active) setIsPanning(false);
    };
    const onKey = (event) => { if (event.key === 'Escape') finish(); };
    unregister = registerGanttGestureCancel(() => finish());
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
  };
  return { clampedTreeWidth, liveTreeWidthRef, selectedSet, toggleRowSelected, bodyRef, treePaneRef, timelinePaneRef, treeRowsRef, beginSplit, anchorZoomCenter, beginHeaderPan };
}
export { useGanttViewport };
