import { expect, userEvent, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { ShareDialog, Details } from './fixtures/use-disclosure.jsx';
import exampleCode from './fixtures/use-disclosure.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-disclosure.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useDisclosure',
  id: 'hooks-state-usedisclosure',
  tags: ['autodocs'],
  ...hookMeta('useDisclosure')
};

export const WithDialog = {
  name: 'Drive a Gaudi Dialog',
  parameters: example('Gaudi overlays take `open` and `onOpenChange`, so pass the state straight through; `onOpen` and `onClose` read well in handlers.', exampleSource),
  render: () => <ShareDialog />
};

export const CustomTrigger = {
  name: 'Custom disclosure',
  parameters: example('`getTriggerProps()` adds `aria-expanded`, `aria-controls` and the toggle to your own button.', exampleSource),
  render: () => <Details />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show the citation' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('button', { name: 'Hide the citation' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/Calm technology/)).toBeVisible();
  }
};
