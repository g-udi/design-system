import Link from '../Link';

import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases, canonicalButtonToneClasses } from '../Button/buttonTones';
import { Badge } from './Badge.jsx';

const toneNames = [ 'amber', 'blue', 'gray', 'green', 'indigo', 'neutral', 'red', 'rose', 'teal', 'yellow' ];

// Gray is the quiet metadata tone: muted text in every variant except solid.
const grayClasses = {
  'ghost': 'text-text-muted hover:bg-surface-muted hover:text-foreground',
  'outline': 'border-border text-text-muted hover:bg-surface-muted hover:text-foreground',
  'soft': 'bg-surface-muted text-text-muted hover:bg-ui-secondary',
  'solid': canonicalButtonToneClasses.neutral.solid,
  'subtle': 'text-text-muted hover:bg-surface-muted hover:text-foreground'
};

// Pill shares the Button tone scale; `subtle` is the ghost treatment because a pill keeps its padding.
const toneClasses = (tone, variant) => {
  if (tone === 'gray') return grayClasses[variant];
  const classes = canonicalButtonToneClasses[buttonToneAliases[tone] || tone];
  return variant === 'subtle' ? classes.ghost : classes[variant];
};

const variantNames = [ 'ghost', 'outline', 'soft', 'solid', 'subtle' ];

export const pillVariants = createVariants({
  'base': 'select-none gap-1 transition-colors duration-200',
  'compoundVariants': toneNames.flatMap((tone) => variantNames.map((variant) => ({ 'className': toneClasses(tone, variant), tone, variant }))),
  'defaultVariants': {
    'radius': 'sm',
    'size': 'md',
    'tone': 'blue',
    'variant': 'solid'
  },
  'variants': {
    'radius': {
      'full': 'rounded-pill',
      'md': 'rounded-md',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'px-3 py-1 text-sm leading-5',
      'md': 'px-2.5 py-0.5 text-xs leading-5',
      'sm': 'px-2 py-0.5 text-xs leading-4',
      'xs': 'px-1.5 py-px text-xs leading-4'
    },
    'tone': Object.fromEntries(toneNames.map((tone) => [ tone, '' ])),
    'variant': {
      'ghost': 'border-0',
      'outline': 'border',
      'soft': 'border-0',
      'solid': 'border-0',
      'subtle': 'border-0'
    }
  }
});

export const pillTones = toneNames;
export const pillSizes = Object.keys(pillVariants.variants.size);

// The live dot takes the pill's text colour, so it stays visible on every variant.
const PulseDot = () => (
  <span className='relative flex size-1.5' aria-hidden='true'>
    <span className='absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75' />
    <span className='relative inline-flex size-1.5 rounded-full bg-current' />
  </span>
);

/** A compact status, category, or tag label on the Badge element, with named tones and an optional link. */
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
  const content = (
    <>
      {pulse ? <PulseDot /> : null}
      {icon ? <span aria-hidden='true'>{icon}</span> : null}
      <span>{children}</span>
    </>
  );
  const classes = cn(pillVariants({ radius, size, tone, variant }), href && 'ds-control-hit-target', className);

  // Badge's own size and radius scales are switched off; the pill scale above replaces them.
  return (
    <Badge variant={ null } size={ null } radius={ null } data-variant={ variant || 'solid' } asChild={ Boolean(href) } className={ classes }>
      {href ? <Link href={ href } variant='bare'>{content}</Link> : content}
    </Badge>
  );
};

export default Pill;
