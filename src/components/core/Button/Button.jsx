import { forwardRef } from 'react';
import Link from '../Link';
import { Slot } from 'radix-ui';

import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases, buttonToneClasses, buttonTones } from './buttonTones';

const compoundVariants = Object.entries(buttonToneClasses).flatMap(([ tone, variants ]) => (
  Object.entries(variants).map(([ variant, className ]) => ({ className, tone, variant }))
));

const resolveButtonVariants = createVariants({
  'base': 'ds-motion-press inline-flex items-center justify-center whitespace-nowrap font-medium [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-primary disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20',
  compoundVariants,
  'defaultVariants': {
    'radius': 'md',
    'size': 'md',
    'tone': 'accent',
    'variant': 'solid'
  },
  'variants': {
    'radius': {
      'full': 'rounded-control',
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': "min-h-9 gap-2 px-4 py-1.5 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
      'md': "min-h-8 gap-2 px-3 py-1 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
      'sm': "min-h-7 gap-1.5 px-2.5 py-1 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3.5",
      'xs': "min-h-6 gap-1 px-2 py-0.5 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3",
      'icon': 'size-8 shrink-0 p-0 [&>svg]:size-4',
      'icon-xs': 'size-6 shrink-0 p-0 [&>svg]:size-3',
      'icon-sm': 'size-7 shrink-0 p-0 [&>svg]:size-3.5',
      'icon-lg': 'size-9 shrink-0 p-0 [&>svg]:size-4'
    },
    'tone': Object.fromEntries(Object.keys(buttonToneClasses).map((tone) => [ tone, '' ])),
    'variant': {
      'ghost': '',
      'outline': 'border',
      'soft': '',
      // Forced colours drop backgrounds; a system-coloured border keeps the filled button's shape.
      'solid': 'forced-colors:border forced-colors:border-[ButtonBorder]',
      'subtle': ''
    }
  }
});

// Composition vocabulary (default, secondary, destructive, link) resolves to Gaudi variants and tones.
const variantAliases = { default: 'solid', secondary: 'soft', destructive: 'solid', link: 'subtle' };

// Only primary actions and links carry the accent by default; quiet variants stay neutral so screens don't turn blue.
const quietVariants = new Set([ 'outline', 'ghost', 'soft', 'secondary' ]);
const defaultTone = (variant) => (variant === 'destructive' ? 'danger' : quietVariants.has(variant) ? 'neutral' : undefined);

export const buttonVariants = Object.assign((options = {}) => {
  const { variant, size, tone, ...rest } = options;
  return resolveButtonVariants({
    ...rest,
    variant: variantAliases[variant] || variant,
    size: size === 'default' ? 'md' : size,
    tone: tone || defaultTone(variant)
  });
}, { variants: resolveButtonVariants.variants, defaultVariants: resolveButtonVariants.defaultVariants });

export const buttonSizes = Object.keys(buttonVariants.variants.size);
export { buttonToneAliases, buttonTones };

const Button = forwardRef(function Button({
  children,
  asChild = false,
  className,
  disabled = false,
  href,
  radius,
  size,
  tone,
  variant,
  ...rest
}, ref) {
  const classes = buttonVariants({ className, radius, size, tone, variant });
  const disabledLinkProps = disabled ? {
    'aria-disabled': true,
    'onClickCapture': (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    'onClick': (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    'tabIndex': -1
  } : {};

  if (asChild) return (
    <Slot.Root ref={ref} data-slot='button' className={classes} {...rest} disabled={disabled || undefined} {...disabledLinkProps}>
      {children}
    </Slot.Root>
  );

  if (href) return (
    <Link ref={ ref } data-slot='button' href={ href } variant='bare' className={ classes } { ...rest } { ...disabledLinkProps }>
      {children}
    </Link>
  );

  return (
    <button ref={ ref } data-slot='button' className={ cn(classes, disabled && 'cursor-not-allowed') } disabled={ disabled } type={ rest.type || 'button' } { ...rest }>
      {children}
    </button>
  );
});

export { buttonVariants as variants };
export default Button;
