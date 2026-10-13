import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import Kbd from '@gaudi/design-system/core/Kbd';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

function SearchShortcut() {
  const [ opened, setOpened ] = useState(0);
  const { ariaKeyShortcuts, kbdKeys } = useHotkey('mod+k', () => setOpened((count) => count + 1));
  return (
    <div className='grid gap-3'>
      <Button variant='outline' tone='neutral' className='w-fit gap-3' aria-keyshortcuts={ariaKeyShortcuts} onClick={() => setOpened((count) => count + 1)}>
        Search posts <Kbd keys={kbdKeys} size='sm' />
      </Button>
      <Readout live>{opened ? `Search opened ${opened} ${opened === 1 ? 'time' : 'times'}` : 'Press the shortcut or the button'}</Readout>
    </div>
  );
}

function CommentShortcuts() {
  const [ shortcutsOn, setShortcutsOn ] = useState(true);
  const [ last, setLast ] = useState('none');
  useHotkey([ 'j', 'k' ], (_, combo) => setLast(combo === 'j' ? 'Next comment' : 'Previous comment'), { enabled: shortcutsOn });
  useHotkey('shift+?', () => setLast('Show shortcuts'), { enabled: shortcutsOn });
  return (
    <div className='grid gap-3'>
      <p className='flex flex-wrap items-center gap-2 text-sm'>
        <Kbd>J</Kbd> next, <Kbd>K</Kbd> previous, <Kbd keys='shift,?' /> shortcuts. Typing in the field below does not trigger them.
      </p>
      <Field>
        <FieldLabel>Reply</FieldLabel>
        <Input placeholder='Type j or k here' />
      </Field>
      <div className='flex flex-wrap items-center gap-3'>
        <Button size='sm' variant='outline' tone='neutral' aria-pressed={shortcutsOn} onClick={() => setShortcutsOn(!shortcutsOn)}>
          {shortcutsOn ? 'Turn off single-key shortcuts' : 'Turn on single-key shortcuts'}
        </Button>
        <Readout label='Last action'>{last}</Readout>
      </div>
    </div>
  );
}

export { SearchShortcut, CommentShortcuts };
