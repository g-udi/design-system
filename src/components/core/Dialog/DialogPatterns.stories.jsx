import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions, openEachDialog } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'dialog',
  import.meta.glob('../../../../.storybook/fixtures/patterns/dialog/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/dialog/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
const openEach = openEachDialog;

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('dialog') };

export const DialogPattern1 = {
  name: 'Form dialog',
  ...pattern(1),
  play: catalogueInteractions['dialog-1']
};
export const DialogPattern6 = {
  name: 'Scrollable content',
  ...pattern(6, 'Long content three ways: the body scrolls on its own, the footer stays pinned, or the dialog fills the screen with a sticky header and footer.'),
  play: openEach
};
export const DialogPattern4 = {
  name: 'Close button and footer options',
  ...pattern(4, 'Hide the corner close button, restyle it, or end with one full-width action.'),
  play: openEach
};
export const DialogPattern8 = { name: 'Settings with switches', ...pattern(8) };
export const DialogPattern9 = { name: 'Keyboard shortcuts list', ...pattern(9) };
