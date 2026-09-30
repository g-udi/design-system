// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'slider',
  import.meta.glob('../../../../.storybook/fixtures/reui/slider/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/slider/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Slider', tags: ['autodocs'], ...catalogueMeta('slider') };

export const ReuiSlider1 = { name: 'Basic slider', ...pattern(1) };
export const ReuiSlider2 = { name: 'Disabled slider', ...pattern(2) };
export const ReuiSlider3 = { name: 'Slider with multiple discrete values', ...pattern(3) };
export const ReuiSlider4 = { name: 'Vertical slider with range selection', ...pattern(4) };
export const ReuiSlider5 = { name: 'Slider with controlled value tracking', ...pattern(5) };
export const ReuiSlider6 = { name: 'Slider with range selection', ...pattern(6) };
export const ReuiSlider7 = { name: 'Slider synced with number input', ...pattern(7) };
export const ReuiSlider8 = { name: 'Color temperature slider', ...pattern(8) };
export const ReuiSlider9 = { name: 'Slider with reference labels', ...pattern(9) };
export const ReuiSlider10 = { name: 'Slider with tick marks', ...pattern(10) };
export const ReuiSlider11 = { name: 'Slider with dynamic tooltip indicator', ...pattern(11) };
export const ReuiSlider12 = { name: 'Rating slider with emoji feedback', ...pattern(12) };
