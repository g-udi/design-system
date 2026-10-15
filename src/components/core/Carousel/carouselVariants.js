import { createVariants } from '../../../utilities/variants/variants.js';

const radiusVariants = {
  'lg': 'rounded-lg',
  'md': 'rounded-md',
  'none': 'rounded-none',
  'sm': 'rounded-sm'
};

// Slides sit on artwork, so their surface and text use the theme-stable dark surface and inverse text.
const mediaSurface = 'relative isolate overflow-hidden border border-border bg-surface-dark text-text-inverse shadow-sm';

export const carouselVariants = createVariants({
  'base': 'relative w-full',
  'defaultVariants': {
    'size': 'md',
    'variant': 'standard'
  },
  'variants': {
    'size': {
      'lg': 'max-w-6xl',
      'md': 'max-w-5xl',
      'sm': 'max-w-3xl'
    },
    'variant': {
      'apple': '',
      'rail': '',
      'standard': ''
    }
  }
});

export const carouselSlideVariants = createVariants({
  'base': mediaSurface,
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': radiusVariants,
    'size': {
      'lg': 'min-h-[420px]',
      'md': 'min-h-[340px]',
      'sm': 'min-h-[260px]'
    }
  }
});

export const carouselCardVariants = createVariants({
  'base': `group flex ${mediaSurface} transition duration-200 focus-within:ring-2 focus-within:ring-text-subtle focus-within:ring-offset-2 focus-within:ring-offset-surface`,
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md'
  },
  'variants': {
    'radius': radiusVariants,
    'size': {
      'lg': 'min-h-[460px] w-[320px] md:w-[380px]',
      'md': 'min-h-[400px] w-[280px] md:w-[340px]',
      'sm': 'min-h-[320px] w-[240px] md:w-[280px]'
    }
  }
});
