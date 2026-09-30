// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'scroll-area',
  import.meta.glob('../../../../.storybook/fixtures/reui/scroll-area/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/scroll-area/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ScrollArea', tags: ['autodocs'], ...catalogueMeta('scroll-area') };

export const ReuiScrollArea1 = { name: 'Vertical list', ...pattern(1) };
export const ReuiScrollArea2 = { name: 'Horizontal gallery', ...pattern(2, 'Add a horizontal `ScrollBar` for content wider than the frame.') };
export const ReuiScrollArea3 = { name: 'Wide table', ...pattern(3, 'A table that overflows both axes keeps its scrollbars inside the frame.') };
export const ReuiScrollArea4 = { name: 'Edge fade', ...pattern(4, 'Masks fade the edges that still have content to scroll to.') };
export const ReuiScrollArea5 = { name: 'Scrollbar gutter', ...pattern(5, 'Padding appears only on an axis that overflows, so the scrollbar never covers content.') };
