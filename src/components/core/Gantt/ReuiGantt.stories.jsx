// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'gantt',
  import.meta.glob('../../../../.storybook/fixtures/reui/gantt/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/gantt/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Gantt', tags: ['autodocs'], ...catalogueMeta('gantt') };

export const ReuiGantt1 = { name: 'Settings menu and schedulable rows', ...pattern(1) };
export const ReuiGantt2 = { name: 'Drag-to-reorder tree rows', ...pattern(2) };
export const ReuiGantt3 = { name: 'Quarter roadmap with rollups', ...pattern(3) };
export const ReuiGantt4 = { name: 'Weekly capacity board', ...pattern(4) };
export const ReuiGantt5 = { name: 'Task table with progress', ...pattern(5) };
export const ReuiGantt6 = { name: 'Baseline tracking', ...pattern(6) };
export const ReuiGantt7 = { name: 'Dependencies and milestones', ...pattern(7) };
