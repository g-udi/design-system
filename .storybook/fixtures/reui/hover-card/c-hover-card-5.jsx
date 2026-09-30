// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant='outline'>View Image</Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-[320px] overflow-hidden p-0'>
          <img
            src='https://picsum.photos/1000/800?grayscale&random=1'
            alt='Card Image'
            className='aspect-video w-full object-cover'
          />
          <div className='space-y-1 p-3'>
            <p className='font-medium'>Image Overview</p>
            <p className='text-ui-muted-foreground leading-relaxed'>
              Visual overview of generated landing page.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
