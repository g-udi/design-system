'use client';

import { createContext, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../utilities/cn/index.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import { Skeleton } from './SkeletonPrimitives.jsx';

const MorphContext = createContext({ loading: false, reduced: true });

const STAGGER = 0.06;
const EASE = [ 0.2, 0, 0, 1 ];
const toLength = (value) => (typeof value === 'number' ? `${value}px` : value);

/**
 * A loading region whose placeholders grow into the real content block by block instead of being
 * swapped out. `label` names what is loading for screen readers; blocks are SkeletonMorphBlock.
 */
function SkeletonMorph({ loading, label, as: Component = 'div', className, children, ...props }) {
  const reduced = usePrefersReducedMotion();
  return (
    <Component data-slot='skeleton-morph' aria-busy={loading || undefined} className={className} {...props}>
      <span role='status' className='sr-only'>{loading ? label : ''}</span>
      <MorphContext.Provider value={{ loading, reduced }}>{children}</MorphContext.Provider>
    </Component>
  );
}

/** The placeholder a block shows while loading: one block, or text lines whose last line is shorter. */
function Placeholder({ width, height, lines, lineHeight, shape }) {
  if (lines) {
    return (
      <span className='grid' style={{ width: toLength(width) }}>
        {Array.from({ length: lines }, (_, line) => (
          <span key={line} className='flex items-center' style={{ height: toLength(lineHeight) }}>
            <Skeleton as='span' className='block h-3/5' style={{ width: line === lines - 1 && lines > 1 ? '60%' : '100%' }} />
          </span>
        ))}
      </span>
    );
  }
  return <Skeleton className={cn('block', shape === 'circle' && 'rounded-full')} style={{ width: toLength(width), height: toLength(height) }} />;
}

/**
 * One piece of content inside SkeletonMorph. While loading it shows a placeholder sized by `width`,
 * `height` or `lines` x `lineHeight`; when loading ends its box resizes to the content as the content
 * fades in, a step after the block before it. Children render only once loaded.
 */
function SkeletonMorphBlock({ width, height, lines, lineHeight = 20, shape, className, children, ...props }) {
  const { loading, reduced } = useContext(MorphContext);
  const ref = useRef(null);
  const [ order, setOrder ] = useState(0);
  const [ animating, setAnimating ] = useState(false);

  // Stagger by document order within the region, so blocks resolve top to bottom.
  useIsomorphicLayoutEffect(() => {
    const root = ref.current?.closest('[data-slot="skeleton-morph"]');
    if (root) setOrder([ ...root.querySelectorAll('[data-slot="skeleton-morph-block"]') ].indexOf(ref.current));
  }, []);

  const placeholder = <Placeholder width={width} height={height} lines={lines} lineHeight={lineHeight} shape={shape} />;
  if (reduced) {
    return <div ref={ref} data-slot='skeleton-morph-block' className={className} {...props}>{loading ? placeholder : children}</div>;
  }

  const timing = { duration: 0.35, ease: EASE, delay: loading ? 0 : order * STAGGER };
  return (
    <motion.div
      ref={ref}
      layout
      data-slot='skeleton-morph-block'
      // Clip only while the box resizes, so focus rings inside the content stay visible afterwards.
      className={cn('relative', animating && 'overflow-hidden', className)}
      style={shape === 'circle' ? { borderRadius: '50%' } : undefined}
      transition={{ layout: timing }}
      onLayoutAnimationStart={() => setAnimating(true)}
      onLayoutAnimationComplete={() => setAnimating(false)}
      {...props}
    >
      <AnimatePresence initial={false} mode='popLayout'>
        <motion.div
          key={loading ? 'placeholder' : 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: timing }}
          exit={{ opacity: 0, transition: { ...timing, duration: 0.2 } }}
        >
          {loading ? placeholder : children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export { SkeletonMorph, SkeletonMorphBlock };
