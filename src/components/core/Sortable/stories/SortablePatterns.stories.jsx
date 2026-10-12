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
export const MediaGrid = {
  name: 'Media grid',
  ...pattern('media-grid', 'The grid strategy with a featured tile spanning two cells and handles that appear on hover.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = () => [...canvasElement.querySelectorAll('[data-slot="sortable"] > [data-slot="sortable-item"]')];
    const before = items().map(item => item.dataset.value);
    const images = new Map(items().map(item => [item.dataset.value, item.querySelector('img').getAttribute('src')]));
    const handle = canvas.getAllByRole('button', { name: 'Reorder item' })[1];
    handle.focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(items().map(item => item.dataset.value)).not.toEqual(before));
    for (const item of items()) await expect(item.querySelector('img')).toHaveAttribute('src', images.get(item.dataset.value));
    // Cancelling a keyboard drag must preserve the committed order.
    const committed = items().map(item => item.dataset.value);
    canvas.getAllByRole('button', { name: 'Reorder item' })[0].focus();
    await userEvent.keyboard(' {ArrowRight}{Escape}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sortable"]')).toHaveAttribute('data-dragging', 'false'));
    await expect(items().map(item => item.dataset.value)).toEqual(committed);
  }
};
export const Nested = {
  name: 'Nested lists',
  ...pattern('nested', 'Groups and the values inside each group reorder independently.'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const parent = canvasElement.querySelector('[data-slot="sortable"]');
    const values = root => [...root.querySelectorAll(':scope > [data-slot="sortable-item"]')].map(item => item.dataset.value);
    const colors = parent.querySelector('[data-value="1"]');
    const child = colors.querySelector('[data-slot="sortable"]');
    within(child).getAllByRole('button', { name: 'Reorder item' })[0].focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(values(child)).toEqual(['1-2', '1-1', '1-3', '1-4']));
    await expect(values(parent)).toEqual(['1', '2', '3']);
    within(colors).getAllByRole('button', { name: 'Reorder item' })[0].focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => expect(values(parent)).toEqual(['2', '1', '3']));
    await expect(values(child)).toEqual(['1-2', '1-1', '1-3', '1-4']);
    for (const button of body.queryAllByRole('button', { name: /close toast/i })) await userEvent.click(button);
    // The drop overlay temporarily fades its source item; run axe after it settles.
    await waitFor(() => {
      for (const item of canvasElement.querySelectorAll('[data-slot="sortable-item"]')) {
        expect(getComputedStyle(item).opacity).toBe('1');
        expect(item).toHaveAttribute('data-dragging', 'false');
      }
    });
  }
};
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
