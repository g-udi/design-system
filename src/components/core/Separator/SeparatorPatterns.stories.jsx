import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'separator',
  import.meta.glob('../../../../.storybook/fixtures/patterns/separator/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/separator/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Separator', tags: ['autodocs'], ...catalogueMeta('separator') };

export const SeparatorPattern6 = { name: 'Horizontal rules', ...pattern(6, 'Rules split a header from its content, divide list rows, and set off a total.') };
export const SeparatorPattern2 = { name: 'Vertical rules', ...pattern(2, 'Vertical rules stretch to the height of a flex row; a fixed height keeps them shorter than two-line items.') };
export const SeparatorPattern5 = { name: 'Text label', ...pattern(5, 'A label on the page background interrupts the rule.') };
