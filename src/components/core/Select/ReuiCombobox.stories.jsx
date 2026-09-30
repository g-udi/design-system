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
  name: 'Basic combobox',
  ...pattern(1),
  play: catalogueInteractions['combobox-1']
};
export const ReuiCombobox2 = { name: 'Disabled combobox', ...pattern(2) };
export const ReuiCombobox3 = { name: 'Invalid combobox', ...pattern(3) };
export const ReuiCombobox4 = { name: 'Combobox with clear button', ...pattern(4) };
export const ReuiCombobox5 = { name: 'Combobox with auto highlight', ...pattern(5) };
export const ReuiCombobox6 = { name: 'Grouped combobox', ...pattern(6) };
export const ReuiCombobox7 = { name: 'Grouped combobox with separators', ...pattern(7) };
export const ReuiCombobox8 = { name: 'Combobox with a long list', ...pattern(8) };
export const ReuiCombobox9 = { name: 'Combobox with icon addon', ...pattern(9) };
export const ReuiCombobox10 = { name: 'Combobox inside a popup', ...pattern(10) };
export const ReuiCombobox11 = { name: 'Combobox in a form', ...pattern(11) };
export const ReuiCombobox12 = { name: 'Multi-select combobox', ...pattern(12) };
export const ReuiCombobox13 = { name: 'Disabled multi-select combobox', ...pattern(13) };
export const ReuiCombobox14 = { name: 'Invalid multi-select combobox', ...pattern(14) };
export const ReuiCombobox15 = { name: 'Multi-select with fixed chips', ...pattern(15) };
export const ReuiCombobox16 = { name: 'Combobox with custom items', ...pattern(16) };
export const ReuiCombobox17 = { name: 'Combobox inside a dialog', ...pattern(17) };
export const ReuiCombobox18 = { name: 'Combobox with custom trigger icon', ...pattern(18) };
export const ReuiCombobox19 = { name: 'Multi-select with user tags', ...pattern(19) };
export const ReuiCombobox20 = { name: 'Invisible combobox with member tags', ...pattern(20) };
export const ReuiCombobox21 = { name: 'Status combobox', ...pattern(21) };
export const ReuiCombobox22 = { name: 'Priority combobox', ...pattern(22) };
export const ReuiCombobox23 = { name: 'Lead combobox', ...pattern(23) };
export const ReuiCombobox24 = { name: 'Multi-member combobox', ...pattern(24) };
export const ReuiCombobox25 = { name: 'Date combobox with custom picker', ...pattern(25) };
export const ReuiCombobox26 = { name: 'Multi-label combobox', ...pattern(26) };
export const ReuiCombobox27 = { name: 'Team combobox', ...pattern(27) };
export const ReuiCombobox28 = { name: 'Assignee combobox', ...pattern(28) };
