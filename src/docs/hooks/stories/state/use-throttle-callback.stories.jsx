import { expect, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { PointerTracker } from './fixtures/use-throttle-callback.jsx';
import exampleCode from './fixtures/use-throttle-callback.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-throttle-callback.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useThrottleCallback',
  id: 'hooks-state-usethrottlecallback',
  tags: ['autodocs'],
  ...hookMeta('useThrottleCallback')
};

export const PointerMoves = {
  name: 'Throttle pointer moves',
  parameters: example('Dozens of pointer events become at most five updates a second, and the trailing call keeps the final position exact.', exampleSource),
  render: () => <PointerTracker />,
  play: async ({ canvasElement }) => {
    const { act } = await import('../../../../../tests/support/reactAct.js');
    const canvas = within(canvasElement);
    const target = canvas.getByText('Move the pointer here');
    const bounds = target.getBoundingClientRect();
    await act(() => {
      for (let index = 1; index <= 20; index += 1) {
        target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: bounds.left + index, clientY: bounds.top + index }));
      }
    });
    await expect(canvas.getByText('Pointer events:').parentElement).toHaveTextContent('20');
    const updates = canvas.getByText('Throttled updates:').parentElement;
    await waitFor(() => expect(updates).toHaveTextContent('last at 20, 20'));
    await expect(Number(updates.textContent.match(/updates: (\d+)/)[1])).toBeLessThan(20);
  }
};
