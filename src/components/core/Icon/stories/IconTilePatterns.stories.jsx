import { expect, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'icon-tile', import.meta.url,
  import.meta.glob('./fixtures/icon-tile/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/icon-tile/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', id: 'core-icon', tags: ['autodocs'], ...catalogueMeta('icon-tile') };

export const IconTileVariants = { name: 'Variants, sizes and shapes', ...pattern('variants', 'Every variant and size, circular tiles, custom sizing through a class or the size variables, and text or status content.') };
export const IconTileTones = { name: 'Tones', ...pattern('tones', 'Soft and solid tiles in each semantic tone, tinted outline tiles, and elevated tiles with a custom fill.') };
export const IconTileInContext = {
  name: 'In a card, list row and empty state', ...pattern('in-context', 'Tiles as media in a feature card, a list row with an interactive link tile, and an empty state.'),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Open settings' })).toHaveAttribute('href', '/reports/quarterly/settings');
  }
};
