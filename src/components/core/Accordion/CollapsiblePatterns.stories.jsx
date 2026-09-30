import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'collapsible',
  import.meta.glob('../../../../.storybook/fixtures/patterns/collapsible/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/collapsible/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Accordion', tags: ['autodocs'], ...catalogueMeta('collapsible') };

export const CollapsiblePattern1 = { name: 'Collapsible: Show more details', ...pattern(1, 'An icon button reveals the rest of an order summary under the always-visible status.') };
export const CollapsiblePattern7 = {
  name: 'Collapsible: Framed sections',
  ...pattern(7, 'Stacked frames whose headers toggle a release note, a key list with row actions, and a profile. With an action in the header, only the title is the trigger.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const keys = canvas.getByRole('button', { name: 'API keys' });
    await expect(keys).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(keys);
    await expect(keys).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', { name: 'Add key' })).toBeVisible();
    await userEvent.click(keys);
    const profile = canvas.getByRole('button', { name: /@alexjohnson/ });
    await userEvent.click(profile);
    await expect(canvas.getByText('Toronto, Canada')).toBeVisible();
  }
};
export const CollapsiblePattern4 = { name: 'Collapsible: Card with bottom trigger', ...pattern(4, 'A usage card whose breakdown opens from a button on the bottom edge.') };
export const CollapsiblePattern5 = { name: 'Collapsible: Advanced form fields', ...pattern(5, 'A controlled collapsible that hides optional pricing fields behind a settings button.') };
export const CollapsiblePattern10 = { name: 'Collapsible: Tree view with file actions', ...pattern(10, 'Compact file explorer with expandable folders, selection, and keyboard-accessible actions. Downloads contain illustrative file content; deleting and restoring files affects only this demo.') };
