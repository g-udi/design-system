// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'badge',
  import.meta.glob('../../../../.storybook/fixtures/reui/badge/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/badge/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pill', tags: ['autodocs'], ...catalogueMeta('badge') };

export const ReuiBadge1 = { name: 'Badge: Default badge', ...pattern(1) };
export const ReuiBadge2 = { name: 'Badge: Secondary badge', ...pattern(2) };
export const ReuiBadge3 = { name: 'Badge: Destructive badge', ...pattern(3) };
export const ReuiBadge4 = { name: 'Badge: Success badge', ...pattern(4) };
export const ReuiBadge5 = { name: 'Badge: Info badge', ...pattern(5) };
export const ReuiBadge6 = { name: 'Badge: Warning badge', ...pattern(6) };
export const ReuiBadge7 = { name: 'Badge: Outline badge', ...pattern(7) };
export const ReuiBadge8 = { name: 'Badge: Primary outline badge', ...pattern(8) };
export const ReuiBadge9 = { name: 'Badge: Destructive outline badge', ...pattern(9) };
export const ReuiBadge10 = { name: 'Badge: Info outline badge', ...pattern(10) };
export const ReuiBadge11 = { name: 'Badge: Success outline badge', ...pattern(11) };
export const ReuiBadge12 = { name: 'Badge: Warning outline badge', ...pattern(12) };
export const ReuiBadge13 = { name: 'Badge: Primary light badge', ...pattern(13) };
export const ReuiBadge14 = { name: 'Badge: Destructive light badge', ...pattern(14) };
export const ReuiBadge15 = { name: 'Badge: Success light badge', ...pattern(15) };
export const ReuiBadge16 = { name: 'Badge: Info light badge', ...pattern(16) };
export const ReuiBadge17 = { name: 'Badge: Warning light badge', ...pattern(17) };
export const ReuiBadge18 = { name: 'Badge: Badge size variations', ...pattern(18) };
export const ReuiBadge19 = { name: 'Badge: Badge with full radius (radius="full")', ...pattern(19) };
export const ReuiBadge20 = { name: 'Badge: Badge with an icon', ...pattern(20) };
export const ReuiBadge21 = { name: 'Badge: Badge with a dismiss button', ...pattern(21) };
export const ReuiBadge22 = { name: 'Badge: Badge with a status dot', ...pattern(22) };
export const ReuiBadge23 = { name: 'Badge: Badge rendered as a link', ...pattern(23) };
export const ReuiBadge24 = { name: 'Badge: Badge with avatar', ...pattern(24) };
export const ReuiBadge25 = { name: 'Badge: Badge with flag image', ...pattern(25) };
