import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open dialog</Button>
        </DialogTrigger>
        <DialogContent className='p-4'>
          <DialogHeader>
            <DialogTitle>Overlays in a dialog</DialogTitle>
            <DialogDescription>
              Popovers and hover cards stack above the dialog and keep focus
              inside it.
            </DialogDescription>
          </DialogHeader>
          <div className='flex gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' size='sm'>
                  Open popover
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-64'>
                <PopoverHeader>
                  <PopoverTitle>Popover in a dialog</PopoverTitle>
                  <PopoverDescription>
                    Escape closes the popover first, then the dialog.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button variant='outline' size='sm'>
                  Hover me
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className='w-64'>
                <div className='flex flex-col gap-1'>
                  <p className='font-medium'>Hover card in a dialog</p>
                  <p className='text-text-muted'>
                    Opens on hover or focus without taking focus.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
