// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
const SIDES = [
  { label: 'Top', direction: 'top' },
  { label: 'Right', direction: 'right' },
  { label: 'Bottom', direction: 'bottom' },
  { label: 'Left', direction: 'left' }
];
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {SIDES.map((side) => (
        <Drawer key={side.label} direction={side.direction}>
          <DrawerTrigger asChild>
            <Button variant='outline'>{side.label}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className='no-scrollbar overflow-y-auto px-3'>
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className='mb-4 leading-normal'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
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
