import { expect, userEvent, within } from 'storybook/test';
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
export const AutoResize = { name: 'Growing note field with a counter', ...pattern('auto-resize') };
