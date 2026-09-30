// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Session Expired</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogDescription>
              Your session has timed out due to inactivity. Please sign in again
              to continue where you left off.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className='w-full'>Sign In Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
