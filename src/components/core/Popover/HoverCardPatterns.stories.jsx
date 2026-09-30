import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'hover-card',
  import.meta.glob('../../../../.storybook/fixtures/patterns/hover-card/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/hover-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Popover', tags: ['autodocs'], ...catalogueMeta('hover-card') };

export const HoverCardPattern3 = { name: 'Rich hover cards', ...pattern(3, 'A profile preview on a link, a feature note with an icon, and an image preview.') };
export const HoverCardPattern7 = { name: 'Relative timestamp', ...pattern(7, 'Hover a relative time to see the exact time in UTC and the local time zone.') };
export const HoverCardPattern2 = { name: 'Sides', ...pattern(2) };
