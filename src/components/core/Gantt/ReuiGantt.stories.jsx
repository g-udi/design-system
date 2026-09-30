// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'gantt',
  import.meta.glob('../../../../.storybook/fixtures/reui/gantt/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/gantt/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Gantt', tags: ['autodocs'], ...catalogueMeta('gantt') };

export const ReuiGantt1 = { name: 'Gantt chart with settings menu and schedulable rows', ...pattern(1) };
export const ReuiGantt2 = { name: 'Gantt chart with drag-to-reorder tree rows', ...pattern(2) };
export const ReuiGantt3 = { name: 'Gantt chart with quarter roadmap and rollups', ...pattern(3) };
export const ReuiGantt4 = { name: 'Gantt chart with weekly capacity board', ...pattern(4) };
export const ReuiGantt5 = { name: 'Gantt chart with task table and progress', ...pattern(5) };
export const ReuiGantt6 = { name: 'Gantt chart with as-built baseline tracking', ...pattern(6) };
export const ReuiGantt7 = { name: 'Gantt chart with dependency arrows and milestones', ...pattern(7) };
