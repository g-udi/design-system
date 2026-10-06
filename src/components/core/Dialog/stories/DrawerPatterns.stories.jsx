import { auditOpenDialogs } from './auditOpenStates.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { openEachDialog } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'drawer', import.meta.url,
  import.meta.glob('./fixtures/drawer/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/drawer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
const openEach = async (context) => {
  await openEachDialog(context);
  await auditOpenDialogs(context);
};

export default { title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog', tags: ['autodocs'], ...catalogueMeta('drawer') };

export const DrawerEdges = {
  name: 'Drawer from each edge',
  ...pattern('edges', 'A drawer with a scrolling body between a fixed header and footer, opened from the bottom, right, left or top.'),
  play: openEach
};
