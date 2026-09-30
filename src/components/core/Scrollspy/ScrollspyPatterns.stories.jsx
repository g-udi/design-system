import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scrollspy',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scrollspy/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scrollspy/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Scrollspy', tags: ['autodocs'], ...catalogueMeta('scrollspy') };

export const ScrollspyPattern2 = { name: 'Top navigation', ...pattern(2, 'Wrapping section tabs above the content for layouts too narrow for a side rail.') };
