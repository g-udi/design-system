// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-fit'>
            Open Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='px-3 py-2'>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}
