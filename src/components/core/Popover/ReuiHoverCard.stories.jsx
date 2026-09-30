// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'hover-card',
  import.meta.glob('../../../../.storybook/fixtures/reui/hover-card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/hover-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('hover-card') };

export const ReuiHoverCard1 = { name: 'Hover Card: Basic hover card', ...pattern(1) };
export const ReuiHoverCard2 = { name: 'Hover Card: Hover card with positions', ...pattern(2) };
export const ReuiHoverCard3 = { name: 'Hover Card: Hover card with profile information', ...pattern(3) };
export const ReuiHoverCard4 = { name: 'Hover Card: Hover card with icon', ...pattern(4) };
export const ReuiHoverCard5 = { name: 'Hover Card: Hover card with an image and text content', ...pattern(5) };
export const ReuiHoverCard6 = { name: 'Hover Card: Hover card inside a dialog', ...pattern(6) };
export const ReuiHoverCard7 = { name: 'Hover Card: Timestamp hover card with active relative time', ...pattern(7) };
export const ReuiHoverCard8 = { name: 'Hover Card: Hover card with paginated release notes', ...pattern(8) };
