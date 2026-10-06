'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../../utilities/cn/index.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useMediaQuery } from '../../../hooks/environment/use-media-query.js';
import { usePageVisibility } from '../../../hooks/environment/use-page-visibility.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useEventListener } from '../../../hooks/interaction/use-event-listener.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import Icon from '../Icon/index.js';

const springs = {
  spring: { stiffness: 350, damping: 22, mass: .7 },
  lazy: { stiffness: 170, damping: 30, mass: .7 }
};
const nativeTarget = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-native]';
const interactiveTarget = 'a[href], button:not(:disabled), [role="button"], [data-pointer-label]';

/** A scoped decorative pointer: immediate position, optional spring follower, and native fallbacks. */
export const Pointer = forwardRef(function Pointer({
  children, variant = 'frame', tracking = 'lazy', tone = 'neutral', label = 'Explore',
  disabled = false, hideCursor = true, className,
  onPointerEnter, onPointerMove, onPointerLeave, onPointerDown, onPointerUp, onPointerCancel,
  ...props
}, forwardedRef) {
  const container = useRef(null);
  const ref = useMergedRefs(container, forwardedRef);
  const hasMouse = useMediaQuery('(any-hover: hover) and (any-pointer: fine)');
  const reducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisibility();
  const enabled = !disabled && hasMouse && !reducedMotion && pageVisible;
  const present = useRef(false);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState({ interactive: false, label: null });
  const [markRef, { width: markWidth, height: markHeight }] = useElementSize();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(0, springs[tracking] || springs.lazy);
  const followY = useSpring(0, springs[tracking] || springs.lazy);
  const visible = enabled && active;
  const labelPlacement = useCallback((localX, localY) => ({
    left: localX + markWidth + 14 > (container.current?.clientWidth ?? 0),
    above: localY + markHeight + 14 > (container.current?.clientHeight ?? 0)
  }), [markWidth, markHeight]);
  useIsomorphicLayoutEffect(() => {
    if (variant !== 'label') return;
    const placement = labelPlacement(x.get(), y.get());
    setHovered((previous) => previous.left === placement.left && previous.above === placement.above ? previous : { ...previous, ...placement });
  }, [variant, labelPlacement, x, y]);

  const hide = useCallback(() => {
    present.current = false;
    setActive(false);
    setPressed(false);
    followX.jump(x.get());
    followY.jump(y.get());
  }, [followX, followY, x, y]);

  useEffect(() => { if (!enabled) hide(); }, [enabled, hide]);
  useEventListener('blur', hide, enabled ? 'window' : null);
  useEventListener('scroll', hide, enabled ? 'window' : null, { capture: true, passive: true });
  useEventListener('keydown', hide, enabled ? 'window' : null);
  useEventListener('pointerup', () => setPressed(false), enabled ? 'window' : null);

  const move = (event) => {
    const root = container.current;
    const target = event.target;
    if (!enabled || event.pointerType !== 'mouse' || !root ||
        target.closest('[data-slot="pointer-follower"]') !== root || target.closest(nativeTarget)) {
      hide();
      return;
    }
    const bounds = root.getBoundingClientRect();
    // offset/client dimensions keep tracking aligned inside scaled previews and bordered containers.
    const scaleX = root.offsetWidth ? bounds.width / root.offsetWidth : 1;
    const scaleY = root.offsetHeight ? bounds.height / root.offsetHeight : 1;
    const localX = (event.clientX - bounds.left) / scaleX - root.clientLeft + root.scrollLeft;
    const localY = (event.clientY - bounds.top) / scaleY - root.clientTop + root.scrollTop;
    x.set(localX);
    y.set(localY);
    if (!present.current) {
      followX.jump(localX);
      followY.jump(localY);
      present.current = true;
      setActive(true);
    } else if (tracking !== 'direct') {
      followX.set(localX);
      followY.set(localY);
    }
    const interactive = target.closest(interactiveTarget);
    const next = {
      interactive: Boolean(interactive && interactive.getAttribute('aria-disabled') !== 'true'),
      label: target.closest('[data-pointer-label]')?.getAttribute('data-pointer-label') ?? null,
      ...(variant === 'label' ? labelPlacement(localX, localY) : {})
    };
    setHovered((previous) => previous.interactive === next.interactive && previous.label === next.label && previous.left === next.left && previous.above === next.above ? previous : next);
  };

  return (
    <div
      {...props} ref={ref} className={cn('ds-pointer-follower', className)}
      data-slot='pointer-follower' data-active={visible || undefined} data-hide-cursor={hideCursor || undefined}
      onPointerEnter={(event) => { onPointerEnter?.(event); if (!event.defaultPrevented) move(event); }}
      onPointerMove={(event) => { onPointerMove?.(event); if (!event.defaultPrevented) move(event); }}
      onPointerLeave={(event) => { onPointerLeave?.(event); hide(); }}
      onPointerDown={(event) => { onPointerDown?.(event); if (!event.defaultPrevented && present.current) setPressed(true); }}
      onPointerUp={(event) => { onPointerUp?.(event); setPressed(false); }}
      onPointerCancel={(event) => { onPointerCancel?.(event); hide(); }}
    >
      {children}
      <div className='ds-pointer-layer' aria-hidden='true' data-tone={tone}>
        {variant !== 'dot' && <motion.span className='ds-pointer-position' style={{ x, y }}><span className='ds-pointer-dot' /></motion.span>}
        <motion.span className='ds-pointer-position' data-slot='pointer-follower-position' style={{ x: tracking === 'direct' ? x : followX, y: tracking === 'direct' ? y : followY }}>
          <span ref={markRef} data-slot='pointer-follower-mark' className='ds-pointer-mark' data-variant={variant} data-hovering={hovered.interactive || undefined} data-pressed={pressed || undefined} data-left={hovered.left || undefined} data-above={hovered.above || undefined}>
            {variant === 'frame' && <Icon name='Scan' decorative strokeWidth={1.25} />}
            {variant === 'label' && <><span className='ds-pointer-label'>{hovered.label ?? label}</span><Icon name='ArrowUpRight' decorative className='size-3.5 shrink-0' /></>}
          </span>
        </motion.span>
      </div>
    </div>
  );
});
