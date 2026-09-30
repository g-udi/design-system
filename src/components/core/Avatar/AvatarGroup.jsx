'use client';

import Avatar, { avatarVariants } from './Avatar';
import { AvatarGroup as AvatarGroupRoot, AvatarGroupCount } from './parts/avatar';
import { getAvatarGroupState } from './avatarModel';
import { cn } from '../../../utilities/cn';

/** Accept existing compound children or a list of stable, application-owned identities. */
export default function AvatarGroup({
  avatars, children, max = 4, size = 'sm', shape = 'circle',
  label, className, renderAvatar, renderOverflow, formatOverflow,
  ...props
}) {
  if (!avatars) return <AvatarGroupRoot {...props} className={className}>{children}</AvatarGroupRoot>;
  const { visible, overflow } = getAvatarGroupState(avatars, max);
  const count = overflow > 0 ? (
    <AvatarGroupCount
      className={cn(avatarVariants({ size, shape }), 'ds-avatar-overflow bg-ui-muted text-ui-muted-foreground')}
      aria-label={formatOverflow?.(overflow) || `${overflow} more people`}
    >+{overflow}</AvatarGroupCount>
  ) : null;
  return (
    <div {...props} className={cn('ds-avatar-group-layout', className)} role='group' aria-label={label ?? props['aria-label']}>
      <AvatarGroupRoot className='ds-avatar-stack'>
        {visible.map(({ id, ...person }) => {
          const avatar = <Avatar {...person} size={size} shape={shape} />;
          return <span key={id} className='ds-avatar-group-member'>{renderAvatar ? renderAvatar(avatar, { id, ...person }) : avatar}</span>;
        })}
        {count && (renderOverflow ? renderOverflow(count, overflow) : count)}
      </AvatarGroupRoot>
      {children}
    </div>
  );
}
