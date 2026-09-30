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
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hover Card Example</DialogTitle>
            <DialogDescription>
              Hover over the button below to see the hover card.
            </DialogDescription>
          </DialogHeader>
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant='outline' className='w-fit'>
                Hover me
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className='flex flex-col gap-1'>
                <h4 className='font-medium'>Hover Card</h4>
                <p className='text-ui-muted-foreground'>
                  This hover card appears inside a dialog. Hover over the button
                  to see it.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </DialogContent>
      </Dialog>
    </div>
  );
}
