// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'toggle-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', tags: ['autodocs'], ...catalogueMeta('toggle-group') };

export const ReuiToggleGroup1 = { name: 'Basic toggle group', ...pattern(1) };
export const ReuiToggleGroup2 = { name: 'Toggle group with outline variant', ...pattern(2) };
export const ReuiToggleGroup3 = { name: 'Toggle groups in different sizes', ...pattern(3) };
export const ReuiToggleGroup4 = { name: 'Toggle group with custom spacing', ...pattern(4) };
export const ReuiToggleGroup5 = { name: 'Toggle group with filter control', ...pattern(5) };
export const ReuiToggleGroup6 = { name: 'Toggle group with vertical orientation', ...pattern(6) };
export const ReuiToggleGroup7 = { name: 'Toggle group for text alignment', ...pattern(7) };
export const ReuiToggleGroup8 = { name: 'Toggle group for view mode switching', ...pattern(8) };
export const ReuiToggleGroup9 = { name: 'Vertical toggle group for settings', ...pattern(9) };
export const ReuiToggleGroup10 = { name: 'Toggle group for color theme', ...pattern(10) };
export const ReuiToggleGroup11 = { name: 'Toggle group for font size', ...pattern(11) };
export const ReuiToggleGroup12 = { name: 'Toggle group for time range filter', ...pattern(12) };
export const ReuiToggleGroup13 = { name: 'Toggle group for notification channels', ...pattern(13) };
export const ReuiToggleGroup14 = { name: 'Toggle group for layout columns', ...pattern(14) };
export const ReuiToggleGroup15 = { name: 'Toggle group for sort direction', ...pattern(15) };
export const ReuiToggleGroup16 = { name: 'Toggle group for pricing tier', ...pattern(16) };
