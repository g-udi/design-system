// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'breadcrumb',
  import.meta.glob('../../../../.storybook/fixtures/reui/breadcrumb/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/breadcrumb/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Navigation/Breadcrumb', tags: ['autodocs'], ...catalogueMeta('breadcrumb') };

export const ReuiBreadcrumb1 = { name: 'Basic breadcrumb', ...pattern(1) };
export const ReuiBreadcrumb2 = { name: 'Breadcrumb with dropdown menu', ...pattern(2) };
export const ReuiBreadcrumb3 = { name: 'Breadcrumb with Next.js link', ...pattern(3) };
export const ReuiBreadcrumb4 = { name: 'Breadcrumb with a custom slash separator', ...pattern(4) };
export const ReuiBreadcrumb5 = { name: 'Breadcrumb with icons for each item', ...pattern(5) };
export const ReuiBreadcrumb6 = { name: 'Breadcrumb with ellipsis for long paths', ...pattern(6) };
export const ReuiBreadcrumb7 = { name: 'Breadcrumb items with avatars', ...pattern(7) };
export const ReuiBreadcrumb8 = { name: 'Breadcrumb with double chevron separators', ...pattern(8) };
export const ReuiBreadcrumb9 = { name: 'Breadcrumb inside card', ...pattern(9) };
export const ReuiBreadcrumb10 = { name: 'Pill-style breadcrumb inside frame', ...pattern(10) };
export const ReuiBreadcrumb11 = { name: 'Breadcrumb items containing badge with count', ...pattern(11) };
export const ReuiBreadcrumb12 = { name: 'Breadcrumb starting with home icon item', ...pattern(12) };
export const ReuiBreadcrumb13 = { name: 'Breadcrumb with a custom separator', ...pattern(13) };
export const ReuiBreadcrumb14 = { name: 'Button-style breadcrumb', ...pattern(14) };
export const ReuiBreadcrumb15 = { name: 'Breadcrumb with project, user and document info', ...pattern(15) };
