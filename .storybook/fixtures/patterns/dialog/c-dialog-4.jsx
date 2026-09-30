import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';

// The corner close button can be hidden or restyled; the footer can hold one full-width action.
const customClose =
  '[&>[data-slot=dialog-close]]:size-6 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:border-border [&>[data-slot=dialog-close]]:bg-surface-muted [&>[data-slot=dialog-close]]:text-text-muted';

export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>No close button</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Publish changes?</DialogTitle>
            <DialogDescription>
              Without the corner button, the footer actions are the only way out besides Escape.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Not now</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Publish</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>Custom close button</Button>
        </DialogTrigger>
        <DialogContent className={customClose}>
          <DialogHeader>
            <DialogTitle>Invite accepted</DialogTitle>
            <DialogDescription>
              Maya Patel joined the Design workspace. The corner close button is restyled as a round chip.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>View workspace</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>Full-width action</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Session expired</DialogTitle>
            <DialogDescription>
              Your session timed out due to inactivity. Sign in again to continue where you left off.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className='w-full'>Sign in again</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
