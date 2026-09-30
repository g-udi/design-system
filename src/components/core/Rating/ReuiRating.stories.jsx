// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'rating',
  import.meta.glob('../../../../.storybook/fixtures/reui/rating/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/rating/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Rating', tags: ['autodocs'], ...catalogueMeta('rating') };

export const ReuiRating1 = { name: 'Basic rating', ...pattern(1) };
export const ReuiRating2 = { name: 'Rating with decimal value', ...pattern(2) };
export const ReuiRating3 = { name: 'Rating with show value', ...pattern(3) };
export const ReuiRating4 = { name: 'Rating with editable', ...pattern(4) };
export const ReuiRating5 = { name: 'Rating with size', ...pattern(5) };
export const ReuiRating6 = { name: 'Rating with review summary', ...pattern(6) };
export const ReuiRating7 = { name: 'Interactive half-star rating', ...pattern(7) };
export const ReuiRating8 = { name: 'Emoji reaction rating', ...pattern(8) };
export const ReuiRating9 = { name: 'Rating with review text input', ...pattern(9) };
