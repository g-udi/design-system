// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'carousel',
  import.meta.glob('../../../../.storybook/fixtures/reui/carousel/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/carousel/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Carousel', tags: ['autodocs'], ...catalogueMeta('carousel') };

export const ReuiCarousel1 = { name: 'Single item', ...pattern(1) };
export const ReuiCarousel2 = { name: 'Vertical', ...pattern(2) };
export const ReuiCarousel3 = { name: 'Multiple visible items', ...pattern(3) };
export const ReuiCarousel4 = { name: 'Responsive basis', ...pattern(4) };
export const ReuiCarousel5 = { name: 'Autoplay', ...pattern(5) };
export const ReuiCarousel6 = { name: 'Centered slides', ...pattern(6) };
export const ReuiCarousel7 = { name: 'Custom spacing', ...pattern(7) };
export const ReuiCarousel8 = { name: 'Images with overlays', ...pattern(8) };
export const ReuiCarousel9 = { name: 'Thumbnail navigation', ...pattern(9) };
export const ReuiCarousel10 = { name: 'Overlay thumbnails', ...pattern(10) };
export const ReuiCarousel11 = { name: 'Dots with content overlays', ...pattern(11) };
