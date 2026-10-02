import { cn } from '../../../../utilities/cn/index.js';

/*
 * Text shimmer adapted from AI SDK Elements (MIT, Copyright (c) 2023 Vercel, Inc.), on Gaudi tokens.
 * The words stay real text, so they are read, translated and selectable; only a highlight band sweeps
 * across them. The `shimmer` utility (composition.css) holds still for reduced motion and forced colours.
 */

const textLength = (node) => {
  if (typeof node === 'string' || typeof node === 'number') return String(node).length;
  if (Array.isArray(node)) return node.reduce((total, child) => total + textLength(child), 0);
  return 0;
};

/**
 * A loading label such as "Thinking…" or "Searching the web…". `duration` is one sweep in seconds and
 * `spread` the band width per character in pixels; `active={false}` renders the same text at rest.
 */
function Shimmer({ as: Component = 'span', active = true, duration = 2, spread = 2, className, style, children, ...props }) {
  const band = Math.max(16, (textLength(children) || 12) * spread);
  return (
    <Component
      data-slot='shimmer'
      data-active={active ? '' : undefined}
      className={cn('ds-part-shimmer', active && 'shimmer', className)}
      style={active ? { '--ds-shimmer-duration': `${duration}s`, '--ds-shimmer-spread': `${band}px`, ...style } : style}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Shimmer };
