import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'aspect-ratio',
  import.meta.glob('../../../../.storybook/fixtures/patterns/aspect-ratio/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/aspect-ratio/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/AspectRatio', tags: ['autodocs'], ...catalogueMeta('aspect-ratio') };

export const AspectRatioPattern1 = { name: '16:9 widescreen', ...pattern(1) };
export const AspectRatioPattern2 = { name: '4:3 standard', ...pattern(2) };
export const AspectRatioPattern3 = { name: '1:1 square', ...pattern(3) };
export const AspectRatioPattern4 = { name: '21:9 ultrawide', ...pattern(4) };
export const AspectRatioPattern5 = { name: '9:16 portrait', ...pattern(5) };
export const AspectRatioPattern6 = { name: '3:2 photography', ...pattern(6) };
export const AspectRatioPattern7 = { name: '4:5 social portrait', ...pattern(7) };
export const AspectRatioPattern8 = { name: '16:10 monitor', ...pattern(8) };
