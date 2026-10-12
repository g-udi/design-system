import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'textarea', import.meta.url,
  import.meta.glob('./fixtures/textarea/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/textarea/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Textarea', id: 'core-textarea', tags: ['autodocs'], ...catalogueMeta('textarea') };

export const FieldStates = {
  name: 'Field states',
  ...pattern('field-states', 'Label and description, a `FieldError` that marks the textarea invalid and describes it, disabled, and read-only.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const invalid = canvas.getByRole('textbox', { name: 'Review notes' });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription('Add a reason before returning this draft.');
    await expect(canvas.getByRole('textbox', { name: 'Internal memo' })).toBeDisabled();
    const readOnly = canvas.getByRole('textbox', { name: 'Published summary' });
    const summary = readOnly.value;
    await userEvent.type(readOnly, ' Edited');
    await expect(readOnly).toHaveValue(summary);
    await expect(readOnly).toHaveFocus();
  }
};
export const AutoResize = {
  name: 'Growing note field with a counter', ...pattern('auto-resize'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Bio' });
    const initialHeight = input.getBoundingClientRect().height;
    await userEvent.type(input, 'A line\n'.repeat(20));
    await expect(canvas.getByText('140/280')).toBeVisible();
    await waitFor(() => expect(input.getBoundingClientRect().height).toBeGreaterThan(initialHeight));
    await userEvent.type(input, 'a'.repeat(160));
    await expect(input.value).toHaveLength(280);
    await expect(canvas.getByText('280/280')).toBeVisible();
    await userEvent.clear(input);
    await expect(canvas.getByText('0/280')).toBeVisible();
    await waitFor(() => expect(input.getBoundingClientRect().height).toBe(initialHeight));
  }
};
