import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Dialog/parts/sheet.jsx';

const sides = ['right', 'left', 'top', 'bottom'];
const activity = [
  'Maya Patel moved “Launch checklist” to Review.',
  'Leo Martins commented on “Pricing page copy”.',
  'Ana Costa uploaded three files to Brand assets.',
  'Sam Lee closed “Fix onboarding email typo”.',
  'Priya Nair invited two guests to the Q3 roadmap.',
  'Maya Patel renamed the Design channel to Product design.'
];

// Long content scrolls inside the sheet while the header and footer stay put, from every edge.
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button size='sm' variant='outline' className='capitalize'>
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side} className='data-[side=bottom]:h-[50vh] data-[side=top]:h-[50vh]'>
            <SheetHeader>
              <SheetTitle>Recent activity</SheetTitle>
              <SheetDescription>This sheet opens from the {side} edge of the screen.</SheetDescription>
            </SheetHeader>
            <ScrollArea className='min-h-0 flex-1'>
              <div className='grid gap-3 px-3 text-sm text-text-muted'>
                {[...activity, ...activity, ...activity].map((entry, index) => (
                  <p key={index}>{entry}</p>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant='outline'>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
