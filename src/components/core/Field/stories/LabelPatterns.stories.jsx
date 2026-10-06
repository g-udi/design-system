import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'label', import.meta.url,
  import.meta.glob('./fixtures/label/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/label/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Field', id: 'core-field', tags: ['autodocs'], ...catalogueMeta('label') };

export const LabelAccessories = {
  name: 'Label accessories',
  ...pattern('accessories', 'Required and optional markers, an info tooltip, a status badge, helper text, a live status dot, a character counter, and a label beside a checkbox.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: /^Bio/ }), 'Designer');
    await expect(canvas.getByText('8/200')).toBeVisible();
    await userEvent.click(canvas.getByText('Accept terms and conditions'));
    await expect(canvas.getByRole('checkbox', { name: 'Accept terms and conditions' })).toHaveAttribute('aria-checked', 'true');
  }
};
export const LabelInlineEdit = {
  name: 'Inline edit',
  ...pattern('inline-edit', 'A label action swaps a read-only value for an input and back.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /edit/i }));
    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Atlas');
    await userEvent.click(canvas.getByRole('button', { name: /save/i }));
    await expect(canvas.getByText('Atlas')).toBeVisible();
  }
};
