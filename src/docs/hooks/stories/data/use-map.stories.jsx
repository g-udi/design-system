import { expect, userEvent, within } from 'storybook/test';
import { verifyMapReset } from '../../../../../tests/hooks/browserChecks.jsx';
import { example, hookMeta } from '../../HookDocs.jsx';
import { DraftMap } from './fixtures/use-map.jsx';
import exampleCode from './fixtures/use-map.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-map.jsx', import.meta.url));

export default {
  title: 'Hooks/Data/useMap',
  id: 'hooks-data-usemap',
  tags: ['autodocs'],
  ...hookMeta('useMap')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <DraftMap />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyMapReset();
    await userEvent.click(canvas.getByRole('button', { name: 'Finish introduction' }));
    await expect(canvas.getByText('Ready')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove conclusion' }));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(canvas.getByText('No sections yet.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
  }
};
