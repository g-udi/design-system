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
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline'>Scrollable Sheet</Button>
        </SheetTrigger>
        <SheetContent className='flex flex-col gap-0 space-y-0'>
          <SheetHeader>
            <SheetTitle>Scrollable Content</SheetTitle>
            <SheetDescription>
              Description of the scrollable content.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className='h-[calc(100vh-230px)] flex-1 grow'>
            <div className='space-y-3 px-3'>
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className='text-ui-muted-foreground text-sm'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris.
                </p>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter>
            <Button type='submit'>Save changes</Button>
            <SheetClose asChild>
              <Button variant='outline'>Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
