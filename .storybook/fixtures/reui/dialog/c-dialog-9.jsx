// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
const shortcuts = [
  { keys: ['\u2318', 'K'], action: 'Search' },
  { keys: ['\u2318', 'B'], action: 'Bold' },
  { keys: ['\u2318', 'I'], action: 'Italic' },
  { keys: ['\u2318', 'S'], action: 'Save' },
  { keys: ['\u2318', 'Z'], action: 'Undo' },
  { keys: ['\u2318', '\u21E7', 'Z'], action: 'Redo' },
  { keys: ['\u2318', 'N'], action: 'New File' },
  { keys: ['\u2318', 'P'], action: 'Quick Open' },
  { keys: ['\u2318', '/'], action: 'Toggle Comment' },
  { keys: ['\u2318', 'D'], action: 'Duplicate Line' }
];
export function Pattern() {
  const half = Math.ceil(shortcuts.length / 2);
  const leftColumn = shortcuts.slice(0, half);
  const rightColumn = shortcuts.slice(half);
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Keyboard Shortcuts</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Quick reference for commonly used keyboard shortcuts.
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-x-6 gap-y-3'>
            {[leftColumn, rightColumn].map((column, colIndex) => (
              <div key={colIndex} className='space-y-3'>
                {column.map((shortcut) => (
                  <div
                    key={shortcut.action}
                    className='flex items-center justify-between'
                  >
                    <span className='text-ui-muted-foreground text-sm'>
                      {shortcut.action}
                    </span>
                    <div className='flex gap-1'>
                      {shortcut.keys.map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
