// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'separator',
  import.meta.glob('../../../../.storybook/fixtures/reui/separator/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/separator/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Separator', tags: ['autodocs'], ...catalogueMeta('separator') };

export const ReuiSeparator1 = { name: 'Horizontal separator for content sections', ...pattern(1) };
export const ReuiSeparator2 = { name: 'Vertical separator for inline elements', ...pattern(2) };
export const ReuiSeparator3 = { name: 'Vertical separator groups related menu items', ...pattern(3) };
export const ReuiSeparator4 = { name: 'Horizontal separator between items in a list', ...pattern(4) };
export const ReuiSeparator5 = { name: 'Separator with centered text label', ...pattern(5) };
export const ReuiSeparator6 = { name: 'Order summary with separators', ...pattern(6) };
