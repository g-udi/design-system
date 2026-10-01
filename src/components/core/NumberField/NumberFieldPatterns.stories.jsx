import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'number-field',
  import.meta.glob('../../../../.storybook/fixtures/patterns/number-field/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/number-field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Advanced Inputs/NumberField', id: 'core-numberfield', tags: ['autodocs'], ...catalogueMeta('number-field') };

const field = (canvasElement, name) => {
  const input = within(canvasElement).getByRole('textbox', { name });
  return { input, root: within(input.closest('[data-slot="number-field"]')) };
};

export const NumberFieldPattern1 = {
  name: 'Button layouts',
  ...pattern(1, 'Step buttons on either side, both trailing the value, or stacked as spinner chevrons.'),
  play: async ({ canvasElement }) => {
    const { input, root } = field(canvasElement, 'Quantity');
    await expect(input).toHaveValue('5');
    await userEvent.click(root.getByRole('button', { name: /increase|increment/i }));
    await expect(input).toHaveValue('6');
    // Typing past `max` clamps on blur and disables the increment.
    await userEvent.clear(input);
    await userEvent.type(input, '150');
    await userEvent.tab();
    await expect(input).toHaveValue('100');
    await expect(root.getByRole('button', { name: /increase|increment/i })).toHaveAttribute('aria-disabled', 'true');
    const spinner = field(canvasElement, 'Replicas');
    await userEvent.click(spinner.root.getByRole('button', { name: /decrease|decrement/i }));
    await expect(spinner.input).toHaveValue('2');
  }
};
export const NumberFieldPattern6 = { name: 'Form validation', ...pattern(6) };
