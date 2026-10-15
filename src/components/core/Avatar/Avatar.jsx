'use client';

import { forwardRef } from 'react';
import { cn } from '../../../utilities/cn';
import Icon from '../Icon';
import { Avatar as AvatarRoot, AvatarImage, AvatarFallback, AvatarBadge } from './AvatarPrimitives.jsx';
import { avatarVariants, getAvatarInitials } from './avatarModel';

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
