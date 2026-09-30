import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'textarea',
  import.meta.glob('../../../../.storybook/fixtures/patterns/textarea/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/textarea/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Textarea', id: 'core-textarea', tags: ['autodocs'], ...catalogueMeta('textarea') };

export const TextareaPattern3 = {
  name: 'Field states',
  ...pattern(3, 'Label and description, a `FieldError` that marks the textarea invalid and describes it, disabled, and read-only.'),
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
export const TextareaPattern6 = { name: 'Auto-resize with character count', ...pattern(6) };
