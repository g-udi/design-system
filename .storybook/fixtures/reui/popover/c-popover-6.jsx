// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='h-auto justify-start py-1.5'>
            <Avatar className='size-8'>
              <AvatarImage
                src='static/images/art/9.svg'
                alt='Marcus Chen'
              />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className='space-y-0.5 text-left'>
              <p className='leading-none font-medium'>Marcus Chen</p>
              <p className='text-ui-muted-foreground'>@mchen_design</p>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64'>
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-start justify-between'>
              <Avatar className='size-12'>
                <AvatarImage
                  src='static/images/art/7.svg'
                  alt='Marcus Chen'
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <Button size='sm' variant='outline'>
                Follow
              </Button>
            </div>
            <div className='space-y-1'>
              <h4 className='leading-none font-semibold'>Marcus Chen</h4>
              <p className='text-ui-muted-foreground'>@mchen_design</p>
            </div>
            <p className='leading-relaxed'>
              Product Designer specializing in design systems.
            </p>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <span className='font-semibold tabular-nums'>1.2k</span>
                <span className='text-ui-muted-foreground'>Followers</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-semibold tabular-nums'>482</span>
                <span className='text-ui-muted-foreground'>Following</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
