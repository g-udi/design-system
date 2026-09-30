import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-3'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              <AvatarImage
                src='https://randomuser.me/api/portraits/women/68.jpg'
                alt='Emma Wilson'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent className='flex items-center gap-2 p-2'>
            <Avatar>
              <AvatarImage
                src='https://randomuser.me/api/portraits/women/68.jpg'
                alt='Emma Wilson'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-1'>
                <span className='font-semibold'>Emma Wilson</span>
                <Badge variant='info' size='xs'>
                  Admin
                </Badge>
              </div>
              <p className='opacity-80'>emma@example.com</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
