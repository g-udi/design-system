import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'card',
  import.meta.glob('../../../../.storybook/fixtures/patterns/card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Card', tags: ['autodocs'], ...catalogueMeta('card') };

export const CardPattern1 = { name: 'Basic', ...pattern(1) };
export const CardPattern2 = { name: 'Header with border', ...pattern(2) };
export const CardPattern3 = { name: 'Bordered sections', ...pattern(3) };
export const CardPattern4 = { name: 'Header and footer', ...pattern(4) };
export const CardPattern5 = { name: 'With link', ...pattern(5) };
export const CardPattern6 = { name: 'With dropdown menu', ...pattern(6) };
export const CardPattern7 = { name: 'With image', ...pattern(7) };
export const CardPattern8 = { name: 'Image zoom on hover', ...pattern(8) };
export const CardPattern9 = { name: 'Full-bleed image', ...pattern(9) };
export const CardPattern10 = { name: 'Image with shadow fade', ...pattern(10) };
export const CardPattern11 = { name: 'Stacked depth', ...pattern(11) };
export const CardPattern12 = { name: 'Login form', ...pattern(12) };
export const CardPattern13 = { name: 'Expandable billing usage', ...pattern(13) };
export const CardPattern14 = { name: 'Deployment status', ...pattern(14) };
export const CardPattern15 = { name: 'Stat with trend and menu', ...pattern(15) };
export const CardPattern16 = { name: 'Header badge and actions', ...pattern(16) };
export const CardPattern17 = { name: 'Icon, title, and link', ...pattern(17) };
export const CardPattern18 = { name: 'Header label and link', ...pattern(18) };
