import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';

const pattern = patternStories(
  'sortable', import.meta.url,
  import.meta.glob('./fixtures/sortable/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sortable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Sortable', id: 'core-sortable', tags: ['autodocs'], ...catalogueMeta('sortable') };

export const RowControls = { name: 'List with row controls', ...pattern('row-controls', 'Rows reorder by their handle while the switch in each row stays clickable; the first row becomes the cover.'), play: catalogueInteractions['sortable-row-controls'] };
export const MediaGrid = { name: 'Media grid', ...pattern('media-grid', 'The grid strategy with a featured tile spanning two cells and handles that appear on hover.') };
export const Nested = { name: 'Nested lists', ...pattern('nested', 'Groups and the values inside each group reorder independently.') };
export const Persisted = { name: 'Persisted order', ...pattern('persisted', 'Persist the new order with `onValueCommit`, update optimistically, and roll back with a toast on failure.'), play: async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  for (const fail of [false, true]) {
    if (fail) await userEvent.click(canvas.getByRole('switch', {name: 'Simulate a failed save'}));
    const before = [...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value);
    canvas.getAllByRole('button', {name: 'Reorder item'})[0].focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(body.getByText('Saving order...')).toBeVisible());
    await expect(canvas.getByRole('switch', {name: 'Simulate a failed save'})).toBeDisabled();
    if (fail) {
      await expect(await body.findByText('Could not save the new order. Restored.')).toBeVisible();
      await waitFor(() => expect([...canvasElement.querySelectorAll('[data-slot="sortable-item"]')].map((item) => item.dataset.value)).toEqual(before));
    } else {
      await expect(await body.findByText('Saved "Outline the essay" at position 2')).toBeVisible();
    }
    await userEvent.click(body.getByRole('button', {name: /close toast/i}));
    await waitFor(() => expect(body.queryByRole('button', {name: /close toast/i})).not.toBeInTheDocument());
  }
  await userEvent.click(canvas.getByRole('switch', {name: 'Simulate a failed save'}));
} };
