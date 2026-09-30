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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Delete Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className='flex items-start gap-3'>
              <div className='bg-ui-destructive/10 text-ui-destructive rounded-full flex size-10 shrink-0 items-center justify-center'>
                <RegistryIcon lucide='AlertTriangleIcon' className='size-5' />
              </div>
              <div className='flex flex-col gap-1'>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item and remove all associated data from our servers.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button variant='destructive'>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
