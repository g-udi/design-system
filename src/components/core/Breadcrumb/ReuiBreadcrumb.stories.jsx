// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'breadcrumb',
  import.meta.glob('../../../../.storybook/fixtures/reui/breadcrumb/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/breadcrumb/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Navigation/Breadcrumb', tags: ['autodocs'], ...catalogueMeta('breadcrumb') };

export const ReuiBreadcrumb1 = { name: 'Basic', ...pattern(1) };
export const ReuiBreadcrumb2 = { name: 'With dropdown menu', ...pattern(2) };
export const ReuiBreadcrumb3 = { name: 'With Next.js links', ...pattern(3) };
export const ReuiBreadcrumb4 = { name: 'Slash separator', ...pattern(4) };
export const ReuiBreadcrumb5 = { name: 'Icons on each item', ...pattern(5) };
export const ReuiBreadcrumb6 = { name: 'Ellipsis for long paths', ...pattern(6) };
export const ReuiBreadcrumb7 = { name: 'Items with avatars', ...pattern(7) };
export const ReuiBreadcrumb8 = { name: 'Double chevron separators', ...pattern(8) };
export const ReuiBreadcrumb9 = { name: 'Inside a card', ...pattern(9) };
export const ReuiBreadcrumb10 = { name: 'Pills inside a frame', ...pattern(10) };
export const ReuiBreadcrumb11 = { name: 'Items with count badges', ...pattern(11) };
export const ReuiBreadcrumb12 = { name: 'Home icon first', ...pattern(12) };
export const ReuiBreadcrumb13 = { name: 'Custom separator', ...pattern(13) };
export const ReuiBreadcrumb14 = { name: 'Button style', ...pattern(14) };
export const ReuiBreadcrumb15 = { name: 'Project, user, and document', ...pattern(15) };
