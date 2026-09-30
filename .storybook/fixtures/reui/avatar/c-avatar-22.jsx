// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
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
    <TooltipProvider>
      <div className='flex -space-x-2'>
        {avatars.map((avatar, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
              <Avatar className='ring-ui-background ring-2 motion-reduce:transition-none transition-all duration-300 ease-in-out hover:z-1 motion-safe:hover:-translate-y-1 hover:shadow-md'>
                <AvatarImage src={avatar.src} alt={avatar.name} />
                <AvatarFallback className='text-xs'>
                  {avatar.fallback}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>{avatar.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
