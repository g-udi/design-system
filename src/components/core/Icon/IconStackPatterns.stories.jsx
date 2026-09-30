import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-stack',
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-stack/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-stack/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-stack') };

export const IconStackPattern2 = { name: 'Sizes, colors and badge', ...pattern(2) };
export const IconStackPattern5 = { name: 'In an empty state and list row', ...pattern(5) };
