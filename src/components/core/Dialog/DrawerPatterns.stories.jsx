import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { openEachDialog } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'drawer',
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
const openEach = openEachDialog;

export default { title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog', tags: ['autodocs'], ...catalogueMeta('drawer') };

export const DrawerPattern5 = {
  name: 'Drawer from each edge',
  ...pattern(5, 'A drawer with a scrolling body between a fixed header and footer, opened from the bottom, right, left or top.'),
  play: openEach
};
