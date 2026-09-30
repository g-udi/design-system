import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'tooltip',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tooltip/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tooltip/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/Tooltip', id: 'core-tooltip', tags: ['autodocs'], ...catalogueMeta('tooltip') };

export const TooltipPattern2 = { name: 'Sides', ...pattern(2) };
export const TooltipPattern6 = { name: 'Status and metadata', ...pattern(6, 'File details, labels, an inline verified mark, service status and a warning, each on its own trigger.') };
export const TooltipPattern11 = { name: 'People', ...pattern(11, 'An avatar stack where each tooltip shows the role badge and online status.') };
export const TooltipPattern5 = { name: 'Interactive content', ...pattern(5, 'Tooltips that hold a link or an action: a notification summary and an upgrade prompt.') };
export const TooltipPattern12 = { name: 'Disabled button', ...pattern(12, 'Wrap a disabled button in a span so it can still show why it is disabled.') };
