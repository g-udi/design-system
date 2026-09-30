// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'scroll-area',
  import.meta.glob('../../../../.storybook/fixtures/reui/scroll-area/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/scroll-area/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ScrollArea', tags: ['autodocs'], ...catalogueMeta('scroll-area') };

export const ReuiScrollArea1 = { name: 'Basic scroll area', ...pattern(1) };
export const ReuiScrollArea2 = { name: 'Scroll area with horizontal scrollbar', ...pattern(2) };
export const ReuiScrollArea3 = { name: 'Scroll area with both scrollbars', ...pattern(3) };
export const ReuiScrollArea4 = { name: 'Scroll area with fade effect', ...pattern(4) };
export const ReuiScrollArea5 = { name: 'Scroll area with scrollbar gutter', ...pattern(5) };
