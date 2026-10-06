'use client';

import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';
import { ProgressRoot, ProgressRing } from '../Progress/index.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { observeResize } from '../../../utilities/observeResize.js';
import { cn } from '../../../utilities/cn/index.js';
import { useReadingProgress } from './useReadingProgress.js';

const ticks = Array.from({ length: 41 }, (_, index) => index);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Reading position for a document, scroll viewport, or a specific article inside it. */
export const ReadingIndicator = forwardRef(function ReadingIndicator({
  variant = 'bar', position = 'fixed', tone = 'accent', showValue = variant !== 'bar',
  label = 'Reading progress', targetRef, contentRef, value,
  draggable = false, dragBoundsRef, className, style, ...props
}, forwardedRef) {
  const progress = useReadingProgress({ targetRef, contentRef, value });
  const percent = Math.round(progress);
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const ref = useMergedRefs(rootRef, forwardedRef);
  const drag = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const canDrag = draggable && variant === 'ring' && position !== 'inline';
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const hintId = useId();
  const updateBounds = () => {
    if (!canDrag || !rootRef.current) { x.set(0); y.set(0); return; }
    const box = rootRef.current.getBoundingClientRect();
    const area = dragBoundsRef?.current?.getBoundingClientRect() ?? { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    const origin = { left: box.left - x.get(), top: box.top - y.get() };
    const next = {
      left: area.left - origin.left, right: Math.max(area.left, area.right - box.width) - origin.left,
      top: area.top - origin.top, bottom: Math.max(area.top, area.bottom - box.height) - origin.top
    };
    setBounds(previous => Object.keys(next).every(key => previous[key] === next[key]) ? previous : next);
    x.set(clamp(x.get(), next.left, next.right));
    y.set(clamp(y.get(), next.top, next.bottom));
  };
  useIsomorphicLayoutEffect(updateBounds);
  const updateBoundsRef = useLatestRef(updateBounds);
  useEffect(() => {
    if (!canDrag || typeof ResizeObserver === 'undefined') return undefined;
    const observer = observeResize(() => updateBoundsRef.current());
    observer.observe(dragBoundsRef?.current ?? document.documentElement);
    return () => observer.disconnect();
  }, [canDrag, dragBoundsRef, updateBoundsRef]);
  useEventListener('resize', updateBounds, canDrag ? 'window' : null, { passive: true });
  const moveWithKeyboard = event => {
    const step = event.shiftKey ? 40 : 10;
    const changes = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault(); x.set(clamp(0, bounds.left, bounds.right)); y.set(clamp(0, bounds.top, bounds.bottom));
    } else if (changes[event.key]) {
      event.preventDefault();
      x.set(clamp(x.get() + changes[event.key][0], bounds.left, bounds.right));
      y.set(clamp(y.get() + changes[event.key][1], bounds.top, bounds.bottom));
    }
  };
  const number = showValue && (
    <span className='ds-reading-value' aria-hidden='true'>
      <motion.span key={percent} initial={reducedMotion ? false : { opacity: 0.5, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>{percent}</motion.span><span>%</span>
    </span>
  );
  const ariaLabel = props['aria-labelledby'] ? undefined : props['aria-label'] ?? label;
  const semantics = { 'aria-label': ariaLabel, 'aria-labelledby': props['aria-labelledby'], 'aria-valuetext': `${percent}%` };
  return (
    <motion.div
      {...props} ref={ref} className={cn('ds-reading-indicator', className)}
      data-slot='reading-indicator' data-variant={variant} data-position={position} data-tone={tone}
      data-draggable={canDrag || undefined} style={{ ...style, x, y }}
      drag={canDrag} dragControls={drag} dragListener={false} dragConstraints={bounds} dragElastic={0} dragMomentum={false}
    >
      {variant === 'bar' && <ProgressRoot value={progress} {...semantics} className='ds-reading-bar' />}
      {variant === 'ruler' && (
        <div role='progressbar' aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} {...semantics} className='ds-reading-ruler' data-slot='reading-ruler'>
          <svg viewBox='0 0 24 202' preserveAspectRatio='none' aria-hidden='true'>
            {ticks.map(tick => <line key={tick} x1='0' x2={tick % 10 === 0 ? 24 : 14} y1={tick * 5 + 1} y2={tick * 5 + 1} className={tick <= progress / 2.5 ? 'ds-reading-tick-complete' : 'ds-reading-tick'} />)}
          </svg>
          <div className='ds-reading-ruler-marker' style={{ top: `${progress}%` }} aria-hidden='true'><span className='ds-reading-needle' />{number}</div>
        </div>
      )}
      {variant === 'ring' && <ProgressRing value={progress} label={ariaLabel} aria-labelledby={props['aria-labelledby']} size='md' tone={tone} className='ds-reading-ring' />}
      {variant !== 'ruler' && number}
      {canDrag && <>
        <Button variant='ghost' size='icon-xs' className='ds-reading-handle' aria-label='Move reading indicator' aria-describedby={hintId} onPointerDown={event => drag.start(event)} onKeyDown={moveWithKeyboard}>
          <Icon name='GripVertical' size='sm' decorative />
        </Button>
        <span id={hintId} className='sr-only'>Drag to move. Arrow keys move by 10 pixels; hold Shift for 40. Home resets the position.</span>
      </>}
    </motion.div>
  );
});
