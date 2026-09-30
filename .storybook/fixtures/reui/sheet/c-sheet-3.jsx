// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
const sides = ['top', 'right', 'bottom', 'left'];
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant='outline' className='capitalize'>
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={side}
            className='data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]'
          >
            <SheetHeader>
              <SheetTitle>Sheet Side: {side}</SheetTitle>
              <SheetDescription>
                This sheet opens from the {side} side of the screen.
              </SheetDescription>
            </SheetHeader>
            <div className='text-ui-muted-foreground p-3 text-sm'>
              {Array.from({ length: 5 }).map((_, i) => (
                <p key={i} className='mb-2'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              ))}
            </div>
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
