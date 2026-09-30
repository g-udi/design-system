import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'alert',
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Banner', tags: ['autodocs'], ...catalogueMeta('alert') };

export const AlertPattern2 = { name: 'Alert: Variants', ...pattern(2, 'Default with and without an icon, then info, success, warning, destructive and invert.') };
export const AlertPattern3 = { name: 'Alert: Actions and rich content', ...pattern(3, 'Actions beside a title and description, a title alone, or a description alone, plus a destructive alert with a list.') };
export const AlertPattern18 = {
  name: 'Alert: Dismissible notices',
  ...pattern(18, 'A feature announcement with a close button, an inverted upgrade promo, and a billing notice, each removed by its action.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('alert')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss analytics notice' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(canvas.getAllByRole('alert')).toHaveLength(1));
    await userEvent.click(canvas.getByRole('button', { name: 'Restore notices' }));
    await waitFor(() => expect(canvas.getAllByRole('alert')).toHaveLength(3));
  }
};
export const AlertPattern17 = { name: 'Alert: Service status summary', ...pattern(17, 'Flush alerts stacked in a frame.') };
export const AlertPattern19 = { name: 'Alert: Message notification', ...pattern(19, 'An avatar in place of the icon, in the default and inverted variants.') };
