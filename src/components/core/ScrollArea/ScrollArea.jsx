'use client';
import { useEffect, useRef } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { usePageVisibility } from '../../../hooks/environment/use-page-visibility.js';
import { useInView } from '../../../hooks/layout/use-in-view.js';

// Keep the optional engine and its subscriptions out of ordinary ScrollAreas.
function SmoothScrolling({ viewportRef }) {
  const reducedMotion = usePrefersReducedMotion();
  const visible = usePageVisibility();
  const [observe, inView] = useInView({ initialInView: true });
  useEffect(() => { observe(viewportRef.current); }, [observe, viewportRef]);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || reducedMotion || !visible || !inView) return;
    let cancelled = false;
    let engine;
    // Native keyboard, focus, selection and scrollbar gestures take over immediately.
    const interrupt = () => engine?.scrollTo(engine.actualScroll, { immediate: true });
    const root = viewport.parentElement;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      engine = new Lenis({
        wrapper: viewport,
        // Radix owns this stable measurement wrapper around the supplied children.
        content: viewport.firstElementChild,
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
      // The native viewport remains usable if the optional enhancement cannot load.
    });
    return () => {
      cancelled = true;
      root.removeEventListener('pointerdown', interrupt, true);
      root.removeEventListener('keydown', interrupt, true);
      root.removeEventListener('focusin', interrupt, true);
      engine?.destroy();
    };
  }, [inView, reducedMotion, viewportRef, visible]);
  return null;
}

function ScrollArea({ className, children, smooth = false, viewportRef, scrollbarClassName, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...props }) {
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
      {smooth && <SmoothScrolling viewportRef={localViewport} />}
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
export { ScrollArea, ScrollBar };
