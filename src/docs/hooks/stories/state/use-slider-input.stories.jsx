import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { ReadingTimeRange } from './fixtures/use-slider-input.jsx';
import exampleCode from './fixtures/use-slider-input.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-slider-input.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useSliderInput',
  id: 'hooks-state-usesliderinput',
  tags: ['autodocs'],
  ...hookMeta('useSliderInput')
};

export const RangeWithInputs = {
  name: 'Range slider with exact inputs',
  parameters: example('Dragging updates both inputs; typed values are clamped to the bounds and to the other thumb when the field is left or Enter is pressed.', exampleSource),
  render: () => <ReadingTimeRange />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const longest = canvas.getByRole('textbox', { name: 'Longest (minutes)' });
    const shortest = canvas.getByRole('textbox', { name: 'Shortest (minutes)' });
    await userEvent.clear(longest);
    await expect(longest).toHaveValue('');
    await userEvent.type(longest, '50{Enter}');
    await expect(longest).toHaveValue('50');
    await userEvent.clear(longest);
    await userEvent.tab();
    await expect(longest).toHaveValue('50');
    await userEvent.clear(shortest);
    await userEvent.type(shortest, '80{Enter}');
    await expect(shortest).toHaveValue('50');
    await expect(canvas.getAllByRole('slider')[0]).toHaveAttribute('aria-valuenow', '50');
  }
};
