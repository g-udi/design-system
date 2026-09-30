// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'separator',
  import.meta.glob('../../../../.storybook/fixtures/reui/separator/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/separator/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Separator', tags: ['autodocs'], ...catalogueMeta('separator') };

export const ReuiSeparator1 = { name: 'Between sections', ...pattern(1) };
export const ReuiSeparator2 = { name: 'Inline links', ...pattern(2, 'Vertical rules stretch to the height of a flex row.') };
export const ReuiSeparator3 = { name: 'Grouped menu items', ...pattern(3, 'A fixed height keeps vertical rules shorter than two-line items.') };
export const ReuiSeparator4 = { name: 'List dividers', ...pattern(4) };
export const ReuiSeparator5 = { name: 'Text label', ...pattern(5, 'A label on the page background interrupts the rule.') };
export const ReuiSeparator6 = { name: 'Order summary', ...pattern(6) };
