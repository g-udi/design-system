import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { Quantity, ControlledSeats } from './fixtures/use-controllable-state.jsx';
import exampleCode from './fixtures/use-controllable-state.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-controllable-state.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useControllableState',
  id: 'hooks-state-usecontrollablestate',
  tags: ['autodocs'],
  ...hookMeta('useControllableState')
};

export const Uncontrolled = {
  name: 'Uncontrolled',
  parameters: example('Without `value` the component keeps its own state, starting from `defaultValue`.', exampleSource),
  render: () => <Quantity label='Tickets' defaultValue={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'More tickets' }));
    await expect(canvas.getByText('3')).toBeVisible();
  }
};

export const Controlled = {
  name: 'Controlled, with the host refusing changes',
  parameters: example('With `value` the host owns the state. Each change is only an offer through `onChange`; here the host refuses more than four seats.', exampleSource),
  render: () => <ControlledSeats />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const more = canvas.getByRole('button', { name: 'More seats' });
    await userEvent.click(more);
    await userEvent.click(more);
    await userEvent.click(more);
    await expect(canvas.getByText('4')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Fewer seats' }));
    await expect(canvas.getByText('3')).toBeVisible();
  }
};
