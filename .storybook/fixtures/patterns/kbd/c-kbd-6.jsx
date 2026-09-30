import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
const shortcuts = [
  { label: 'Search', keys: ['\u2318', 'K'] },
  { label: 'New File', keys: ['\u2318', 'N'] },
  { label: 'Save', keys: ['\u2318', 'S'] },
  { label: 'Undo', keys: ['\u2318', 'Z'] },
  { label: 'Redo', keys: ['\u2318', '\u21E7', 'Z'] }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col'>
      <p className='mb-3 text-sm font-medium'>Keyboard Shortcuts</p>
      <Separator />
      <div className='flex flex-col'>
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.label}
            className='flex items-center justify-between border-b py-2.5 last:border-b-0'
          >
            <span className='text-ui-muted-foreground text-sm'>
              {shortcut.label}
            </span>
            <KbdGroup>
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </KbdGroup>
          </div>
        ))}
      </div>
    </div>
  );
}
