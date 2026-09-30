import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-tile',
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-tile/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/icon-tile/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Icon', id: 'core-icon', tags: ['autodocs'], ...catalogueMeta('icon-tile') };

export const IconTilePattern4 = { name: 'Variants, sizes and shapes', ...pattern(4, 'Every variant and size, circular tiles, custom sizing through a class or the size variables, and text or status content.') };
export const IconTilePattern8 = { name: 'Tones', ...pattern(8, 'Soft and solid tiles in each semantic tone, tinted outline tiles, and elevated tiles with a custom fill.') };
export const IconTilePattern11 = { name: 'In a card, list row and empty state', ...pattern(11, 'Tiles as media in a feature card, a list row with an interactive link tile, and an empty state.') };
