'use client';

import { forwardRef } from 'react';
import { cn } from '../../../utilities/cn';
import { createVariants } from '../../../utilities/variants';
import Icon from '../Icon';
import { Avatar as AvatarRoot, AvatarImage, AvatarFallback, AvatarBadge } from './parts/avatar';
import { getAvatarInitials } from './avatarModel';

export const avatarVariants = createVariants({
  'base': 'relative inline-flex shrink-0 items-center justify-center font-semibold text-white',
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
    'tone': {
      'amber': 'bg-amber-700',
      'blue': 'bg-blue-600',
      'gray': 'bg-gray-600',
      'green': 'bg-green-700',
      'indigo': 'bg-indigo-600',
      'neutral': 'bg-neutral-600',
      'red': 'bg-red-600',
      'rose': 'bg-rose-700',
      'teal': 'bg-teal-700',
      'yellow': 'bg-yellow-500 text-yellow-950'
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
  const surfaceClass = { tinted: 'bg-ui-muted text-ui-foreground', plain: 'bg-ui-background text-ui-foreground', bare: 'bg-transparent text-ui-foreground' }[surface];
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
      className={cn(avatarVariants({ shape, size, tone }), 'ds-avatar', surfaceClass, className)}
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
