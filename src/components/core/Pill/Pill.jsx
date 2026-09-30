import Link from 'next/link';

import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';

const semanticToneClasses = {
  'amber': {
    'ghost': 'text-warning hover:bg-warning-subtle',
    'outline': 'border-warning-border text-warning hover:bg-warning-subtle',
    'soft': 'bg-warning-subtle text-warning hover:bg-warning-muted',
    'solid': 'bg-warning text-warning-foreground hover:brightness-95',
    'subtle': 'text-warning hover:bg-warning-subtle'
  },
  'blue': {
    'ghost': 'text-accent hover:bg-accent-subtle',
    'outline': 'border-accent-muted text-accent hover:bg-accent-subtle',
    'soft': 'bg-accent-subtle text-accent hover:bg-accent-muted',
    'solid': 'bg-accent text-accent-foreground hover:bg-accent-dark',
    'subtle': 'text-accent hover:bg-accent-subtle'
  },
  'gray': {
    'ghost': 'text-text-muted hover:bg-surface-muted hover:text-foreground',
    'outline': 'border-border text-text-muted hover:bg-surface-muted hover:text-foreground',
    'soft': 'bg-surface-muted text-text-muted hover:bg-border-muted dark:hover:bg-surface-muted',
    'solid': 'bg-foreground text-text-inverse hover:bg-text-muted dark:bg-text dark:text-surface',
    'subtle': 'text-text-muted hover:bg-surface-muted hover:text-foreground'
  },
  'green': {
    'ghost': 'text-success hover:bg-success-subtle',
    'outline': 'border-success-border text-success hover:bg-success-subtle',
    'soft': 'bg-success-subtle text-success hover:bg-success-muted',
    'solid': 'bg-success text-success-foreground hover:brightness-95',
    'subtle': 'text-success hover:bg-success-subtle'
  },
  'indigo': {
    'ghost': 'text-info hover:bg-info-subtle',
    'outline': 'border-info-border text-info hover:bg-info-subtle',
    'soft': 'bg-info-subtle text-info hover:bg-info-muted',
    'solid': 'bg-info text-info-foreground hover:brightness-95',
    'subtle': 'text-info hover:bg-info-subtle'
  },
  'neutral': {
    'ghost': 'text-foreground hover:bg-surface-muted',
    'outline': 'border-border text-foreground hover:bg-surface-muted',
    'soft': 'bg-surface-muted text-foreground hover:bg-border-muted dark:hover:bg-surface-muted',
    'solid': 'bg-foreground text-text-inverse hover:bg-text-muted dark:bg-text dark:text-surface',
    'subtle': 'text-text-muted hover:bg-surface-muted hover:text-foreground'
  },
  'red': {
    'ghost': 'text-danger hover:bg-danger-subtle',
    'outline': 'border-danger-border text-danger hover:bg-danger-subtle',
    'soft': 'bg-danger-subtle text-danger hover:bg-danger-muted',
    'solid': 'bg-danger text-danger-foreground hover:brightness-95',
    'subtle': 'text-danger hover:bg-danger-subtle'
  },
  'rose': {
    'ghost': 'text-attention hover:bg-attention-subtle',
    'outline': 'border-attention-border text-attention hover:bg-attention-subtle',
    'soft': 'bg-attention-subtle text-attention hover:bg-attention-muted',
    'solid': 'bg-attention text-attention-foreground hover:brightness-95',
    'subtle': 'text-attention hover:bg-attention-subtle'
  },
  'teal': {
    'ghost': 'text-discovery hover:bg-discovery-subtle',
    'outline': 'border-discovery-border text-discovery hover:bg-discovery-subtle',
    'soft': 'bg-discovery-subtle text-discovery hover:bg-discovery-muted',
    'solid': 'bg-discovery text-discovery-foreground hover:brightness-95',
    'subtle': 'text-discovery hover:bg-discovery-subtle'
  },
  'yellow': {
    'ghost': 'text-warning hover:bg-warning-subtle',
    'outline': 'border-warning-border text-warning hover:bg-warning-subtle',
    'soft': 'bg-warning-subtle text-warning hover:bg-warning-muted',
    'solid': 'bg-warning text-warning-foreground hover:brightness-95',
    'subtle': 'text-warning hover:bg-warning-subtle'
  }
};

const compoundVariants = Object.entries(semanticToneClasses).flatMap(([ tone, variants ]) => (
  Object.entries(variants).map(([ variant, className ]) => ({ className, tone, variant }))
));

const dotToneClasses = {
  'amber': 'bg-warning',
  'blue': 'bg-accent',
  'gray': 'bg-text-muted',
  'green': 'bg-success',
  'indigo': 'bg-info',
  'neutral': 'bg-foreground',
  'red': 'bg-danger',
  'rose': 'bg-attention',
  'teal': 'bg-discovery',
  'yellow': 'bg-warning'
};

export const pillVariants = createVariants({
  'base': 'my-1 mr-1 inline-flex select-none items-center gap-1 whitespace-nowrap font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
  compoundVariants,
  'defaultVariants': {
    'radius': 'sm',
    'size': 'md',
    'tone': 'blue',
    'variant': 'solid'
  },
  'variants': {
    'radius': {
      'full': 'rounded-full',
      'md': 'rounded-md',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'px-3 py-1 text-sm leading-5',
      'md': 'px-2.5 py-0.5 text-xs leading-5 sm:text-sm',
      'sm': 'px-2 py-0.5 text-xs leading-4',
      'xs': 'px-1.5 py-px text-xs leading-4'
    },
    'tone': {
      'amber': '',
      'blue': '',
      'gray': '',
      'green': '',
      'indigo': '',
      'neutral': '',
      'red': '',
      'rose': '',
      'teal': '',
      'yellow': ''
    },
    'variant': {
      'ghost': '',
      'outline': 'border',
      'soft': '',
      'solid': '',
      'subtle': ''
    }
  }
});

export const pillTones = Object.keys(pillVariants.variants.tone);
export const pillSizes = Object.keys(pillVariants.variants.size);

const PulseDot = ({ tone }) => (
  <span className='relative flex size-1.5' aria-hidden='true'>
    <span className={ cn('absolute inline-flex size-full animate-ping rounded-full opacity-75', dotToneClasses[tone] || dotToneClasses.blue) }
    />
    <span className={ cn('relative inline-flex size-1.5 rounded-full', dotToneClasses[tone] || dotToneClasses.blue) }
    />
  </span>
);

const Pill = ({
  children,
  className,
  href,
  icon,
  pulse = false,
  radius,
  size,
  tone = 'blue',
  variant
}) => {
  const classes = pillVariants({ className, radius, size, tone, variant });
  const content = (
    <>
      {pulse ? <PulseDot tone={ tone } /> : null}
      {icon ? <span aria-hidden='true'>{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  if (href) return (
    <Link href={ href } className={ cn(classes, 'ds-control-hit-target relative') }>
      {content}
    </Link>
  );

  return (
    <span className={ classes }>
      {content}
    </span>
  );
};

export default Pill;
