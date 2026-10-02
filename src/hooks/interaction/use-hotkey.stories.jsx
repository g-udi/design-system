import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import Kbd from '../../components/core/Kbd';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useHotkey } from './use-hotkey.js';

export default {
  title: 'Hooks/Interaction/useHotkey',
  id: 'hooks-interaction-usehotkey',
  tags: ['autodocs'],
  ...hookMeta('useHotkey')
};

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

export const CommandPalette = {
  name: 'Platform-aware mod key',
  parameters: example("`'mod+k'` is Command+K on macOS and Control+K elsewhere. The button does the same thing, carries `aria-keyshortcuts`, and shows the keys with `Kbd`.", `
import { Button, Kbd } from '@gaudi/design-system';
import { useHotkey } from '@gaudi/design-system/hooks';

export function SearchButton({ onOpen }) {
  const { ariaKeyShortcuts, kbdKeys } = useHotkey('mod+k', onOpen);
  return (
    <Button variant='outline' aria-keyshortcuts={ariaKeyShortcuts} onClick={onOpen}>
      Search posts <Kbd keys={kbdKeys} size='sm' />
    </Button>
  );
}`),
  render: () => <SearchShortcut />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apple = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || '');
    await userEvent.keyboard(apple ? '{Meta>}k{/Meta}' : '{Control>}k{/Control}');
    await waitFor(() => expect(canvas.getByText('Search opened 1 time')).toBeVisible());
    await expect(canvas.getByRole('button', { name: /Search posts/ })).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
  }
};

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

export const SingleKeys = {
  name: 'Single-key shortcuts that can be turned off',
  parameters: example('Plain-key shortcuts skip text fields automatically and, as WCAG 2.1.4 asks, can be switched off through `enabled`. A list of combinations shares one callback, which receives the matched combination.', `
const [enabled, setEnabled] = useState(true);
useHotkey(['j', 'k'], (event, combo) => (combo === 'j' ? next() : previous()), { enabled });
useHotkey('shift+?', openShortcutSheet, { enabled });`),
  render: () => <CommentShortcuts />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: /single-key shortcuts/ }).focus();
    await userEvent.keyboard('j');
    await expect(canvas.getByText('Next comment')).toBeVisible();
    await userEvent.click(canvas.getByRole('textbox', { name: 'Reply' }));
    await userEvent.keyboard('k');
    await expect(canvas.getByText('Next comment')).toBeVisible();
  }
};
