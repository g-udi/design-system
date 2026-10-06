import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { HoverRecovery, PausingTips } from './fixtures/use-hover.jsx';
import exampleCode from './fixtures/use-hover.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-hover.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useHover',
  id: 'hooks-interaction-usehover',
  tags: ['autodocs'],
  ...hookMeta('useHover')
};

export const PauseOnHover = {
  name: 'Pause rotating content',
  parameters: example('Rotation pauses while a mouse is over the card or anything in it has focus, so hover is never the only way to stop it.', exampleSource),
  render: () => <PausingTips />,
  play: async ({ canvasElement, mount }) => {
    const probe = await mount(<HoverRecovery />);
    await userEvent.hover(probe.getByRole('button', { name: 'Disable hover' }));
    await expect(probe.getByText('Pointer detected')).toBeVisible();
    await userEvent.click(probe.getByRole('button', { name: 'Disable hover' }));
    await waitFor(() => expect(probe.getByText('No pointer hover')).toBeVisible());
    await userEvent.click(probe.getByRole('button', { name: 'Enable hover' }));
    await expect(probe.getByText('No pointer hover')).toBeVisible();

    await mount(<PausingTips />);
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByText('Accessibility tip'));
    await expect(canvas.getByText('Paused while you point at or focus it')).toBeVisible();
    await userEvent.unhover(canvas.getByText('Accessibility tip'));
    await expect(canvas.getByText('Rotating every 3 seconds')).toBeVisible();
  }
};
