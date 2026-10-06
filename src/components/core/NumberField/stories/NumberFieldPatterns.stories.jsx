import { expect, userEvent, within, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'number-field', import.meta.url,
  import.meta.glob('./fixtures/number-field/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/number-field/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Advanced Inputs/NumberField', id: 'core-numberfield', tags: ['autodocs'], ...catalogueMeta('number-field') };

const field = (canvasElement, name) => {
  const input = within(canvasElement).getByRole('textbox', { name });
  return { input, root: within(input.closest('[data-slot="number-field"]')) };
};

export const ButtonLayouts = {
  name: 'Button layouts',
  ...pattern('button-layouts', 'Step buttons on either side, both trailing the value, or stacked as spinner chevrons.'),
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
export const Validation = {
  name: 'Form validation', ...pattern('validation'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Amount' });
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(await canvas.findByText('The smallest donation is 10.')).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, '20');
    await userEvent.tab();
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText('Form submitted')).toBeVisible());
    await userEvent.click(body.getByRole('button', { name: /close toast/i }));
  }
};
