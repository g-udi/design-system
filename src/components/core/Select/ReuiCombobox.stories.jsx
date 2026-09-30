// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'combobox',
  import.meta.glob('../../../../.storybook/fixtures/reui/combobox/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/combobox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('combobox') };

export const ReuiCombobox1 = {
  name: 'Combobox: A basic combobox with a list of options',
  ...pattern(1),
  play: catalogueInteractions['combobox-1']
};
export const ReuiCombobox2 = { name: 'Combobox: A disabled combobox', ...pattern(2) };
export const ReuiCombobox3 = { name: 'Combobox: A combobox in an invalid state', ...pattern(3) };
export const ReuiCombobox4 = { name: 'Combobox: A combobox with a clear button', ...pattern(4) };
export const ReuiCombobox5 = { name: 'Combobox: A combobox with auto-highlight enabled', ...pattern(5) };
export const ReuiCombobox6 = { name: 'Combobox: A combobox with grouped options', ...pattern(6) };
export const ReuiCombobox7 = { name: 'Combobox: A combobox with grouped options and separators', ...pattern(7) };
export const ReuiCombobox8 = { name: 'Combobox: A combobox with a large list of options', ...pattern(8) };
export const ReuiCombobox9 = { name: 'Combobox: A combobox with an icon addon', ...pattern(9) };
export const ReuiCombobox10 = { name: 'Combobox: A combobox rendered inside a popup', ...pattern(10) };
export const ReuiCombobox11 = { name: 'Combobox: A combobox used within a form', ...pattern(11) };
export const ReuiCombobox12 = { name: 'Combobox: A multi-select combobox', ...pattern(12) };
export const ReuiCombobox13 = { name: 'Combobox: A disabled multi-select combobox', ...pattern(13) };
export const ReuiCombobox14 = { name: 'Combobox: A multi-select combobox in an invalid state', ...pattern(14) };
export const ReuiCombobox15 = { name: 'Combobox: A multi-select with chips that cannot be removed', ...pattern(15) };
export const ReuiCombobox16 = { name: 'Combobox: A combobox with custom item rendering', ...pattern(16) };
export const ReuiCombobox17 = { name: 'Combobox: A combobox used within a dialog', ...pattern(17) };
export const ReuiCombobox18 = { name: 'Combobox: A combobox with a custom trigger icon', ...pattern(18) };
export const ReuiCombobox19 = { name: 'Combobox: A multi-select combobox with user tags', ...pattern(19) };
export const ReuiCombobox20 = { name: 'Combobox: Invisible combobox with member tags', ...pattern(20) };
export const ReuiCombobox21 = { name: 'Combobox: A status change combobox', ...pattern(21) };
export const ReuiCombobox22 = { name: 'Combobox: A priority change combobox', ...pattern(22) };
export const ReuiCombobox23 = { name: 'Combobox: A lead selection combobox', ...pattern(23) };
export const ReuiCombobox24 = { name: 'Combobox: A multi-member selection combobox', ...pattern(24) };
export const ReuiCombobox25 = { name: 'Combobox: A date selection combobox with an optional custom picker dialog', ...pattern(25) };
export const ReuiCombobox26 = { name: 'Combobox: A multi-label selection combobox with a no-label mode', ...pattern(26) };
export const ReuiCombobox27 = { name: 'Combobox: A team selection combobox', ...pattern(27) };
export const ReuiCombobox28 = { name: 'Combobox: An assignee selection combobox', ...pattern(28) };
