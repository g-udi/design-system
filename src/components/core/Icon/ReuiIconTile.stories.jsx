// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'icon-tile',
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-tile/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-tile/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-tile') };

export const ReuiIconTile1 = { name: 'Icon Tile: Default icon tile', ...pattern(1) };
export const ReuiIconTile2 = { name: 'Icon Tile: Elevated icon tile', ...pattern(2, 'Icon tile with elevated surface') };
export const ReuiIconTile3 = { name: 'Icon Tile: Framed icon tile', ...pattern(3, 'Icon tile with framed surface') };
export const ReuiIconTile4 = { name: 'Icon Tile: All variants', ...pattern(4, 'Every icon tile variant') };
export const ReuiIconTile5 = { name: 'Icon Tile: Sizes', ...pattern(5, 'Icon tile size scale') };
export const ReuiIconTile6 = { name: 'Icon Tile: Circular tiles', ...pattern(6, 'Icon tiles with circular shape') };
export const ReuiIconTile7 = { name: 'Icon Tile: Custom sizing', ...pattern(7, 'Icon tile with custom sizing') };
export const ReuiIconTile8 = { name: 'Icon Tile: Color tones', ...pattern(8, 'Semantic icon tile color tones') };
export const ReuiIconTile9 = { name: 'Icon Tile: Text content', ...pattern(9, 'Icon tile with text content') };
export const ReuiIconTile10 = { name: 'Icon Tile: List row', ...pattern(10, 'Icon tile in a list row') };
export const ReuiIconTile11 = { name: 'Icon Tile: Feature card', ...pattern(11, 'Icon tile in a feature card') };
export const ReuiIconTile12 = { name: 'Icon Tile: Empty state', ...pattern(12, 'Icon tile in an empty state') };
export const ReuiIconTile13 = { name: 'Icon Tile: Interactive tile', ...pattern(13, 'Interactive icon tile') };
export const ReuiIconTile14 = { name: 'Icon Tile: Status overlay', ...pattern(14, 'Icon tile with status overlay') };
export const ReuiIconTile15 = { name: 'Icon Tile: Soft tones', ...pattern(15, 'Tone-adjustable soft variant') };
export const ReuiIconTile16 = { name: 'Icon Tile: Solid tones', ...pattern(16, 'Tone-adjustable solid variant') };
export const ReuiIconTile17 = { name: 'Icon Tile: Brand colors', ...pattern(17, 'Elevated tile with a Tailwind color fill') };
