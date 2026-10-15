'use client';

import { cn } from '../../../utilities/cn';
import { BackgroundSurface, backgroundHeight } from '../backgroundRuntime.jsx';
import { bounded } from '../animationRuntime.js';
import { borealisFragment } from './borealisShader.js';

// Keep the page wrapper's direct children and layout contract intact. An explicit `mask` replaces the `fadeEdges` fade.
const Borealis = ({
  className, children, fadeEdges = true, paused = false, variant = 'aurora',
  amplitude = 1, blend = 0.5, speed = 1, intensity = 1, scale = 1,
  colors, background, transparent = false, mask, height, style, ref, ...props
}) => (
  <div {...props} ref={ref}
    className={cn('relative isolate flex min-h-dvh flex-col items-center justify-center transition-colors motion-reduce:transition-none', className)}
    style={{ ...(height !== undefined && { height: backgroundHeight(height), minHeight: 0 }), ...style }}>
    <BackgroundSurface effect="borealis" fragment={borealisFragment} aria-hidden="true"
      className="borealis" data-fade={String(mask === undefined && fadeEdges)} data-variant={variant === 'soft' ? 'soft' : 'aurora'}
      height="100%" paused={paused} speed={speed} intensity={intensity} scale={scale} colors={colors} background={background}
      transparent={transparent} mask={mask}
      uniforms={{ uSoft: variant === 'soft' ? 1 : 0, uAmplitude: bounded(amplitude, 1, 0, 2), uBlend: bounded(blend, 0.5, 0, 1) }} />
    {children}
  </div>
);

export default Borealis;
