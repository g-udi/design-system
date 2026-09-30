// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'icon-tile',
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-tile/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-tile/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-tile') };

export const ReuiIconTile1 = { name: 'Default icon tile', ...pattern(1) };
export const ReuiIconTile2 = { name: 'Elevated icon tile', ...pattern(2) };
export const ReuiIconTile3 = { name: 'Framed icon tile', ...pattern(3) };
export const ReuiIconTile4 = { name: 'Icon tile variants', ...pattern(4) };
export const ReuiIconTile5 = { name: 'Icon tile sizes', ...pattern(5) };
export const ReuiIconTile6 = { name: 'Circular icon tiles', ...pattern(6) };
export const ReuiIconTile7 = { name: 'Custom icon tile sizing', ...pattern(7) };
export const ReuiIconTile8 = { name: 'Icon tile tones', ...pattern(8) };
export const ReuiIconTile9 = { name: 'Icon tile with text', ...pattern(9) };
export const ReuiIconTile10 = { name: 'Icon tile in a list row', ...pattern(10) };
export const ReuiIconTile11 = { name: 'Icon tile in a feature card', ...pattern(11) };
export const ReuiIconTile12 = { name: 'Icon tile in an empty state', ...pattern(12) };
export const ReuiIconTile13 = { name: 'Interactive icon tile', ...pattern(13) };
export const ReuiIconTile14 = { name: 'Icon tile with status overlay', ...pattern(14) };
export const ReuiIconTile15 = { name: 'Soft icon tile tones', ...pattern(15) };
export const ReuiIconTile16 = { name: 'Solid icon tile tones', ...pattern(16) };
export const ReuiIconTile17 = { name: 'Icon tile with a custom fill', ...pattern(17, 'An elevated tile filled with a Tailwind color.') };
