import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'breadcrumb',
  import.meta.glob('../../../../.storybook/fixtures/patterns/breadcrumb/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/breadcrumb/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Breadcrumb', tags: ['autodocs'], ...catalogueMeta('breadcrumb') };

export const BreadcrumbPattern1 = { name: 'Basic', ...pattern(1) };
export const BreadcrumbPattern2 = { name: 'With dropdown menu', ...pattern(2) };
export const BreadcrumbPattern3 = { name: 'With Next.js links', ...pattern(3) };
export const BreadcrumbPattern4 = { name: 'Slash separator', ...pattern(4) };
export const BreadcrumbPattern5 = { name: 'Icons on each item', ...pattern(5) };
export const BreadcrumbPattern6 = { name: 'Ellipsis for long paths', ...pattern(6) };
export const BreadcrumbPattern7 = { name: 'Items with avatars', ...pattern(7) };
export const BreadcrumbPattern8 = { name: 'Double chevron separators', ...pattern(8) };
export const BreadcrumbPattern9 = { name: 'Inside a card', ...pattern(9) };
export const BreadcrumbPattern10 = { name: 'Pills inside a frame', ...pattern(10) };
export const BreadcrumbPattern11 = { name: 'Items with count badges', ...pattern(11) };
export const BreadcrumbPattern12 = { name: 'Home icon first', ...pattern(12) };
export const BreadcrumbPattern13 = { name: 'Custom separator', ...pattern(13) };
export const BreadcrumbPattern14 = { name: 'Button style', ...pattern(14) };
export const BreadcrumbPattern15 = { name: 'Project, user, and document', ...pattern(15) };
