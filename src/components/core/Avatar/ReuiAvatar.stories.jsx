// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'avatar',
  import.meta.glob('../../../../.storybook/fixtures/reui/avatar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/avatar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Avatar', tags: ['autodocs'], ...catalogueMeta('avatar') };

export const ReuiAvatar1 = { name: 'Basic avatar', ...pattern(1) };
export const ReuiAvatar2 = { name: 'Avatar with fallback', ...pattern(2) };
export const ReuiAvatar3 = { name: 'Avatars with different sizes', ...pattern(3) };
export const ReuiAvatar4 = { name: 'Avatars with different border radiuses', ...pattern(4) };
export const ReuiAvatar5 = { name: 'Avatars with custom sizes', ...pattern(5) };
export const ReuiAvatar6 = { name: 'Avatar with an online status badge', ...pattern(6) };
export const ReuiAvatar7 = { name: 'Avatar with badge icon', ...pattern(7) };
export const ReuiAvatar8 = { name: 'Avatar with different badge positions', ...pattern(8) };
export const ReuiAvatar9 = { name: 'Avatar with different badge positions', ...pattern(9) };
export const ReuiAvatar10 = { name: 'Basic avatar group', ...pattern(10) };
export const ReuiAvatar11 = { name: 'Avatar group with numerical count', ...pattern(11) };
export const ReuiAvatar12 = { name: 'Avatar group with an icon count', ...pattern(12) };
export const ReuiAvatar13 = { name: 'Avatar with a distinct border ring', ...pattern(13) };
export const ReuiAvatar14 = { name: 'Avatar with light background color fallback', ...pattern(14) };
export const ReuiAvatar15 = { name: 'Avatar with a solid background color fallback', ...pattern(15) };
export const ReuiAvatar16 = { name: 'Avatar with user details and badge', ...pattern(16) };
export const ReuiAvatar17 = { name: 'Avatar with grayscale image filter', ...pattern(17) };
export const ReuiAvatar18 = { name: 'Avatar group with online status on one', ...pattern(18) };
export const ReuiAvatar19 = { name: 'Avatar inside small outline button', ...pattern(19) };
export const ReuiAvatar20 = { name: 'Avatar social proof with text label', ...pattern(20) };
export const ReuiAvatar21 = { name: 'Compact social proof with initials', ...pattern(21) };
export const ReuiAvatar22 = { name: 'Avatar group with hover tooltips and lift effect', ...pattern(22) };
export const ReuiAvatar23 = { name: 'Avatar group with hover effect', ...pattern(23) };
export const ReuiAvatar24 = { name: 'Avatar group with hover effect and tooltips', ...pattern(24) };
export const ReuiAvatar25 = { name: 'Avatar group with numerical count', ...pattern(25) };
export const ReuiAvatar26 = { name: 'Pilled small outline button with avatar', ...pattern(26) };
export const ReuiAvatar27 = { name: 'Pilled small button with avatar', ...pattern(27) };
export const ReuiAvatar28 = { name: 'Avatar inside an empty state example', ...pattern(28) };
export const ReuiAvatar29 = { name: 'Avatar group with icon count and button', ...pattern(29) };
export const ReuiAvatar30 = { name: 'Avatar with loading state demonstration', ...pattern(30) };
export const ReuiAvatar31 = { name: 'Avatar with custom badge', ...pattern(31) };
export const ReuiAvatar32 = { name: 'Avatar with ring animation', ...pattern(32) };
export const ReuiAvatar33 = { name: 'Avatar with gradient animated ring', ...pattern(33) };
export const ReuiAvatar34 = { name: 'Avatar with multiple badges', ...pattern(34) };
export const ReuiAvatar35 = { name: 'Compact avatar dropdown menu', ...pattern(35) };
