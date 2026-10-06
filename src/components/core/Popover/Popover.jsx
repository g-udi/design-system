'use client';

import Button from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from './PopoverPrimitives.jsx';

// The compound API is the Radix composition; PopoverRoot is the one-line convenience built on it.
export { Popover, PopoverContent, PopoverTrigger };

/** A button that opens a non-modal panel; Escape or a click outside closes it and returns focus to the button. */
export function PopoverRoot({ trigger, children, className, contentClassName, side = 'bottom', align = 'start', ...props }) {
  return (
    <Popover { ...props }>
      <PopoverTrigger asChild>
        <Button variant='outline' tone='neutral' className={ className }>{trigger}</Button>
      </PopoverTrigger>
      <PopoverContent side={ side } align={ align } sideOffset={ 6 } collisionPadding={ 12 } className={ contentClassName }>
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default PopoverRoot;
