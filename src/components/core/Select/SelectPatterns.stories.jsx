import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'select',
  import.meta.glob('../../../../.storybook/fixtures/patterns/select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('select') };

export const SelectPattern8 = { name: 'Form fields and states', ...pattern(8, 'Label and description, a disabled option, the small trigger, a long list aligned to the selected item, and invalid and disabled fields.') };
export const SelectPattern18 = { name: 'Rich option content', ...pattern(18, 'Icons, status dots, avatars under a group label, badges behind a trigger prefix, flags and font previews.') };
export const SelectPattern28 = { name: 'Grouped options', ...pattern(28, 'Labelled groups split by separators, each option with a muted offset.') };
export const SelectPattern16 = { name: 'Options with descriptions', ...pattern(16, 'Options with a second line: one trigger hides the description to stay on one line, the other grows to show both.') };
export const SelectPattern22 = { name: 'Clearable select', ...pattern(22, 'A controlled select that swaps its chevron for a clear button once a value is picked.') };
export const SelectPattern13 = { name: 'Select in a toolbar', ...pattern(13, 'A status filter sized to its content, sharing a row with a search input.') };
export const SelectPattern11 = { name: 'Select inside a dialog', ...pattern(11, 'The popup layers above the dialog and stays inside its focus trap.') };
