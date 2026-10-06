import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'aspect-ratio', import.meta.url,
  import.meta.glob('./fixtures/aspect-ratio/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/aspect-ratio/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/AspectRatio', id: 'core-aspectratio', tags: ['autodocs'], ...catalogueMeta('aspect-ratio') };

export const CommonRatios = { name: 'Common ratios', ...pattern('common-ratios', 'Eight media shapes side by side, from a 21:9 banner to a 9:16 story.') };
