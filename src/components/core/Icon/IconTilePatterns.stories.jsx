import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-tile',
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-tile/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-tile/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-tile') };

export const IconTilePattern1 = { name: 'Default icon tile', ...pattern(1) };
export const IconTilePattern2 = { name: 'Elevated icon tile', ...pattern(2) };
export const IconTilePattern3 = { name: 'Framed icon tile', ...pattern(3) };
export const IconTilePattern4 = { name: 'Icon tile variants', ...pattern(4) };
export const IconTilePattern5 = { name: 'Icon tile sizes', ...pattern(5) };
export const IconTilePattern6 = { name: 'Circular icon tiles', ...pattern(6) };
export const IconTilePattern7 = { name: 'Custom icon tile sizing', ...pattern(7) };
export const IconTilePattern8 = { name: 'Icon tile tones', ...pattern(8) };
export const IconTilePattern9 = { name: 'Icon tile with text', ...pattern(9) };
export const IconTilePattern10 = { name: 'Icon tile in a list row', ...pattern(10) };
export const IconTilePattern11 = { name: 'Icon tile in a feature card', ...pattern(11) };
export const IconTilePattern12 = { name: 'Icon tile in an empty state', ...pattern(12) };
export const IconTilePattern13 = { name: 'Interactive icon tile', ...pattern(13) };
export const IconTilePattern14 = { name: 'Icon tile with status overlay', ...pattern(14) };
export const IconTilePattern15 = { name: 'Soft icon tile tones', ...pattern(15) };
export const IconTilePattern16 = { name: 'Solid icon tile tones', ...pattern(16) };
export const IconTilePattern17 = { name: 'Icon tile with a custom fill', ...pattern(17, 'An elevated tile filled with a Tailwind color.') };
