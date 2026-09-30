import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'popover',
  import.meta.glob('../../../../.storybook/fixtures/patterns/popover/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/popover/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/Popover', id: 'core-popover', tags: ['autodocs'], ...catalogueMeta('popover') };

export const PopoverPattern1 = { name: 'Sides and alignment', ...pattern(1, 'Each side and each alignment, with a header, title and description.') };
export const PopoverPattern3 = { name: 'Settings form', ...pattern(3, 'Inputs, switches and a slider in a sectioned panel.') };
export const PopoverPattern6 = { name: 'Rich content', ...pattern(6, 'A profile card, a feature promotion with a tinted header, and a media preview with actions.') };
export const PopoverPattern11 = { name: 'Paged content', ...pattern(11, 'Step through release notes inside the panel without closing it.') };
export const PopoverPattern5 = { name: 'Inside a dialog', ...pattern(5, 'A popover and a hover card opened from inside a modal dialog.') };
