import { cn } from '../../../../src/utilities/cn/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';

const months = 12;
const ticks = Array.from({ length: months + 1 }, (_, i) => i);

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm gap-6'>
      {/* Reference labels at the ends and midpoint. */}
      <div className='grid gap-2'>
        <Label>Storage</Label>
        <Slider aria-label='Storage' defaultValue={[15]} min={5} max={35} />
        <span aria-hidden='true' className='flex w-full items-center justify-between text-xs font-medium text-text-muted'>
          <span>5 GB</span>
          <span>20 GB</span>
          <span>35 GB</span>
        </span>
      </div>
      {/* A tick per step, labelled every other step. */}
      <div className='grid gap-2'>
        <Label>Duration (months)</Label>
        <Slider aria-label='Duration' defaultValue={[5]} max={months} />
        <span aria-hidden='true' className='flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-text-muted'>
          {ticks.map((tick) => (
            <span key={tick} className='flex w-0 flex-col items-center justify-center gap-1.5'>
              <span className={cn('h-1 w-px bg-text-muted/70', tick % 2 !== 0 && 'h-0.5')} />
              <span className={cn(tick % 2 !== 0 && 'opacity-0')}>{tick}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
