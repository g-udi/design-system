import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
const sides = ['top', 'right', 'bottom', 'left'];
const aligns = ['start', 'center', 'end'];
function Example({ side = 'bottom', align = 'center', label }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='w-full capitalize'>
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} className='w-56 px-3 py-2'>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Opens on the {side}, aligned to the {align}.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm gap-3'>
      <div className='grid gap-2'>
        <p className='text-xs text-text-muted'>Side</p>
        <div className='grid grid-cols-4 gap-2'>
          {sides.map((side) => (
            <Example key={side} side={side} label={side} />
          ))}
        </div>
      </div>
      <div className='grid gap-2'>
        <p className='text-xs text-text-muted'>Alignment</p>
        <div className='grid grid-cols-3 gap-2'>
          {aligns.map((align) => (
            <Example key={align} align={align} label={align} />
          ))}
        </div>
      </div>
    </div>
  );
}
