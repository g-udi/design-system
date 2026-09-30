import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'drawer',
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/drawer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
async function openEach({ canvasElement }) {
  const body = within(canvasElement.ownerDocument.body);
  for (const trigger of within(canvasElement).getAllByRole('button')) {
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  }
}

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('drawer') };

export const DrawerPattern5 = {
  name: 'Drawer from each edge',
  ...pattern(5, 'A drawer with a scrolling body between a fixed header and footer, opened from the bottom, right, left or top.'),
  play: openEach
};
