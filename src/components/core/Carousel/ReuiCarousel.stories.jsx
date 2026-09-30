// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'carousel',
  import.meta.glob('../../../../.storybook/fixtures/reui/carousel/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/carousel/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Carousel', tags: ['autodocs'], ...catalogueMeta('carousel') };

export const ReuiCarousel1 = { name: 'Basic carousel with single item', ...pattern(1) };
export const ReuiCarousel2 = { name: 'Vertical carousel orientation', ...pattern(2) };
export const ReuiCarousel3 = { name: 'Carousel with multiple items visible', ...pattern(3) };
export const ReuiCarousel4 = { name: 'Carousel with responsive basis', ...pattern(4) };
export const ReuiCarousel5 = { name: 'Carousel with autoplay plugin', ...pattern(5) };
export const ReuiCarousel6 = { name: 'Carousel with centered slide alignment', ...pattern(6) };
export const ReuiCarousel7 = { name: 'Carousel with custom spacing', ...pattern(7) };
export const ReuiCarousel8 = { name: 'Carousel with images and overlays', ...pattern(8) };
export const ReuiCarousel9 = { name: 'Carousel with thumbnail navigation', ...pattern(9) };
export const ReuiCarousel10 = { name: 'Carousel with overlay thumbnail navigation', ...pattern(10) };
export const ReuiCarousel11 = { name: 'Carousel with dots navigation and content overlays', ...pattern(11) };
