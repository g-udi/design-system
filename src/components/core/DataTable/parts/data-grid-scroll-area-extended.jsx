// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDataGrid } from './data-grid-extended.jsx';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { cn } from '../../../../utilities/cn/index.js';
const MIN_THUMB_SIZE = 24;
const FALLBACK_SCROLLBAR_SIZE = 12;
const INITIAL_METRICS = {
  hasVerticalOverflow: false,
  headerHeight: 0,
  horizontalScrollbarSize: 0,
  thumbHeight: 0,
  thumbTop: 0,
  trackHeight: 0
};
const SCROLLBAR_CLASSNAME =
  'flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent';
const SCROLLBAR_THUMB_CLASSNAME = 'bg-ui-border rounded-control relative flex-1';
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function areMetricsEqual(next, prev) {
  return (
    next.hasVerticalOverflow === prev.hasVerticalOverflow &&
    next.headerHeight === prev.headerHeight &&
    next.horizontalScrollbarSize === prev.horizontalScrollbarSize &&
    next.thumbHeight === prev.thumbHeight &&
    next.thumbTop === prev.thumbTop &&
    next.trackHeight === prev.trackHeight
  );
}
function applyMetrics(element, metrics) {
  element.style.setProperty(
    '--data-grid-scrollbar-header-height',
    `${metrics.headerHeight}px`
  );
  element.style.setProperty(
    '--data-grid-scrollbar-thumb-height',
    `${metrics.thumbHeight}px`
  );
  element.style.setProperty(
    '--data-grid-scrollbar-thumb-top',
    `${metrics.thumbTop}px`
  );
  element.style.setProperty(
    '--data-grid-scrollbar-track-height',
    `${metrics.trackHeight}px`
  );
}
function DataGridScrollArea({
  children,
  className,
  orientation = 'both',
  ...props
}) {
  const { props: dataGridProps, table } = useDataGrid();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const metricsRef = useRef(INITIAL_METRICS);
  const observedElementsRef = useRef({
    header: null,
    horizontalScrollbar: null,
    table: null,
    tableViewport: null
  });
  const showHorizontal = orientation !== 'vertical';
  const showVertical = orientation !== 'horizontal';
  const usesCustomVerticalScrollbar =
    showVertical && !!dataGridProps.tableLayout?.headerSticky;
  const isColumnsPinnable = !!dataGridProps.tableLayout?.columnsPinnable;
  const scrollbarInsetStart = isColumnsPinnable ? table.getStartTotalSize() : 0;
  const scrollbarInsetEnd = isColumnsPinnable ? table.getEndTotalSize() : 0;
  const [hasCustomVerticalOverflow, setHasCustomVerticalOverflow] =
    useState(false);
  const clearDragState = useCallback(() => {
    dragRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }, []);
  const setOverlayRef = useCallback((node) => {
    overlayRef.current = node;
    if (node) applyMetrics(node, metricsRef.current);
  }, []);
  const resetMetrics = useCallback(() => {
    if (!areMetricsEqual(INITIAL_METRICS, metricsRef.current)) {
      metricsRef.current = INITIAL_METRICS;
      if (overlayRef.current) applyMetrics(overlayRef.current, INITIAL_METRICS);
    }
    setHasCustomVerticalOverflow((prev) => (prev ? false : prev));
  }, []);
  const syncCustomVerticalScrollbar = useCallback(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport || !usesCustomVerticalScrollbar) {
      resetMetrics();
      return;
    }
    const { header, horizontalScrollbar } = observedElementsRef.current;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const viewportHeight = viewport.clientHeight;
    const viewportWidth = viewport.clientWidth;
    const scrollHeight = viewport.scrollHeight;
    const scrollWidth = viewport.scrollWidth;
    const hasHorizontalOverflow =
      showHorizontal && scrollWidth > viewportWidth + 0.5;
    const horizontalScrollbarSize = hasHorizontalOverflow
      ? horizontalScrollbar?.offsetHeight || FALLBACK_SCROLLBAR_SIZE
      : 0;
    const trackHeight = Math.max(
      0,
      viewportHeight - headerHeight - horizontalScrollbarSize
    );
    const maxScroll = Math.max(0, scrollHeight - viewportHeight);
    let nextMetrics;
    if (trackHeight === 0 || maxScroll === 0) {
      nextMetrics = {
        hasVerticalOverflow: false,
        headerHeight,
        horizontalScrollbarSize,
        thumbHeight: trackHeight,
        thumbTop: 0,
        trackHeight
      };
    } else {
      const bodyContentHeight = Math.max(
        trackHeight,
        scrollHeight - headerHeight
      );
      const thumbHeight = clamp(
        trackHeight * (trackHeight / bodyContentHeight),
        MIN_THUMB_SIZE,
        trackHeight
      );
      const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
      const thumbTop =
        maxThumbTop > 0 ? (viewport.scrollTop / maxScroll) * maxThumbTop : 0;
      nextMetrics = {
        hasVerticalOverflow: true,
        headerHeight,
        horizontalScrollbarSize,
        thumbHeight,
        thumbTop,
        trackHeight
      };
    }
    if (!areMetricsEqual(nextMetrics, metricsRef.current)) {
      metricsRef.current = nextMetrics;
      if (overlayRef.current) applyMetrics(overlayRef.current, nextMetrics);
    }
    setHasCustomVerticalOverflow((prev) =>
      prev === nextMetrics.hasVerticalOverflow
        ? prev
        : nextMetrics.hasVerticalOverflow
    );
  }, [resetMetrics, showHorizontal, usesCustomVerticalScrollbar]);
  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;
    if (!usesCustomVerticalScrollbar) {
      resetMetrics();
      return;
    }
    let frame = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncCustomVerticalScrollbar);
    };
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(scheduleSync);
    const observed = /* @__PURE__ */ new Set();
    const observeElement = (element) => {
      if (element && observer && !observed.has(element)) {
        observer.observe(element);
        observed.add(element);
      }
    };
    const resolveObservedElements = () => {
      observedElementsRef.current = {
        header: container.querySelector('[data-slot="data-grid-table"] thead'),
        horizontalScrollbar: container.querySelector(
          '[data-slot="data-grid-scrollbar"][data-orientation="horizontal"]'
        ),
        table: container.querySelector('[data-slot="data-grid-table"]'),
        tableViewport: container.querySelector(
          '[data-slot="data-grid-table-viewport"]'
        )
      };
      observeElement(observedElementsRef.current.header);
      observeElement(observedElementsRef.current.table);
      observeElement(observedElementsRef.current.tableViewport);
      return !!(
        observedElementsRef.current.header && observedElementsRef.current.table
      );
    };
    observeElement(viewport);
    const resolvedOnMount = resolveObservedElements();
    scheduleSync();
    viewport.addEventListener('scroll', scheduleSync, { passive: true });
    let mutationObserver = null;
    if (!resolvedOnMount && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        if (resolveObservedElements()) {
          mutationObserver?.disconnect();
          mutationObserver = null;
          scheduleSync();
        }
      });
      mutationObserver.observe(container, { childList: true, subtree: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      mutationObserver?.disconnect();
      viewport.removeEventListener('scroll', scheduleSync);
      clearDragState();
    };
  }, [
    clearDragState,
    resetMetrics,
    syncCustomVerticalScrollbar,
    usesCustomVerticalScrollbar
  ]);
  const scrollToThumbOffset = (nextThumbTop) => {
    const viewport = viewportRef.current;
    const { thumbHeight, trackHeight } = metricsRef.current;
    if (!viewport) return;
    const maxScroll = Math.max(
      0,
      viewport.scrollHeight - viewport.clientHeight
    );
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    if (maxScroll === 0 || maxThumbTop === 0) {
      viewport.scrollTop = 0;
      return;
    }
    const ratio = clamp(nextThumbTop, 0, maxThumbTop) / maxThumbTop;
    viewport.scrollTop = ratio * maxScroll;
  };
  const handleThumbPointerDown = (event) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startScrollTop: viewport.scrollTop,
      startY: event.clientY
    };
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  };
  const handleThumbPointerMove = (event) => {
    const viewport = viewportRef.current;
    const dragState = dragRef.current;
    const { thumbHeight, trackHeight } = metricsRef.current;
    if (!viewport || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const maxScroll = Math.max(
      0,
      viewport.scrollHeight - viewport.clientHeight
    );
    if (maxThumbTop === 0 || maxScroll === 0) return;
    const deltaY = event.clientY - dragState.startY;
    const nextScrollTop =
      dragState.startScrollTop + (deltaY / maxThumbTop) * maxScroll;
    viewport.scrollTop = clamp(nextScrollTop, 0, maxScroll);
  };
  const handleThumbPointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    clearDragState();
  };
  const handleTrackPointerDown = (event) => {
    const { thumbHeight } = metricsRef.current;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - rect.top - thumbHeight / 2;
    scrollToThumbOffset(offsetY);
  };
  return (
    <div ref={containerRef} className='relative'>
      <ScrollAreaPrimitive.Root
        data-slot='data-grid-scroll-area'
        data-overflow-vertical={hasCustomVerticalOverflow ? 'true' : void 0}
        className={cn('relative', className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          data-slot='scroll-area-viewport'
          className='size-full'
        >
          <ScrollAreaPrimitive.Content data-slot='scroll-area-content'>
            {children}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>

        {showHorizontal && (
          <ScrollAreaPrimitive.Scrollbar
            data-slot='data-grid-scrollbar'
            data-orientation='horizontal'
            orientation='horizontal'
            className={SCROLLBAR_CLASSNAME}
            style={
              scrollbarInsetStart > 0 || scrollbarInsetEnd > 0
                ? {
                    marginInlineStart: scrollbarInsetStart || void 0,
                    marginInlineEnd: scrollbarInsetEnd || void 0
                  }
                : void 0
            }
          >
            <ScrollAreaPrimitive.Thumb
              data-slot='data-grid-thumb'
              className={SCROLLBAR_THUMB_CLASSNAME}
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}

        {showVertical && !usesCustomVerticalScrollbar && (
          <ScrollAreaPrimitive.Scrollbar
            data-slot='data-grid-scrollbar'
            data-orientation='vertical'
            orientation='vertical'
            className={SCROLLBAR_CLASSNAME}
          >
            <ScrollAreaPrimitive.Thumb
              data-slot='data-grid-thumb'
              className={SCROLLBAR_THUMB_CLASSNAME}
            />
          </ScrollAreaPrimitive.Scrollbar>
        )}
      </ScrollAreaPrimitive.Root>

      {usesCustomVerticalScrollbar && hasCustomVerticalOverflow && (
        <div
          ref={setOverlayRef}
          aria-hidden='true'
          className='pointer-events-none absolute inset-e-0 top-(--data-grid-scrollbar-header-height) z-20 h-(--data-grid-scrollbar-track-height)'
        >
          <div
            className='pointer-events-auto relative h-full w-1.5 touch-none p-px'
            onPointerDown={handleTrackPointerDown}
          >
            <div
              className={cn(
                'bg-ui-border absolute end-px w-1.5',
                'top-(--data-grid-scrollbar-thumb-top) h-(--data-grid-scrollbar-thumb-height)',
                'rounded-control'
              )}
              onLostPointerCapture={clearDragState}
              onPointerCancel={handleThumbPointerUp}
              onPointerDown={handleThumbPointerDown}
              onPointerMove={handleThumbPointerMove}
              onPointerUp={handleThumbPointerUp}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export { DataGridScrollArea };
