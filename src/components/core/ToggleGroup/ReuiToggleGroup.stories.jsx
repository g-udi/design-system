// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'toggle-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', tags: ['autodocs'], ...catalogueMeta('toggle-group') };

export const ReuiToggleGroup1 = { name: 'Basic toggle group', ...pattern(1) };
export const ReuiToggleGroup2 = { name: 'Outline variant', ...pattern(2) };
export const ReuiToggleGroup3 = { name: 'Sizes', ...pattern(3) };
export const ReuiToggleGroup4 = { name: 'Custom spacing', ...pattern(4) };
export const ReuiToggleGroup5 = { name: 'Filter control', ...pattern(5) };
export const ReuiToggleGroup6 = { name: 'Vertical orientation', ...pattern(6) };
export const ReuiToggleGroup7 = { name: 'Text alignment', ...pattern(7) };
export const ReuiToggleGroup8 = { name: 'View mode switching', ...pattern(8) };
export const ReuiToggleGroup9 = { name: 'Vertical settings', ...pattern(9) };
export const ReuiToggleGroup10 = { name: 'Color theme', ...pattern(10) };
export const ReuiToggleGroup11 = { name: 'Font size', ...pattern(11) };
export const ReuiToggleGroup12 = { name: 'Time range filter', ...pattern(12) };
export const ReuiToggleGroup13 = { name: 'Notification channels', ...pattern(13) };
export const ReuiToggleGroup14 = { name: 'Layout columns', ...pattern(14) };
export const ReuiToggleGroup15 = { name: 'Sort direction', ...pattern(15) };
export const ReuiToggleGroup16 = { name: 'Pricing tier', ...pattern(16) };
