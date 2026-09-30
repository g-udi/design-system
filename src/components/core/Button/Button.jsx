import { forwardRef } from 'react';
import Link from 'next/link';
import { Slot } from 'radix-ui';

import { cn } from '../../../utilities/cn';
import { isExternalHref } from '../../../utilities/href';
import { createVariants } from '../../../utilities/variants';
import { buttonToneAliases, buttonToneClasses, buttonTones } from './Button.tones';

const compoundVariants = Object.entries(buttonToneClasses).flatMap(([ tone, variants ]) => (
  Object.entries(variants).map(([ variant, className ]) => ({ className, tone, variant }))
));

const resolveButtonVariants = createVariants({
  'base': 'ds-motion-press inline-flex min-h-11 items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-gray-950',
  compoundVariants,
  'defaultVariants': {
    'radius': 'md',
    'size': 'md',
    'tone': 'accent',
    'variant': 'solid'
  },
  'variants': {
    'radius': {
      'full': 'rounded-full',
      'lg': 'rounded-lg',
      'md': 'rounded-md',
      'sm': 'rounded-sm'
    },
    'size': {
      'lg': 'gap-3 px-8 py-4 text-base',
      'md': 'gap-2 px-6 py-3 text-sm',
      'sm': 'gap-2 px-4 py-2 text-sm',
      'xs': 'gap-1.5 px-3 py-1.5 text-xs',
      'icon': 'size-11 shrink-0 p-0 [&>svg]:size-4',
      'icon-xs': 'size-7 min-h-7 shrink-0 p-0 [&>svg]:size-3',
      'icon-sm': 'size-9 min-h-9 shrink-0 p-0 [&>svg]:size-4',
      'icon-lg': 'size-12 shrink-0 p-0 [&>svg]:size-5'
    },
    'tone': Object.fromEntries(Object.keys(buttonToneClasses).map((tone) => [ tone, '' ])),
    'variant': {
      'ghost': '',
      'outline': 'border',
      'soft': '',
      'solid': '',
      'subtle': ''
    }
  }
});

/** ReUI vocabulary resolves through the existing Gaudi tones and variants. */
export const buttonVariants = Object.assign((options = {}) => {
  const { variant, size, tone, ...rest } = options;
  const aliases = { default: 'solid', secondary: 'soft', destructive: 'solid', link: 'subtle' };
  return resolveButtonVariants({
    ...rest,
    variant: aliases[variant] || variant,
    size: size === 'default' ? 'md' : size,
    tone: tone || (variant === 'destructive' ? 'danger' : variant === 'secondary' ? 'neutral' : undefined)
  });
}, { variants: resolveButtonVariants.variants, defaultVariants: resolveButtonVariants.defaultVariants });

export const buttonSizes = Object.keys(buttonVariants.variants.size);
export { buttonToneAliases, buttonTones };

// mailto also renders as a plain anchor: NextLink client navigation makes no sense for it
const rendersAsExternalAnchor = (href) => isExternalHref(href) || Boolean(href?.startsWith('mailto:'));

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
    'onClick': (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    'tabIndex': -1
  } : {};

  if (asChild) return (
    <Slot.Root ref={ref} data-slot='button' className={classes} {...rest} {...disabledLinkProps}>
      {children}
    </Slot.Root>
  );

  if (href && !rendersAsExternalAnchor(href)) return (
    <Link ref={ ref } href={ href } className={ classes } { ...rest } { ...disabledLinkProps }>
      {children}
    </Link>
  );

  if (href) return (
    <a ref={ ref } href={ href } className={ classes } target='_blank' rel='noopener noreferrer' { ...rest } { ...disabledLinkProps }>
      {children}
    </a>
  );

  return (
    <button ref={ ref } data-slot='button' className={ cn(classes, disabled && 'cursor-not-allowed') } disabled={ disabled } type={ rest.type || 'button' } { ...rest }>
      {children}
    </button>
  );
});

export { buttonVariants as variants };
export default Button;
