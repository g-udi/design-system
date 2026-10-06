import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { FormattingToolbar, SettingsNav } from './fixtures/use-arrow-key-nav.jsx';
import exampleCode from './fixtures/use-arrow-key-nav.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-arrow-key-nav.jsx', import.meta.url));

export default {
  title: 'Hooks/A11y/useArrowKeyNav',
  id: 'hooks-a11y-usearrowkeynav',
  tags: ['autodocs'],
  ...hookMeta('useArrowKeyNav')
};

export const Toolbar = {
  name: 'Toolbar',
  parameters: example('A formatting toolbar is one Tab stop; Left and Right move between tools, Home and End jump to the ends, and `wrap` loops around. `role: \'toolbar\'` adds `aria-orientation`.', exampleSource),
  render: () => <FormattingToolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await expect(bold).toHaveAttribute('tabindex', '0');
    bold.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Link' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(bold).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveAttribute('tabindex', '-1');
  }
};

export const VerticalList = {
  name: 'Vertical section list',
  parameters: example('A settings menu moves with Up and Down. Without `wrap`, the ends stop. Enter or Space still clicks the focused button.', exampleSource),
  render: () => <SettingsNav />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Profile' }).focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: 'Profile' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByRole('button', { name: 'Billing' })).toHaveAttribute('aria-current', 'page');
  }
};
