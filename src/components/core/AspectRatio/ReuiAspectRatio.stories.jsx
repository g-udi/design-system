// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'aspect-ratio',
  import.meta.glob('../../../../.storybook/fixtures/reui/aspect-ratio/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/aspect-ratio/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/AspectRatio', tags: ['autodocs'], ...catalogueMeta('aspect-ratio') };

export const ReuiAspectRatio1 = { name: '16:9 widescreen aspect ratio', ...pattern(1) };
export const ReuiAspectRatio2 = { name: '4:3 standard aspect ratio', ...pattern(2) };
export const ReuiAspectRatio3 = { name: '1:1 square aspect ratio', ...pattern(3) };
export const ReuiAspectRatio4 = { name: '21:9 ultrawide aspect ratio', ...pattern(4) };
export const ReuiAspectRatio5 = { name: '9:16 portrait aspect ratio', ...pattern(5) };
export const ReuiAspectRatio6 = { name: '3:2 classic photography aspect ratio', ...pattern(6) };
export const ReuiAspectRatio7 = { name: '4:5 social media portrait aspect ratio', ...pattern(7) };
export const ReuiAspectRatio8 = { name: '16:10 computer monitor aspect ratio', ...pattern(8) };
