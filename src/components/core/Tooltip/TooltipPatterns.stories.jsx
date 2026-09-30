import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'tooltip',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tooltip/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tooltip/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tooltip', tags: ['autodocs'], ...catalogueMeta('tooltip') };

export const TooltipPattern1 = { name: 'Basic tooltip', ...pattern(1) };
export const TooltipPattern2 = { name: 'Sides', ...pattern(2) };
export const TooltipPattern3 = { name: 'Icon trigger', ...pattern(3) };
export const TooltipPattern4 = { name: 'Keyboard shortcut', ...pattern(4) };
export const TooltipPattern5 = { name: 'Notification bell with count', ...pattern(5) };
export const TooltipPattern6 = { name: 'Status badge', ...pattern(6) };
export const TooltipPattern7 = { name: 'Icon and description', ...pattern(7) };
export const TooltipPattern8 = { name: 'Toolbar actions', ...pattern(8) };
export const TooltipPattern9 = { name: 'Warning badge', ...pattern(9) };
export const TooltipPattern10 = { name: 'Feature badge and upgrade link', ...pattern(10) };
export const TooltipPattern11 = { name: 'Avatar and role badge', ...pattern(11) };
export const TooltipPattern12 = { name: 'Disabled button with wrapper', ...pattern(12) };
export const TooltipPattern13 = { name: 'Online status indicator', ...pattern(13) };
export const TooltipPattern14 = { name: 'File info and badges', ...pattern(14) };
export const TooltipPattern15 = { name: 'Label badges', ...pattern(15) };
export const TooltipPattern16 = { name: 'Action button inside', ...pattern(16) };
