'use client';

import Avatar from './Avatar';
import { avatarVariants } from './avatarModel';
import { AvatarGroup as AvatarGroupRoot, AvatarGroupCount } from './AvatarPrimitives.jsx';
import { getAvatarGroupState } from './avatarModel';
import { cn } from '../../../utilities/cn';

/** Accept existing compound children or a list of stable, application-owned identities. */
export default function AvatarGroup({
  avatars, children, max = 4, size = 'sm', shape = 'circle',
  as: Container = 'div', label, className, renderAvatar, renderOverflow, formatOverflow,
  ...props
}) {
  if (!avatars) return <AvatarGroupRoot as={Container} {...props} className={className}>{children}</AvatarGroupRoot>;
  const { visible, overflow } = getAvatarGroupState(avatars, max);
  const innerTag = Container === 'span' ? 'span' : 'div';
  const count = overflow > 0 ? (
    <AvatarGroupCount
      as={innerTag}
      className={cn(avatarVariants({ size, shape, tone: null }), 'ds-avatar-overflow bg-surface-muted text-text-muted')}
      aria-label={formatOverflow?.(overflow) || `${overflow} more people`}
    >+{overflow}</AvatarGroupCount>
  ) : null;
  return (
    <Container {...props} className={cn('ds-avatar-group-layout', className)} role='group' aria-label={label ?? props['aria-label']}>
      <AvatarGroupRoot as={innerTag} className='ds-avatar-stack'>
        {visible.map(({ id, ...person }) => {
          const avatar = <Avatar {...person} size={size} shape={shape} />;
          return <span key={id} className='ds-avatar-group-member'>{renderAvatar ? renderAvatar(avatar, { id, ...person }) : avatar}</span>;
        })}
        {count && (renderOverflow ? renderOverflow(count, overflow) : count)}
      </AvatarGroupRoot>
      {children}
    </Container>
  );
}
