import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'carousel',
  import.meta.glob('../../../../.storybook/fixtures/patterns/carousel/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/carousel/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Carousel', tags: ['autodocs'], ...catalogueMeta('carousel') };

export const CarouselPattern1 = { name: 'Single item', ...pattern(1) };
export const CarouselPattern2 = { name: 'Vertical', ...pattern(2) };
export const CarouselPattern3 = { name: 'Multiple visible items', ...pattern(3) };
export const CarouselPattern4 = { name: 'Responsive basis', ...pattern(4) };
export const CarouselPattern5 = { name: 'Autoplay', ...pattern(5) };
export const CarouselPattern6 = { name: 'Centered slides', ...pattern(6) };
export const CarouselPattern7 = { name: 'Custom spacing', ...pattern(7) };
export const CarouselPattern8 = { name: 'Images with overlays', ...pattern(8) };
export const CarouselPattern9 = { name: 'Thumbnail navigation', ...pattern(9) };
export const CarouselPattern10 = { name: 'Overlay thumbnails', ...pattern(10) };
export const CarouselPattern11 = { name: 'Dots with content overlays', ...pattern(11) };
