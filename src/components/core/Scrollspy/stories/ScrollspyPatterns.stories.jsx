import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scrollspy', import.meta.url,
  import.meta.glob('./fixtures/scrollspy/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/scrollspy/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Scrollspy', id: 'core-scrollspy', tags: ['autodocs'], ...catalogueMeta('scrollspy') };

export const TopNavigation = { name: 'Top navigation', ...pattern('top-navigation', 'Wrapping section tabs above the content for layouts too narrow for a side rail.') };
