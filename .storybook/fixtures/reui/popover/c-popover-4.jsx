// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm'>
            Start
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto'>
          <p>Aligned to start</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm'>
            Center
          </Button>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-auto'>
          <p>Aligned to center</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm'>
            End
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-auto'>
          <p>Aligned to end</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
