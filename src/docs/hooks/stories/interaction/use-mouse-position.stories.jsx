import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { PointerReadout } from './fixtures/use-mouse-position.jsx';
import exampleCode from './fixtures/use-mouse-position.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-mouse-position.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useMousePosition',
  id: 'hooks-interaction-usemouseposition',
  tags: ['autodocs'],
  ...hookMeta('useMousePosition')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <PointerReadout />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByRole('region', { name: 'Pointer tracking area' });
    const bounds = target.getBoundingClientRect();
    target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: bounds.left + 20, clientY: bounds.top + 30 }));
    await waitFor(() => expect(canvas.getByLabelText('Pointer sample')).toHaveTextContent('Local position: 20, 30 · Inside'));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause tracking' }));
    const paused = canvas.getByLabelText('Pointer sample').textContent;
    target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 0, clientY: 0 }));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await expect(canvas.getByLabelText('Pointer sample')).toHaveTextContent(paused);
    await userEvent.click(canvas.getByRole('button', { name: 'Resume tracking' }));
  }
};
