'use client';
import { useEffect, useRef } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { usePageVisibility } from '../../../hooks/environment/use-page-visibility.js';
import { useInView } from '../../../hooks/layout/use-in-view.js';
import { ScrollEdges } from './ScrollEdges.jsx';

/**
 * Eased mouse-wheel scrolling through Lenis for the element in `targetRef` (a ScrollArea viewport), or
 * for the page when it is omitted. Keyboard, focus, selection, touch and links stay native; reduced
 * motion, a hidden page or an offscreen area turn it off. The engine loads only when used.
 */
function SmoothScroll({ targetRef }) {
  const reducedMotion = usePrefersReducedMotion();
  const visible = usePageVisibility();
  const [observe, inView] = useInView({ initialInView: true });
  useEffect(() => { if (targetRef) observe(targetRef.current); }, [observe, targetRef]);
  useEffect(() => {
    const viewport = targetRef ? targetRef.current : null;
    if ((targetRef && !viewport) || reducedMotion || !visible || !inView) return;
    let cancelled = false;
    let engine;
    // Native keyboard, focus, selection and scrollbar gestures take over immediately.
    const interrupt = () => engine?.scrollTo(engine.actualScroll, { immediate: true });
    const root = viewport ? viewport.parentElement : document;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      engine = new Lenis({
        // Without a target Lenis drives the window; Radix owns the stable wrapper inside a viewport.
        ...(viewport ? { wrapper: viewport, content: viewport.firstElementChild } : {}),
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        virtualScroll: ({ event }) => !event.shiftKey,
        anchors: false
      });
      root.addEventListener('pointerdown', interrupt, true);
      root.addEventListener('keydown', interrupt, true);
      root.addEventListener('focusin', interrupt, true);
    }).catch(() => {
      // Native scrolling remains usable if the optional enhancement cannot load.
    });
    return () => {
      cancelled = true;
      root.removeEventListener('pointerdown', interrupt, true);
      root.removeEventListener('keydown', interrupt, true);
      root.removeEventListener('focusin', interrupt, true);
      engine?.destroy();
    };
  }, [inView, reducedMotion, targetRef, visible]);
  return null;
}

function ScrollArea({ className, children, smooth = false, fadeEdges = false, viewportRef, scrollbarClassName, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...props }) {
  const localViewport = useRef(null);
  const mergedViewportRef = useMergedRefs(localViewport, viewportRef);
  return (
    <ScrollAreaPrimitive.Root
      data-slot='scroll-area'
      className={cn('ds-part-scroll-area relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={mergedViewportRef}
        data-slot='scroll-area-viewport'
        tabIndex={0}
        role='region'
        aria-label={ariaLabel || (ariaLabelledby ? undefined : 'Scrollable content')}
        aria-labelledby={ariaLabelledby}
        className='ds-part-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ui-primary focus-visible:outline-1'
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar className={scrollbarClassName?.track} thumbClassName={scrollbarClassName?.thumb} />
      <ScrollAreaPrimitive.Corner />
      {smooth && <SmoothScroll targetRef={localViewport} />}
      {fadeEdges && <ScrollEdges targetRef={localViewport} />}
    </ScrollAreaPrimitive.Root>
  );
}
function ScrollBar({ className, thumbClassName, orientation = 'vertical', ...props }) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot='scroll-area-scrollbar'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'ds-part-scroll-area-scrollbar flex touch-none p-px transition-colors select-none',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot='scroll-area-thumb'
        className={cn('ds-part-scroll-area-thumb relative flex-1 bg-ui-border', thumbClassName)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
export { ScrollArea, ScrollBar, SmoothScroll };
