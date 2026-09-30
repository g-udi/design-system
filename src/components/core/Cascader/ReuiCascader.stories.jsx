// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'cascader',
  import.meta.glob('../../../../.storybook/fixtures/reui/cascader/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/cascader/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Cascader', tags: ['autodocs'], ...catalogueMeta('cascader') };

export const ReuiCascader1 = { name: 'Nested attribute picker with drill-down navigation', ...pattern(1) };
export const ReuiCascader2 = { name: 'Multi-select permissions with checkboxes and a selection cap', ...pattern(2) };
export const ReuiCascader3 = { name: 'Deep search across every level with path-annotated results', ...pattern(3) };
export const ReuiCascader4 = { name: 'Pinned footer with a side-anchored import flyout', ...pattern(4) };
export const ReuiCascader5 = { name: 'Custom rows with avatars and role badges', ...pattern(5, 'Custom rows pairing avatars with outline role badges that color-code seniority.') };
export const ReuiCascader6 = { name: 'Trigger path formatting and collapsing', ...pattern(6) };
export const ReuiCascader7 = { name: 'Embedded panel without a popover', ...pattern(7) };
export const ReuiCascader8 = { name: 'Flat adjacency data with a parent pointer', ...pattern(8) };
export const ReuiCascader9 = { name: 'Controlled path, value, query and open state', ...pattern(9, 'External buttons jump the panel to a level, reset it to the root and clear the selection, with all four controlled props printed under the control.') };
export const ReuiCascader10 = { name: 'Translated labels across a country picker', ...pattern(10, 'A German country picker where every string the primitive renders comes from labels, including the live-region announcements, with each flag in an IconTile.') };
export const ReuiCascader11 = { name: 'Two-line rows with descriptions and a disabled option', ...pattern(11) };
export const ReuiCascader12 = { name: 'Form field that submits like a native input', ...pattern(12) };
export const ReuiCascader13 = { name: 'Columns mode with independently scrolling panels', ...pattern(13, 'A media library in Miller columns where all three panes overflow and each scrolls on its own.') };
export const ReuiCascader14 = { name: 'Tree mode with inline expand and multi-select scopes', ...pattern(14) };
export const ReuiCascader15 = { name: 'Async drill-down that loads before it navigates', ...pattern(15) };
export const ReuiCascader16 = { name: 'Virtualized level with thousands of rows', ...pattern(16, 'Six unevenly sized regions of country markets, windowed so only the visible rows ever mount.') };
export const ReuiCascader17 = { name: 'Consumer-rendered removable chips with path-aware labels', ...pattern(17, 'Chips rendered outside the primitive from useCascaderSelection, each carrying its full path so repeated column names stay distinct.') };
export const ReuiCascader18 = { name: 'Cascading tree multi-select inside a popover', ...pattern(18, 'A cascading tree with indeterminate branches in a popover, bounded by the positioner\'s available height.') };
export const ReuiCascader19 = { name: 'Status and priority colour dots via renderLabel', ...pattern(19) };
export const ReuiCascader20 = { name: 'Expense accounts with a colour inherited down each branch', ...pattern(20) };
