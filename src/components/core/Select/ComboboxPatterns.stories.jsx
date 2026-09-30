import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'combobox',
  import.meta.glob('../../../../.storybook/fixtures/patterns/combobox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/combobox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('combobox') };

// Type to filter, then pick with the keyboard; the popup closes on commit.
const pickWithKeyboard = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('combobox', { name: 'Framework' });
  await userEvent.type(input, 'Svelte');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await expect(input).toHaveValue('SvelteKit');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
};

export const ComboboxPattern1 = {
  name: 'Input options',
  ...pattern(1, 'One field per input option: auto highlight, clear button, icon addon, custom trigger icon, disabled and invalid.'),
  play: pickWithKeyboard
};
export const ComboboxPattern21 = {
  name: 'Property pickers',
  ...pattern(21, 'Button triggers with search inside the popup and custom rows: status and priority glyphs, team marks, an assignee list with groups and an invite action, and multiple members or labels summarised in the trigger. Each "No …" option clears its property.')
};
export const ComboboxPattern12 = { name: 'Multiple selection with chips', ...pattern(12, 'Removable and fixed chips, plus disabled and invalid states.') };
export const ComboboxPattern19 = { name: 'Member tags', ...pattern(19, 'Avatar chips in a boxed field and in a borderless one.') };
export const ComboboxPattern6 = { name: 'Grouped options', ...pattern(6, 'Labelled groups with separators in a list long enough to scroll.') };
export const ComboboxPattern25 = { name: 'Date presets with a custom picker', ...pattern(25) };
export const ComboboxPattern11 = { name: 'Combobox in a form', ...pattern(11) };
export const ComboboxPattern17 = { name: 'Combobox inside a dialog', ...pattern(17) };
