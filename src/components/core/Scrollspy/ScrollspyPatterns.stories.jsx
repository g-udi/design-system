import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scrollspy',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scrollspy/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scrollspy/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Scrollspy', tags: ['autodocs'], ...catalogueMeta('scrollspy') };

export const ScrollspyPattern1 = { name: 'Side navigation', ...pattern(1, 'Anchors beside a scroll area mark the section in view.') };
export const ScrollspyPattern2 = { name: 'Top navigation', ...pattern(2, 'Wrapping anchors above the content for narrow layouts.') };
