import { forwardRef } from 'react';
import NextLink from 'next/link';

import { isExternalHref, normalizeHref } from '../../../utilities/href';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases } from '../Button/buttonTones.js';

// Semantic tones colour `inline` links; legacy hue names (blue, gray, red…) resolve through the Button aliases.
const inlineToneClasses = {
  accent: 'text-accent hover:text-accent-dark',
  attention: 'text-attention hover:text-attention/80',
  danger: 'text-danger hover:text-danger/80',
  discovery: 'text-discovery hover:text-discovery/80',
  info: 'text-info hover:text-info/80',
  neutral: 'text-text hover:text-accent',
  success: 'text-success hover:text-success/80',
  warning: 'text-warning hover:text-warning/80'
};
export const linkTones = Object.freeze(Object.keys(inlineToneClasses));
const toneClasses = {
  ...inlineToneClasses,
  ...Object.fromEntries(Object.entries(buttonToneAliases).map(([ alias, tone ]) => [ alias, inlineToneClasses[tone] ]))
};

export const linkVariants = createVariants({
  'base': 'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-subtle focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  'compoundVariants': Object.entries(toneClasses).map(([ tone, className ]) => ({ className, tone, 'variant': 'inline' })),
  'defaultVariants': {
    'tone': 'neutral',
    'variant': 'inline'
  },
  'variants': {
    'tone': Object.fromEntries(Object.keys(toneClasses).map((tone) => [ tone, '' ])),
    // `tone` colours `inline` only; the other variants carry a fixed colour of their own.
    'variant': {
      'bare': 'text-current',
      'inline': 'font-medium no-underline hover:no-underline',
      'muted': 'font-medium text-text-muted hover:text-text',
      'nav': 'font-semibold text-text hover:text-accent'
    }
  }
});

const CustomLink = forwardRef(function CustomLink({ children, className, href, prefetch = true, tone, variant, ...rest }, ref) {
  const safeHref = normalizeHref(href);
  const isInternalLink = typeof safeHref === 'string' && safeHref.startsWith('/');
  const classes = linkVariants({ className, tone, variant });

  if (!safeHref) return <span ref={ ref } className={ classes } { ...rest }>{children}</span>;

  if (typeof safeHref !== 'string' || isInternalLink) return <NextLink ref={ ref } href={ safeHref } prefetch={ prefetch } className={ classes } { ...rest }>{children}</NextLink>;

  // Fragments, mailto and relative URLs stay in the tab; external URLs open safely in a new one.
  const external = isExternalHref(safeHref);
  return <a ref={ ref } className={ classes } target={ external ? '_blank' : undefined } rel={ external ? 'noopener noreferrer' : undefined } href={ safeHref } { ...rest }>{children}</a>;
});

export default CustomLink;
