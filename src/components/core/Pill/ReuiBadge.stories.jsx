// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'badge',
  import.meta.glob('../../../../.storybook/fixtures/reui/badge/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/badge/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pill', tags: ['autodocs'], ...catalogueMeta('badge') };

export const ReuiBadge1 = { name: 'Default badge', ...pattern(1) };
export const ReuiBadge2 = { name: 'Secondary badge', ...pattern(2) };
export const ReuiBadge3 = { name: 'Destructive badge', ...pattern(3) };
export const ReuiBadge4 = { name: 'Success badge', ...pattern(4) };
export const ReuiBadge5 = { name: 'Info badge', ...pattern(5) };
export const ReuiBadge6 = { name: 'Warning badge', ...pattern(6) };
export const ReuiBadge7 = { name: 'Outline badge', ...pattern(7) };
export const ReuiBadge8 = { name: 'Primary outline badge', ...pattern(8) };
export const ReuiBadge9 = { name: 'Destructive outline badge', ...pattern(9) };
export const ReuiBadge10 = { name: 'Info outline badge', ...pattern(10) };
export const ReuiBadge11 = { name: 'Success outline badge', ...pattern(11) };
export const ReuiBadge12 = { name: 'Warning outline badge', ...pattern(12) };
export const ReuiBadge13 = { name: 'Primary light badge', ...pattern(13) };
export const ReuiBadge14 = { name: 'Destructive light badge', ...pattern(14) };
export const ReuiBadge15 = { name: 'Success light badge', ...pattern(15) };
export const ReuiBadge16 = { name: 'Info light badge', ...pattern(16) };
export const ReuiBadge17 = { name: 'Warning light badge', ...pattern(17) };
export const ReuiBadge18 = { name: 'Badge sizes', ...pattern(18) };
export const ReuiBadge19 = { name: 'Count and label badges', ...pattern(19) };
export const ReuiBadge20 = { name: 'Badge with icon', ...pattern(20) };
export const ReuiBadge21 = { name: 'Dismissible badge', ...pattern(21) };
export const ReuiBadge22 = { name: 'Badge with status dot', ...pattern(22) };
export const ReuiBadge23 = { name: 'Badge as a link', ...pattern(23) };
export const ReuiBadge24 = { name: 'Badge with avatar', ...pattern(24) };
export const ReuiBadge25 = { name: 'Badge with flag', ...pattern(25) };
