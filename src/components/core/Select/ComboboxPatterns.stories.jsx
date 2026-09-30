import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'combobox',
  import.meta.glob('../../../../.storybook/fixtures/patterns/combobox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/combobox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('combobox') };

export const ComboboxPattern1 = {
  name: 'Basic combobox',
  ...pattern(1),
  play: catalogueInteractions['combobox-1']
};
export const ComboboxPattern2 = { name: 'Disabled combobox', ...pattern(2) };
export const ComboboxPattern3 = { name: 'Invalid combobox', ...pattern(3) };
export const ComboboxPattern4 = { name: 'Combobox with clear button', ...pattern(4) };
export const ComboboxPattern5 = { name: 'Combobox with auto highlight', ...pattern(5) };
export const ComboboxPattern6 = { name: 'Grouped combobox', ...pattern(6) };
export const ComboboxPattern7 = { name: 'Grouped combobox with separators', ...pattern(7) };
export const ComboboxPattern8 = { name: 'Combobox with a long list', ...pattern(8) };
export const ComboboxPattern9 = { name: 'Combobox with icon addon', ...pattern(9) };
export const ComboboxPattern10 = { name: 'Combobox inside a popup', ...pattern(10) };
export const ComboboxPattern11 = { name: 'Combobox in a form', ...pattern(11) };
export const ComboboxPattern12 = { name: 'Multi-select combobox', ...pattern(12) };
export const ComboboxPattern13 = { name: 'Disabled multi-select combobox', ...pattern(13) };
export const ComboboxPattern14 = { name: 'Invalid multi-select combobox', ...pattern(14) };
export const ComboboxPattern15 = { name: 'Multi-select with fixed chips', ...pattern(15) };
export const ComboboxPattern16 = { name: 'Combobox with custom items', ...pattern(16) };
export const ComboboxPattern17 = { name: 'Combobox inside a dialog', ...pattern(17) };
export const ComboboxPattern18 = { name: 'Combobox with custom trigger icon', ...pattern(18) };
export const ComboboxPattern19 = { name: 'Multi-select with user tags', ...pattern(19) };
export const ComboboxPattern20 = { name: 'Invisible combobox with member tags', ...pattern(20) };
export const ComboboxPattern21 = { name: 'Status combobox', ...pattern(21) };
export const ComboboxPattern22 = { name: 'Priority combobox', ...pattern(22) };
export const ComboboxPattern23 = { name: 'Lead combobox', ...pattern(23) };
export const ComboboxPattern24 = { name: 'Multi-member combobox', ...pattern(24) };
export const ComboboxPattern25 = { name: 'Date combobox with custom picker', ...pattern(25) };
export const ComboboxPattern26 = { name: 'Multi-label combobox', ...pattern(26) };
export const ComboboxPattern27 = { name: 'Team combobox', ...pattern(27) };
export const ComboboxPattern28 = { name: 'Assignee combobox', ...pattern(28) };
