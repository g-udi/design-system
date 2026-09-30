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

const TERMS = [
  'Your workspace data stays in the region you chose at sign-up. Backups are encrypted at rest and kept for 30 days.',
  'Members can export their own content at any time. Owners can export the whole workspace from Settings.',
  'We notify owners by email at least 14 days before any change to these terms takes effect.',
  'Deleted projects move to the trash for 30 days, after which they are removed permanently from every backup.',
  'Integrations only receive the scopes you approve. You can revoke a connected app from the Integrations page.',
  'Usage is billed monthly per active member. Guests and viewers are free and never count toward your plan.'
];

function Terms({ repeat = 2 }) {
  return Array.from({ length: repeat }).flatMap((_, round) =>
    TERMS.map((term, index) => (
      <p key={`${round}-${index}`} className='text-text-muted leading-normal'>
        {term}
      </p>
    ))
  );
}

// Three ways to hold long content: the body scrolls alone, the footer stays pinned, or the dialog fills the screen.
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>Scrolling body</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>Scroll to read the full terms.</DialogDescription>
          </DialogHeader>
          <div className='no-scrollbar -mx-3 grid max-h-[60vh] gap-3 overflow-y-auto px-3'>
            <Terms />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>Sticky footer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>The footer stays in view while the terms scroll.</DialogDescription>
          </DialogHeader>
          <div className='no-scrollbar -mx-3 grid max-h-[50vh] gap-3 overflow-y-auto px-3'>
            <Terms />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Decline</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Accept</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='sm' variant='outline'>Full screen</Button>
        </DialogTrigger>
        <DialogContent className='flex max-h-[calc(100vh-3rem)] w-full max-w-[calc(100vw-3rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[calc(100vw-3rem)]'>
          <DialogHeader className='border-b border-border p-4'>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>A fluid full-screen dialog with a sticky header and footer.</DialogDescription>
          </DialogHeader>
          <div className='grid flex-1 gap-3 overflow-y-auto p-4'>
            <Terms repeat={4} />
          </div>
          <DialogFooter className='mx-0 mb-0 rounded-none'>
            <DialogClose asChild>
              <Button variant='outline'>Decline</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Accept</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
