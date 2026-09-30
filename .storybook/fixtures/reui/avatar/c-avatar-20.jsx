// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='border-ui-border rounded-full flex items-center gap-1.5 border p-1 shadow-sm shadow-black/5'>
      <AvatarGroup>
        <Avatar className='size-7'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/65.jpg'
            alt='Liam Thompson'
          />
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <Avatar className='size-7'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/12.jpg'
            alt='Nick Johnson'
          />
          <AvatarFallback>NJ</AvatarFallback>
        </Avatar>
        <Avatar className='size-7'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/90.jpg'
            alt='Maria Garcia'
          />
          <AvatarFallback>MG</AvatarFallback>
        </Avatar>
        <Avatar className='size-7'>
          <AvatarImage src='https://randomuser.me/api/portraits/men/75.jpg' alt='@julesmartin' />
          <AvatarFallback>JM</AvatarFallback>
        </Avatar>
      </AvatarGroup>

      <p className='text-ui-muted-foreground me-1.5 text-xs'>
        Trusted by{' '}
        <span className='text-ui-foreground font-semibold'>100K+</span> users.
      </p>
    </div>
  );
}
