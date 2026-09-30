import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { openEachDialog } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'sheet',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

/** Opens each trigger in turn, then closes the dialog with Escape and checks focus returns to it. */
const openEach = openEachDialog;

export default { title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog', tags: ['autodocs'], ...catalogueMeta('sheet') };

export const SheetPattern1 = {
  name: 'Sheet with a form',
  ...pattern(1, 'A profile form in a side sheet. The switch shows or hides the corner close button.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Edit profile' });
    await userEvent.click(trigger);
    let sheet = await body.findByRole('dialog', { name: 'Edit profile' });
    await waitFor(() => expect(within(sheet).getByRole('button', { name: 'Close' })).toBeVisible());
    await userEvent.click(within(sheet).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(sheet).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
    await userEvent.click(trigger);
    sheet = await body.findByRole('dialog', { name: 'Edit profile' });
    await expect(within(sheet).queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(sheet).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
  }
};
export const SheetPattern3 = {
  name: 'Sheet from each edge',
  ...pattern(3, 'A sheet with a scrolling body between a fixed header and footer, opened from the right, left, top or bottom.'),
  play: openEach
};
