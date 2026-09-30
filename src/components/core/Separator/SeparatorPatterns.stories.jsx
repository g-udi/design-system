import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'separator',
  import.meta.glob('../../../../.storybook/fixtures/patterns/separator/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/separator/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Separator', tags: ['autodocs'], ...catalogueMeta('separator') };

export const SeparatorPattern1 = { name: 'Between sections', ...pattern(1) };
export const SeparatorPattern2 = { name: 'Inline links', ...pattern(2, 'Vertical rules stretch to the height of a flex row.') };
export const SeparatorPattern3 = { name: 'Grouped menu items', ...pattern(3, 'A fixed height keeps vertical rules shorter than two-line items.') };
export const SeparatorPattern4 = { name: 'List dividers', ...pattern(4) };
export const SeparatorPattern5 = { name: 'Text label', ...pattern(5, 'A label on the page background interrupts the rule.') };
export const SeparatorPattern6 = { name: 'Order summary', ...pattern(6) };
