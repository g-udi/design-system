import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const notifications = ['Sarah commented on your PR', 'Build #421 completed', 'A new team member joined'];
export function Pattern() {
  return (
    <TooltipProvider>
      <div className='flex items-center justify-center gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon' aria-label='Notifications, 3 new' className='relative'>
              <RegistryIcon lucide='BellIcon' aria-hidden='true' />
              <span className='absolute top-1 right-1 block size-2 rounded-full bg-danger' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='w-60 p-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-2'>
                <span className='font-medium'>Notifications</span>
                <Badge variant='destructive' size='xs'>3 new</Badge>
              </div>
              <ul className='m-0 flex list-disc flex-col gap-1 ps-4 opacity-80'>
                {notifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href='#notifications' className='flex items-center gap-1 font-medium text-inherit underline underline-offset-2'>
                View all
                <RegistryIcon lucide='ArrowRightIcon' className='size-3.5' aria-hidden='true' />
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon' aria-label='Advanced analytics, Pro feature'>
              <RegistryIcon lucide='LockIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent className='w-60 p-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>Advanced analytics</span>
                <Badge variant='success' size='xs'>Pro</Badge>
              </div>
              <p className='opacity-80'>
                Detailed insights, custom reports, and real-time dashboards.
              </p>
              <Button size='sm' className='w-full'>
                Upgrade to Pro
                <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
