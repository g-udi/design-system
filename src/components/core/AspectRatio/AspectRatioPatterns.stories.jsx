import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'aspect-ratio',
  import.meta.glob('../../../../.storybook/fixtures/patterns/aspect-ratio/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/aspect-ratio/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/AspectRatio', tags: ['autodocs'], ...catalogueMeta('aspect-ratio') };

export const AspectRatioPattern1 = { name: 'Common ratios', ...pattern(1, 'Eight media shapes side by side, from a 21:9 banner to a 9:16 story.') };
