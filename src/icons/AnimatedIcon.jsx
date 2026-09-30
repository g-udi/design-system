'use client';

import { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '../utilities/cn';
import { getIcon, iconColors, iconSizes } from './index';
import { animatedIconRegistry } from './animated/registry';
import { observeIconActivity } from './animated/observeIconActivity';

/** Opt-in artwork. Its button, link, or status owns activation and interaction. */
export const AnimatedIcon = forwardRef(function AnimatedIcon({
  active = false,
  className,
  color,
  decorative,
  label,
  name,
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}, forwardedRef) {
  const ref = useRef(null);
  const [canPlay, setCanPlay] = useState(false);
  useImperativeHandle(forwardedRef, () => ref.current);
  useEffect(() => {
    if (ref.current) return observeIconActivity(ref.current, setCanPlay);
  }, [name]);
  const Glyph = getIcon(name);
  const Paths = animatedIconRegistry[name];
  if (!Glyph) return null;
  const accessibleLabel = label || ariaLabel;
  const isDecorative = decorative ?? !accessibleLabel;
  const numericSize = typeof size === 'number';
  const shared = {
    ...props,
    className: cn('shrink-0 overflow-visible', !numericSize && (iconSizes[size] || iconSizes.md), color && iconColors[color], className),
    ...(numericSize ? { width: size, height: size } : {}),
    'aria-hidden': isDecorative ? true : undefined,
    'aria-label': isDecorative ? undefined : accessibleLabel,
    role: isDecorative ? undefined : 'img',
    focusable: 'false'
  };
  if (!Paths) return <Glyph ref={ref} {...shared} />;
  const playing = active && canPlay;
  return (
    <svg ref={ref} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
      fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'
      width={24} height={24} {...shared}
      data-animated-icon={name} data-animated-icon-active={playing ? 'true' : 'false'}>
      <Suspense fallback={<Glyph width={24} height={24} aria-hidden='true' />}>
        <g data-icon-artwork={name}><Paths active={playing} /></g>
      </Suspense>
    </svg>
  );
});

export { animatedIconRegistry, animatedIconMetadata } from './animated/registry';
