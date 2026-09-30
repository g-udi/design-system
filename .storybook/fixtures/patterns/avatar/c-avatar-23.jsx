import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
const avatars = [
  {
    src: 'https://randomuser.me/api/portraits/men/49.jpg',
    fallback: 'DK',
    name: 'David Kim'
  },
  {
    src: 'https://randomuser.me/api/portraits/men/11.jpg',
    fallback: 'SR',
    name: 'Sam Rivera'
  },
  {
    src: 'https://randomuser.me/api/portraits/men/54.jpg',
    fallback: 'ER',
    name: 'James Brown'
  },
  {
    src: 'https://randomuser.me/api/portraits/women/65.jpg',
    fallback: 'JW',
    name: 'Jenny Wilson'
  }
];
export function Pattern() {
  return (
    <div className='group/avatars flex items-center px-2 py-4'>
      {avatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            '--index': index,
            zIndex: avatars.length - index
          }}
          className='group/avatar-item translate-x-[calc(var(--index)*-8px)] motion-reduce:transition-none transition-all duration-300 ease-in-out will-change-transform motion-safe:group-hover/avatars:translate-x-[calc(var(--index)*6px)]'
        >
          <Avatar
            className={cn(
              'ring-ui-background origin-center ring-2 motion-reduce:transition-none transition-transform duration-300 ease-in-out',
              'motion-safe:group-hover/avatar-item:scale-110'
            )}
          >
            <AvatarImage src={avatar.src} alt={avatar.name} />
            <AvatarFallback className='text-xs'>
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
}
