'use client';

import { forwardRef } from 'react';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import Icon from '../Icon';
import { Avatar as AvatarRoot, AvatarImage, AvatarFallback, AvatarBadge } from './parts/avatar';
import { getAvatarInitials } from './avatarModel';

export const avatarVariants = createVariants({
  'base': 'relative inline-flex shrink-0 items-center justify-center bg-linear-135 font-semibold',
  'defaultVariants': {
    'shape': 'square',
    'size': 'md',
    'tone': 'gray'
  },
  'variants': {
    'shape': {
      'circle': 'rounded-full',
      'square': 'rounded-md',
      'tile': 'rounded-xl'
    },
    'size': {
      '2xs': 'size-4 text-xs',
      'xl': 'size-20 text-2xl',
      'lg': 'size-14 text-base',
      'md': 'size-10 text-sm',
      'sm': 'size-8 text-xs',
      'xs': 'size-5 text-xs'
    },
    // Soft gradient shades from the Gaudi artwork palette, with the tone's ink for the initials.
    'tone': {
      'amber': 'from-amber-200 via-orange-200 to-rose-200 text-amber-950 dark:from-amber-700 dark:via-orange-800 dark:to-rose-900 dark:text-amber-50',
      'blue': 'from-sky-200 via-blue-300 to-indigo-300 text-blue-950 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900 dark:text-blue-50',
      'gray': 'from-slate-200 via-indigo-100 to-violet-200 text-slate-800 dark:from-slate-600 dark:via-slate-700 dark:to-violet-900 dark:text-slate-50',
      'green': 'from-emerald-200 via-lime-200 to-green-300 text-green-950 dark:from-emerald-700 dark:via-green-800 dark:to-lime-900 dark:text-green-50',
      'indigo': 'from-sky-200 via-violet-300 to-fuchsia-300 text-indigo-950 dark:from-indigo-600 dark:via-violet-800 dark:to-fuchsia-900 dark:text-indigo-50',
      'neutral': 'from-neutral-200 via-stone-200 to-neutral-300 text-neutral-800 dark:from-neutral-600 dark:via-neutral-700 dark:to-stone-800 dark:text-neutral-50',
      'red': 'from-rose-200 via-red-200 to-orange-200 text-red-950 dark:from-rose-700 dark:via-red-800 dark:to-orange-900 dark:text-red-50',
      'rose': 'from-pink-200 via-rose-200 to-fuchsia-300 text-rose-950 dark:from-pink-700 dark:via-rose-800 dark:to-fuchsia-900 dark:text-rose-50',
      'teal': 'from-cyan-200 via-teal-200 to-sky-300 text-teal-950 dark:from-cyan-700 dark:via-teal-800 dark:to-sky-900 dark:text-teal-50',
      'yellow': 'from-yellow-100 via-amber-200 to-orange-200 text-yellow-950 dark:from-yellow-600 dark:via-amber-700 dark:to-orange-800 dark:text-yellow-50'
    }
  }
});

/** The convenience API composes the same primitives as the richer examples. */
const Avatar = forwardRef(function Avatar({
  alt, name, label, className, fallback, shape, size = 'md', src, tone,
  surface = 'solid', fit, grayscale = false, indicator, children,
  imageClassName, fallbackClassName, imageProps, onLoadingStatusChange,
  ...props
}, ref) {
  const decorative = alt === '' || props['aria-hidden'] === true || props['aria-hidden'] === 'true';
  const identity = alt ?? name ?? (label ? `${label} avatar` : 'Avatar');
  const accessibleLabel = props['aria-label'] ?? [identity, indicator?.label].filter(Boolean).join(', ');
  // Only the solid surface paints the tone gradient; the others use surface tokens.
  const surfaceClass = { tinted: 'bg-surface-muted text-text', plain: 'bg-surface text-text', bare: 'bg-transparent text-text' }[surface];
  const content = fallback === true
    ? <Icon name='User' decorative className='size-3/5' />
    : fallback || label || (size === '2xs' ? Array.from(getAvatarInitials(name))[0] : getAvatarInitials(name));

  return (
    <AvatarRoot
      {...props}
      ref={ref}
      size={size}
      data-avatar-size={size}
      data-surface={surface}
      data-grayscale={grayscale || undefined}
      className={cn(avatarVariants({ shape, size, tone: surface === 'solid' ? tone : null }), 'ds-avatar', surfaceClass, className)}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : accessibleLabel}
      aria-hidden={decorative || undefined}
    >
      <AvatarImage
        {...imageProps}
        key={src || 'no-image'}
        src={src || undefined}
        alt=''
        aria-hidden='true'
        onLoadingStatusChange={onLoadingStatusChange}
        className={cn('ds-avatar-image', (fit || (surface === 'plain' || surface === 'bare' ? 'contain' : 'cover')) === 'contain' ? 'object-contain' : 'object-cover', imageClassName)}
      />
      <AvatarFallback className={cn('ds-avatar-fallback text-[length:inherit]', fallbackClassName)} aria-hidden='true'>
        <span className='flex size-full items-center justify-center leading-none'>{content}</span>
      </AvatarFallback>
      {indicator?.label && (
        <AvatarBadge
          className={cn('ds-avatar-indicator', indicator.icon ? 'size-[36%]!' : 'size-1/4!', indicator.className)}
          data-tone={indicator.tone || 'neutral'}
          data-position={indicator.position || 'bottom-end'}
          data-icon={Boolean(indicator.icon)}
          style={{
            inset: 'auto',
            [indicator.position?.endsWith('start') ? 'insetInlineStart' : 'insetInlineEnd']: 0,
            [indicator.position?.startsWith('top') ? 'insetBlockStart' : 'insetBlockEnd']: 0
          }}
          aria-hidden='true'
        >
          {indicator.icon && <Icon name={indicator.icon} decorative size='xs' />}
        </AvatarBadge>
      )}
      {children}
    </AvatarRoot>
  );
});

export default Avatar;
