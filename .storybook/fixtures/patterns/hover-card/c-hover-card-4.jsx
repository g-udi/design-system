import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant='outline'>Instant Deployment</Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-80 p-3'>
          <div className='flex gap-2'>
            <RegistryIcon
              lucide='ZapIcon'
              aria-hidden='true'
              className='mt-0.5 size-4 shrink-0 text-amber-500'
            />
            <div className='space-y-1'>
              <p className='font-medium'>Zero Latency Edge</p>
              <p className='text-ui-muted-foreground leading-relaxed'>
                Deploy your applications across our global edge network in
                seconds.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
