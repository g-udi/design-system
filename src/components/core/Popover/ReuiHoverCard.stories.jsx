// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'hover-card',
  import.meta.glob('../../../../.storybook/fixtures/reui/hover-card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/hover-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('hover-card') };

export const ReuiHoverCard1 = { name: 'Basic hover card', ...pattern(1) };
export const ReuiHoverCard2 = { name: 'Hover card positions', ...pattern(2) };
export const ReuiHoverCard3 = { name: 'Profile hover card', ...pattern(3) };
export const ReuiHoverCard4 = { name: 'Hover card with icon', ...pattern(4) };
export const ReuiHoverCard5 = { name: 'Hover card with image', ...pattern(5) };
export const ReuiHoverCard6 = { name: 'Hover card inside a dialog', ...pattern(6) };
export const ReuiHoverCard7 = { name: 'Relative timestamp hover card', ...pattern(7) };
export const ReuiHoverCard8 = { name: 'Paginated release notes hover card', ...pattern(8) };
