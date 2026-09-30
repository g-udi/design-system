// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'popover',
  import.meta.glob('../../../../.storybook/fixtures/reui/popover/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/popover/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('popover') };

export const ReuiPopover1 = { name: 'Basic popover', ...pattern(1) };
export const ReuiPopover2 = { name: 'Sides', ...pattern(2) };
export const ReuiPopover3 = { name: 'With form', ...pattern(3) };
export const ReuiPopover4 = { name: 'Alignment', ...pattern(4) };
export const ReuiPopover5 = { name: 'Inside a dialog', ...pattern(5) };
export const ReuiPopover6 = { name: 'User profile', ...pattern(6) };
export const ReuiPopover7 = { name: 'Custom content', ...pattern(7) };
export const ReuiPopover8 = { name: 'Media preview', ...pattern(8) };
export const ReuiPopover9 = { name: 'Relative time with time zones', ...pattern(9) };
export const ReuiPopover10 = { name: 'With controls', ...pattern(10) };
export const ReuiPopover11 = { name: 'With navigation', ...pattern(11) };
