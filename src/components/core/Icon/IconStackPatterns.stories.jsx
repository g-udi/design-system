import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-stack',
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-stack/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-stack/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-stack') };

export const IconStackPattern1 = { name: 'Isometric icon stack', ...pattern(1) };
export const IconStackPattern2 = { name: 'Icon stack sizes', ...pattern(2) };
export const IconStackPattern3 = { name: 'Icon stack colors', ...pattern(3) };
export const IconStackPattern4 = { name: 'Icon stack with badge', ...pattern(4) };
export const IconStackPattern5 = { name: 'Icon stack in an empty state', ...pattern(5) };
export const IconStackPattern6 = { name: 'Icon stack in an item', ...pattern(6) };
