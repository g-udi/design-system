// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
export function Pattern() {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant='outline' className='w-full capitalize'>
              {side.replace('-', ' ')}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className='w-40'>
            <p>Popover on {side.replace('-', ' ')}</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
