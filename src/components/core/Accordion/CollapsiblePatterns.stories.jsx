import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'collapsible',
  import.meta.glob('../../../../.storybook/fixtures/patterns/collapsible/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/collapsible/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Accordion', tags: ['autodocs'], ...catalogueMeta('collapsible') };

export const CollapsiblePattern1 = { name: 'Collapsible: Basic collapsible', ...pattern(1) };
export const CollapsiblePattern2 = { name: 'Collapsible: Collapsible with checkbox settings', ...pattern(2) };
export const CollapsiblePattern3 = { name: 'Collapsible: Collapsible animated card', ...pattern(3) };
export const CollapsiblePattern4 = { name: 'Collapsible: Collapsible card with bottom trigger', ...pattern(4) };
export const CollapsiblePattern5 = { name: 'Collapsible: Collapsible form fields', ...pattern(5) };
export const CollapsiblePattern6 = { name: 'Collapsible: Collapsible frame', ...pattern(6) };
export const CollapsiblePattern7 = { name: 'Collapsible: Nested collapsible list with actions', ...pattern(7) };
export const CollapsiblePattern8 = { name: 'Collapsible: Collapsible User profile', ...pattern(8) };
export const CollapsiblePattern9 = { name: 'Collapsible: Multi-level collapsible menu', ...pattern(9) };
export const CollapsiblePattern10 = { name: 'Collapsible: Tree view with file actions', ...pattern(10, 'Compact file explorer with expandable folders, selection, and keyboard-accessible actions. Downloads contain illustrative file content; deleting and restoring files affects only this demo.') };
