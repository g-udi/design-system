'use client';
import { forwardRef, useMemo } from 'react';
import { useAnimation, bounded } from '../animationRuntime.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useMousePosition } from '../../../hooks/interaction/use-mouse-position.js';
import { useHover } from '../../../hooks/interaction/use-hover.js';
import { useWarpTextCanvas } from './useWarpTextCanvas.js';
import { cn } from '../../../utilities/cn';

export const WarpText = forwardRef(function WarpText({
  text = 'Bend the moment', warpStrength = .08, warpScale = 1.7, speed = .55,
  pointerRadius = .42, pointerStrength = .38, refraction = .018, ripple = true,
  paused = false, className, onPointerEnter, onPointerLeave, ...props
}, forwardedRef) {
  const animation = useAnimation(paused, forwardedRef);
  const [sizeRef, size] = useElementSize();
  const pointer = useMousePosition({ enabled: animation.active });
  const { isHovered, hoverProps } = useHover({ disabled: !animation.active });
  const ref = useMergedRefs(animation.ref, sizeRef, pointer.ref);
  const options = useMemo(() => ({
    warpStrength: bounded(warpStrength, .08, 0, .25), warpScale: bounded(warpScale, 1.7, .5, 5), speed: bounded(speed, .55, 0, 3),
    pointerRadius: bounded(pointerRadius, .42, .1, 1), pointerStrength: bounded(pointerStrength, .38, 0, 1),
    refraction: bounded(refraction, .018, 0, .06), ripple
  }), [warpStrength, warpScale, speed, pointerRadius, pointerStrength, refraction, ripple]);
  const { canvas, ready } = useWarpTextCanvas({ root: animation.root, size, text, active: animation.active, pointer, hovered: isHovered, options });
  return <span {...props} ref={ref} className={cn('gaudi-warp-text', className)} data-slot="warp-text" data-ready={ready} data-animated={animation.active} data-hovered={isHovered}
    onPointerEnter={event => { onPointerEnter?.(event); if (!event.defaultPrevented) hoverProps.onPointerEnter(event); }}
    onPointerLeave={event => { onPointerLeave?.(event); hoverProps.onPointerLeave(event); }}>
    <span className="sr-only">{text}</span>
    <span className="gaudi-warp-text__fallback" aria-hidden="true">{text}</span>
    <canvas ref={canvas} aria-hidden="true" />
  </span>;
});
export default WarpText;
