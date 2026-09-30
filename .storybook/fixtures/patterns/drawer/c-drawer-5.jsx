import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../../src/components/core/Dialog/parts/drawer.jsx';

const SIDES = ['bottom', 'right', 'left', 'top'];
const NOTES = [
  'Pick a daily target you can keep on a busy day, then raise it once it feels easy.',
  'Active minutes count any movement that raises your heart rate, including brisk walks.',
  'Your goal resets at midnight in your local time zone.',
  'Streaks pause instead of breaking when you log a rest day.',
  'Reminders arrive an hour before the end of your usual active window.',
  'Changes apply from tomorrow so today’s progress stays comparable.'
];

// The body scrolls between a fixed header and footer, whichever edge the drawer slides from.
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {SIDES.map((side) => (
        <Drawer key={side} direction={side}>
          <DrawerTrigger asChild>
            <Button size='sm' variant='outline' className='capitalize'>{side}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div className='no-scrollbar grid gap-3 overflow-y-auto px-3 text-sm text-text-muted'>
              {[...NOTES, ...NOTES].map((note, index) => (
                <p key={index}>{note}</p>
              ))}
            </div>
            <DrawerFooter>
              <Button>Save goal</Button>
              <DrawerClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
