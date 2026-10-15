import { createVariants } from '../../../utilities/variants/variants.js';

/*
 * The dark and translucent terminals scope the dark theme (`dark`), so every token inside, from the text to the
 * output tones, resolves to its dark value on the code surface whatever the page theme is.
 */
export const terminalVariants = createVariants({
  'base': 'overflow-hidden border border-border text-text shadow-sm',
  'defaultVariants': {
    'radius': 'lg',
    'size': 'md',
    'variant': 'dark'
  },
  'variants': {
    'radius': {
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'none': 'rounded-none',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'max-w-4xl text-sm',
      'md': 'max-w-3xl text-sm',
      'sm': 'max-w-2xl text-xs'
    },
    'variant': {
      'dark': 'dark bg-(--ds-color-code-block-bg)',
      'light': 'bg-surface',
      'translucent': 'dark bg-(--ds-color-code-block-bg)/90 backdrop-blur'
    }
  }
});

export const terminalBodyVariants = createVariants({
  'base': 'overflow-auto p-4 font-mono leading-6 [tab-size:2]',
  'defaultVariants': {
    'size': 'md'
  },
  'variants': {
    'size': {
      'lg': 'min-h-[22rem] max-h-[32rem] text-sm',
      'md': 'min-h-[18rem] max-h-[28rem] text-sm',
      'sm': 'min-h-[14rem] max-h-[22rem] text-xs'
    }
  }
});

export const terminalLineVariants = createVariants({
  'base': 'flex min-w-0 items-start gap-2 leading-6',
  'defaultVariants': {
    'tone': 'default'
  },
  'variants': {
    'tone': {
      'default': 'text-text',
      'error': 'text-danger',
      'muted': 'text-text-muted',
      'success': 'text-success',
      'warning': 'text-warning'
    }
  }
});
